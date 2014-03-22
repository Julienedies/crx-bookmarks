'use strict';

/**
 * 
 * Services
 * 
 */

var bmServices = angular.module('bmServices', ['ngResource']);

/*
 * 该service对chrome.bookmarks的方法进行了封装;
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
            