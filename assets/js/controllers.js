'use strict';

/**
 * Controllers 
 */


// 列出书签树单个节点下所有子节点
function nodeCtrl($scope, $routeParams) {
	
	function getPathById(id,call){
		var results = [];
		
		(function f(id){
			chrome.bookmarks.get(id, function (arr){
				var node = arr[0];
				if(node){
					results.unshift({id:node.id,title:node.title}); 
					id = node.parentId;	
					if(id){
						f(id);
					}else{
						call && call(results);
					}
				}else{
					call && call(results);
				}
			});			
		})(id);

	}
	
	console.log($routeParams.nodeId);
	
	var call = function(r){
		$scope.$apply(function () {
			$scope.bookmarks = r[0].children;
		});
	};
	
	var pathCall = function(r){
		$scope.$apply(function () {
			$scope.paths = r;
		});		
	};
	
	getPathById($routeParams.nodeId,pathCall);

	chrome.bookmarks.getSubTree($routeParams.nodeId, call);	
}

// 列出书签树中所有书签目录
function dirCtrl($scope, bookMarkManager) {
	
	bookMarkManager.getTree().then(function(r){
		console.log(r); 
		$scope.tree = r;
	});		
	
}

// 列出最近使用的书签
function recentCtrl($scope, bookMarkManager){
	/*
	chrome.bookmarks.getRecent(240,function(r){
		$scope.$apply(function () {
			$scope.bookmarks = r;
		});
	});	
	*/
	
	bookMarkManager.getRecent().then(function(r){
		$scope.bookmarks = r;
	});
	
}

function searchCtrl($scope, $routeParams, bookMarkManager) {
	if($routeParams.searchText){
		bookMarkManager.search($routeParams.searchText).then(function(r){
			$scope.bookmarks = r;
		});		
	}

}

function mainCtrl($scope, $location, bookMarkManager){
	$scope.searchf = function(){
		$location.path('/search/'+$scope.searchText);
		alert($scope.searchText);
	};
}


var bmControllers = angular.module('bmControllers', []);
                                                         
bmControllers.controller('mainCtrl',['$scope', '$location', mainCtrl]);

bmControllers.controller('nodeCtrl',['$scope', '$routeParams', nodeCtrl]);

bmControllers.controller('dirCtrl',['$scope', 'bookMarkManager', dirCtrl]);

bmControllers.controller('recentCtrl',['$scope', 'bookMarkManager', recentCtrl]);

bmControllers.controller('searchCtrl',['$scope', '$routeParams', 'bookMarkManager', searchCtrl]);
			 
	
  
  
  
  
  
  
  
