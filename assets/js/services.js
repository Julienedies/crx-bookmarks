'use strict';

/**
 * 
 * Services
 * 
 */

var bmServices = angular.module('bmServices', ['ngResource']);

bmServices.factory('ex', ['$q','$rootScope', function($q, $rootScope) {
	
}]);

/*
 * 打包工具函数
 */
bmServices.factory('bmUtils', ['$q', function($q) {
	
	return {
			to64: function(url){
		
				var deferred = $q.defer();
		
				var img = document.createElement('img');
		
				img.onload = function(){
					var data64;
					var imgCanvas = document.createElement("canvas");
					var imgContext = imgCanvas.getContext("2d");

					imgCanvas.width = img.width;
					imgCanvas.height = img.height;

					imgContext.drawImage(img, 0, 0, img.width, img.height);

					data64 = imgCanvas.toDataURL("image/png");	
			 
					deferred.resolve(data64);
				};
				
				img.onerror = function(){
					deferred.reject();
				};
		
				img.src = url;
		
				return deferred.promise;
			}
		};
	
}]);


/*
 * d3
 */
bmServices.factory('d3', ['$rootScope', function($rootScope) {
	return d3;
}]);



/*
 * 封装 chrome.tabs接口;
 */
bmServices.factory('cTabsInterface', ['$q', '$rootScope', function($q, $rootScope) {
	
	var cInterface = {};
	
	var _interface = chrome.tabs;
	
	var events = ['onChanged'];
	
	var fs = ['getSelected'];
	
	var fn;
	
	for(var i in _interface){
		
		fn = _interface[i];
		
		if(fn.constructor === Function){
			cInterface[i] = (function(i){
				
				return function(){
					var deferred = $q.defer();
					
					var args = Array.prototype.slice.call(arguments, 0);
					
					var call = function(data){
						deferred.resolve(data);
					};
					
					args.push(call); 
					
					_interface[i].apply(_interface, args);
					
					return deferred.promise;				
				};

			})(i);			
		}
		
	}
	
	return cInterface;
	
}]);



/*
 * 对chrome.bookmarks进行封装,做为一个service提供给其它模块使用;
 */
bmServices.factory('cbInterface', ['$q','$rootScope', function($q, $rootScope) {
	
	var cbInterface = {};
	
	var _interface = chrome.bookmarks;
	
	var events = ['onCreated', 'onRemoved', 'onChanged', 'onMoved', 'onChildrenReordered', 'onImportBegan', 'onImportEnded'];
	
	var fs = ['get', 'getChildren', 'getRecent', 'getTree', 'getSubTree', 'search', 'create', 'move', 'update', 'remove', 'removeTree'];
	
	// 封装chrome.bookmarks接口
	for(var i in fs){
		
		i = fs[i];
		
		cbInterface[i] = (function(i){
			
			return function(){
				var deferred = $q.defer();
				
				var args = Array.prototype.slice.call(arguments, 0);
				
				var call = function(data){
					deferred.resolve(data);
				};
				
				args.push(call); 
				
				_interface[i].apply(_interface, args);
				
				return deferred.promise;				
			};

		})(i);
		
	}
	
	// 注册事件监听函数
	for(var j in events){
		
		j = events[j];
		
		var callback = (function(j){
			
			return function(){
				var args = Array.prototype.slice.call(arguments, 0); 
				console.log('chrome.bookmarks',j);
				args.unshift(j);
				$rootScope.$broadcast('bookmarkTree.change',args);
			};
			
		})(j);
		
		_interface[j].addListener(callback);
		
	}
	
	return cbInterface;
	
}]);



/*
 * 封装 chrome.storage接口;
 */
bmServices.factory('cStorageInterface', ['$q', '$rootScope', function($q, $rootScope) {
	
	var cStorageInterface = {};
	
	var _interface = chrome.storage.sync;
	
	var events = ['onChanged'];
	
	var fs = ['get', 'set', 'remove', 'clear'];
	
	var fn;
	
	for(var i in _interface){
		
		fn = _interface[i];
		
		if(fn.constructor === Function){
			cStorageInterface[i] = (function(i){
				
				return function(){
					var deferred = $q.defer();
					
					var args = Array.prototype.slice.call(arguments, 0);
					
					var call = function(data){
						deferred.resolve(data);
					};
					
					args.push(call); 
					
					_interface[i].apply(_interface, args);
					
					return deferred.promise;				
				};

			})(i);			
		}
		
	}
	
	
	// 注册事件监听函数
	for(var j in events){
		
		j = events[j];
		
		var callback = (function(j){
			
			return function(){
				var args = Array.prototype.slice.call(arguments, 0); 
				console.log('chrome.storage.sync',j);
				args.unshift(j);
				$rootScope.$broadcast('chrome.storage.change',args);
			};
			
		})(j);
		
		chrome.storage[j].addListener(callback);
	}
	
	return cStorageInterface;
	
}]);



/*
 * 记录管理器
 */
bmServices.factory('recordManager', ['cStorageInterface', function(cStorageInterface) {
	
	function fn(classify){
		this.classify = classify;
	}
	
	fn.prototype = {
			get: function(key){
				var classify = this.classify;
				return cStorageInterface.get(classify).then(function(records){
					records = records && records[classify];
					//console.log(JSON.stringify(records));
					if(key){
						return records && records[key];
					}else{
						return records;
					}
				});
			},
			set: function(record){
				var classify = this.classify;
				return cStorageInterface.get(classify).then(function(records){
					records = records && records[classify] || {};
					var obj = {};
					var id = record.id;
					var old = records[id];
					if(old){
						for(var i in record){
							old[i] = record[i];
						}					
					}else{
						records[id] = record;
					}

					obj[classify] = records;
					return cStorageInterface.set(obj);
				});
			},
			remove: function(record){
				var classify = this.classify;
				var id = typeof record === 'object' ? record.id : record;
				return cStorageInterface.get(classify).then(function(records){
					records = records && records[classify] || {};
					var obj = {};
					delete records[id];
					obj[classify] = records;
					return cStorageInterface.set(obj);
				});
			},
			clear: function(){
				var classify = this.classify;
				var obj = {};
				obj[classify] = {};
				return cStorageInterface.set(obj);
			}			
	};
	
	return fn;
	
}]);


/*
 * 数据同步管理器，主要用于管理前端数据和后端数据的同步
 * DS(Data Synchronism)
 */
bmServices.factory('DSmanager', ['$rootScope', function($rootScope) {
	
	function fn(){
		
	}
	
	return fn;
	
}]);


/*
 * bmRelTableManager用于管理每个书签额外的相关信息
 */
bmServices.factory('bmRelTableManager', ['$rootScope', 'recordManager', function($rootScope, recordManager) {
	return new recordManager('bmRelTable');
}]);


/*
 * visitManager用于管理书签访问信息
 */
bmServices.factory('visitManager', ['$rootScope', 'recordManager', function($rootScope, recordManager) {
	return new recordManager('visit');
}]);

/*
 * searchManager用于管理书签搜索信息
 */
bmServices.factory('searchManager', ['$rootScope', 'recordManager', function($rootScope, recordManager) {
	return new recordManager('search');
}]);

/*
 * configManager用于管理应用配置信息
 */
bmServices.factory('configManager', ['$rootScope', 'recordManager', function($rootScope, recordManager) {
	return new recordManager('config');
}]);


/*
 * rmBookmarkManager用于管理删除的书签记录
 */
bmServices.factory('rmBookmarkManager', ['$rootScope', 'recordManager', function($rootScope, recordManager) {
	return new recordManager('rmBookmark');
}]);



/*
 * 为bookmarkTreeNode建模
 */
bmServices.factory('Bookmark', ['cbInterface', function(cbInterface) {
    function Bookmark(bookmarkTreeNode) {
        if (bookmarkTreeNode) {
            this.setData(bookmarkTreeNode);
        }
    }
    
    Bookmark.prototype = {
        setData: function(bookmarkTreeNode) {
            angular.extend(this, bookmarkTreeNode);
        },
        get: function(id) {
            var scope = this;
            cbInterface.get(id).then(function(bookmarkTreeNode){
            	scope.setData(bookmarkTreeNode);
            });
        },
        remove: function() {
        	if(this.url){
        		cbInterface.remove(this.id);
        	}else{
        		cbInterface.removeTree(this.id);
        	}
        },
        update: function() {
        	cbInterface.update(this.id,this);
        },
        move: function(destination){
        	cbInterface.move(this.id,destination);
        },
        getIcon: function() {
		    var durl=/^(\w+:\/\/\/?[^\/]+)\//i;  
		    var domain = this.url.match(durl);  
		    return domain && domain[1] + '/favicon.ico';        	
        }
    };
    
    return Bookmark;
    
}]);
 


/*
 * 书签管理器
 */
bmServices.factory('bookmarkManager', ['$rootScope', 'cbInterface', 'Bookmark', function( $rootScope, cbInterface, Bookmark) {
	
    var bookmarkManager = {
        get: function(id){
        	return cbInterface.get(id);
        },
        add: function(bookmark){
        	return cbInterface.create(bookmark);
        },
        create: function(bookmark) {
            return cbInterface.create(bookmark);
        },
        recover: function(bookmark){
        	var obj = {};
        	obj.title = bookmark.title;
        	obj.url = bookmark.url;
        	obj.parentId = bookmark.parentId;
        	obj.index = bookmark.index;
        	return cbInterface.create(obj);
        },        
        remove: function(bookmark) {
        	if(bookmark.url){
        		return cbInterface.remove(bookmark.id);
        	}else{
        		return cbInterface.removeTree(bookmark.id);
        	}
        },
        update: function(bookmark) {
        	var changes = {title:bookmark.title, url:bookmark.url};
        	return cbInterface.update(bookmark.id, changes);
        },
        move: function(bookmark,destination){
        	var id = typeof bookmark === 'object' ? bookmark.id : bookmark;
        	return cbInterface.move(id,destination);
        },        
        getTree: function() {
        	return cbInterface.getTree();
        },
        getSubTree: function(id){
        	return cbInterface.getSubTree(id);
        },      
        getRecent: function(size) {
        	return cbInterface.getRecent(size || 100).then(function(r){
        		return r;
        	}); 
        },  
        search: function(query) {
        	return cbInterface.search(query);
        }        
 
    };
    
    return bookmarkManager;
    
}]);
