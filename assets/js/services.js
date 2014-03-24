'use strict';

/**
 * 
 * Services
 * 
 */

var bmServices = angular.module('bmServices', ['ngResource']);

/*
 * 对chrome.bookmarks的方法进行封装,做为一个service提供给其它模块使用;
 */
bmServices.factory('BOOKMARKS', ['$q', function($q) {
	
	var BOOKMARKS = {};
	
	var _bookmarks = chrome.bookmarks;
	
	var fs = ['get', 'getChildren', 'getRecent', 'getTree', 'getSubTree', 'search', 'create', 'move', 'update', 'remove', 'removeTree'];
	
	for(var i in fs){
		
		i = fs[i];
		
		BOOKMARKS[i] = (function(i){
			
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
	
	return BOOKMARKS;
	
}]);

/*
 * 为bookmarkTreeNode建模
 */
bmServices.factory('BookMark', ['BOOKMARKS', function(BOOKMARKS) {
    function BookMark(BookMark) {
        if (bookmarkTreeNode) {
            this.setData(bookmarkTreeNode);
        }
    }
    
    BookMark.prototype = {
        setData: function(bookmarkTreeNode) {
            angular.extend(this, bookmarkTreeNode);
        },
        get: function(id) {
            var scope = this;
            BOOKMARKS.get(id).then(function(bookmarkTreeNode){
            	scope.setData(bookmarkTreeNode);
            });
        },
        remove: function() {
        	if(this.url){
        		BOOKMARKS.remove(this.id);
        	}else{
        		BOOKMARKS.removeTree(this.id);
        	}
        },
        update: function() {
        	BOOKMARKS.update(this.id,this);
        },
        move: function(destination){
        	BOOKMARKS.move(this.id,destination);
        },
        getIcon: function() {
		    var durl=/^(\w+:\/\/\/?[^\/]+)\//i;  
		    var domain = this.url.match(durl);  
		    return domain && domain[1] + '/favicon.ico';        	
        }
        
    };
    
    return BookMark;
    
}]);
  
/*
 *
 */
bmServices.factory('bookMarkManager', ['BOOKMARKS', 'BookMark', function(BOOKMARKS, BookMark) {
    var bookMarkManager = {
        _pool: {},
        _retrieveInstance: function(bookMarkId, bookmarkTreeNode) {
            var instance = this._pool[bookMarkId];
 
            if (instance) {
                instance.setData(bookmarkTreeNode);
            } else {
                instance = new Book(bookmarkTreeNode);
                this._pool[bookMarkId] = instance;
            }
 
            return instance;
        },
        _search: function(bookMarkId) {
            return this._pool[bookMarkId];
        },
        _get: function(bookId) {
            var scope = this;
            
            return BOOKMARKS.get(bookMarkId).then(function(bookmarkTreeNode){
            	scope._retrieveInstance(bookmarkTreeNode.id, bookmarkTreeNode);
            });
        },
        /* 取得特定书签  */
        get: function(bookMarkId){
        	var bookMark = this._search(bookMarkId);
        	if(bookMark){
        		return bookMark;
        	}else{
        		return this._get(bookId);
        	}
        },
        /* 取得整个书签树  */
        getTree: function() {
        	return BOOKMARKS.getTree();
        },
        /* 创建新书签  */
        create: function(data) {
            return BOOKMARKS.create(data);
        },
        /* 取得最近使用的书签 ,默认为最近使用的100项   */
        getRecent: function(size) {
        	return BOOKMARKS.getRecent(size || 100); 
        },  
        /* 取得符合查询条件的书签  */
        search: function(query) {
        	return BOOKMARKS.search(query);
        }        
 
    };
    
    return bookMarkManager;
    
}]);
