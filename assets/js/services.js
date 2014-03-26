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
 * 工具函数
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
 * action record
 */
bmServices.factory('actionRecord', ['$q','$rootScope', function($q, $rootScope) {
	return {action:null, result:null};
}]);


/*
 * 对chrome.bookmarks进行封装,做为一个service提供给其它模块使用;
 */
bmServices.factory('cbInterface', ['$q','$rootScope', function($q, $rootScope) {
	
	var cbInterface = {};
	
	var _bookmarks = chrome.bookmarks;
	
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
				
				_bookmarks[i].apply(_bookmarks, args);
				
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
				console.log('>>>>'+j);
				$rootScope.$broadcast('bookmarkTree.change',args);
			};
			
		})(j);
		
		_bookmarks[j].addListener(callback);
		
	}
	
	return cbInterface;
	
}]);

/*
 * 
 */
bmServices.factory('ManagerProto', ['$http', '$q', function($http, $q) {
	
	function ManagerProto(classify,list){
		this.classify = classify;
		this.list = list;
	}
	
    ManagerProto.prototype = {
        _pool: {},
        _retrieveInstance: function(id, data) {
            var instance = this._pool[id];

            if (instance) {
                instance.setData(data);
            } else {
                instance = new this.classify(data);
                this._pool[id] = instance;
            }

            return instance;
        },
        _search: function(id) {
            return this._pool[id];
        },
        _load: function(id, deferred) {
            var scope = this;
        },
        /* get instance by it's id */
        get: function(id) {
            var deferred = $q.defer();
            var instance = this._search(id);
            if (instance) {
                deferred.resolve(instance);
            } else {
                this._load(id, deferred);
            }
            return deferred.promise;
        },
        save: function(instance){
        	
        },
        remove: function(){
        	
        } 
        
    };
    return ManagerProto;
}]);
        








/*
 * bookmarkRelTable
 */
bmServices.factory('bookmarkRelTable', ['$q', '$rootScope', function($q, $rootScope) {
	
	return {};
	
}]);

/*
 * BookmarkExtra
 */

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
 *
 */
bmServices.factory('bookmarkManager', ['$rootScope', 'cbInterface', 'Bookmark', function( $rootScope, cbInterface, Bookmark) {
	
    var bookmarkManager = {
        _pool: {},
        _retrieveInstance: function(bookmarkId, bookmarkTreeNode) {
            var instance = this._pool[bookmarkId];
 
            if (instance) {
                instance.setData(bookmarkTreeNode);
            } else {
                instance = new Book(bookmarkTreeNode);
                this._pool[bookmarkId] = instance;
            }
 
            return instance;
        },
        _search: function(bookmarkId) {
            return this._pool[bookmarkId];
        },
        _get: function(bookId) {
            var scope = this;
            
            return cbInterface.get(bookmarkId).then(function(bookmarkTreeNode){
            	scope._retrieveInstance(bookmarkTreeNode.id, bookmarkTreeNode);
            });
        },
        get: function(id){
        	return cbInterface.get(id);
        	var bookmark = this._search(id);
        	if(bookmark){
        		return bookmark;
        	}else{
        		return this._get(id);
        	}
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
        	return cbInterface.move(bookmark.id,destination);
        },        
        /* 取得整个书签树  */
        getTree: function() {
        	return cbInterface.getTree();
        },
        getSubTree: function(id){
        	return cbInterface.getSubTree(id);
        },      
        /* 创建新书签  */
        create: function(bookmark) {
            return cbInterface.create(bookmark);
        },
        /* 取得最近使用的书签 ,默认为最近使用的100项   */
        getRecent: function(size) {
        	return cbInterface.getRecent(size || 100).then(function(r){
        		return r;
        	}); 
        },  
        /* 取得符合查询条件的书签  */
        search: function(query) {
        	return cbInterface.search(query);
        }        
 
    };
    
	/*
	var _cache;
    $rootScope.$on('bookmarkTree.change',function(e,data){
    	console.log('>>>bookmarkTree.change>>>需要更新缓存结果');
    });
    */
    return bookmarkManager;
    
}]);
