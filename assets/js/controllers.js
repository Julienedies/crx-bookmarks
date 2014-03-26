'use strict';

/**
 * Controllers 
 */


// 列出书签树单个节点下所有子节点
function nodeCtrl($scope, $routeParams, bookmarkManager) {
	
	function getPathById(id,call){
		var results = [];
		
		(function f(id){
			bookmarkManager.get(id).then(function (arr){
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
	
	var id = $routeParams.nodeId;
	
	//当书签树发生变化的时候更新数据
	$scope.$on('bookmarkTree.change',function(e,data){
		console.log(data);
		console.log(e);
		bookmarkManager.getSubTree(id).then(function(r){
			$scope.bookmarks = r[0].children;
		});		
	});
	
	getPathById(id, function(r){
		$scope.paths = r;
	});

	bookmarkManager.getSubTree(id).then(function(r){
		$scope.bookmarks = r[0].children;
	});	
}

// 列出书签树中所有书签目录
function dirCtrl($scope, bookmarkManager) {
	
	$scope.$on('bookmarkTree.change',function(e,data){
		bookmarkManager.getTree().then(function(r){
			$scope.tree = r;
		});			
	});
	
	bookmarkManager.getTree().then(function(r){
		//console.log(r); 
		$scope.tree = r;
	});		
	
}

// 列出最近使用的书签
function recentCtrl($scope, bookmarkManager){
	
	$scope.$on('bookmarkTree.change',function(e,data){
		console.log(data);
		bookmarkManager.getRecent(10).then(function(r){
			$scope.bookmarks = r;
		});		
	});
	
	bookmarkManager.getRecent(10).then(function(r){
		$scope.bookmarks = r;
	});
}

//
function searchCtrl($scope, $routeParams, bookmarkManager) {
	
	$scope.$on('bookmarkTree.change',function(e,data){
		if($routeParams.searchText){
			bookmarkManager.search($routeParams.searchText).then(function(r){
				$scope.bookmarks = r;
			});		
		}		
	});
	
	if($routeParams.searchText){
		bookmarkManager.search($routeParams.searchText).then(function(r){
			$scope.bookmarks = r;
		});		
	}
}

//
function classifyCtrl($scope, bookmarkManager) {
	
}

//
function hotCtrl($scope, bookmarkManager) {
	
}

//
function trashCtrl($scope, bookmarkManager) {
	
}

//
function setingCtrl($scope) {
	
}

//
function mainCtrl($scope, $location, bookmarkManager){
	$scope.bookmarkManager = bookmarkManager;
	$scope.searchf = function(){
		$location.path('/search/'+$scope.searchText);
		//alert($scope.searchText);
	};
}


var bmControllers = angular.module('bmControllers', []);
                                                         
bmControllers.controller('mainCtrl',['$scope', '$location', 'bookmarkManager', mainCtrl]);

bmControllers.controller('nodeCtrl',['$scope', '$routeParams', 'bookmarkManager', nodeCtrl]);

bmControllers.controller('dirCtrl',['$scope', 'bookmarkManager', dirCtrl]);

bmControllers.controller('recentCtrl',['$scope', 'bookmarkManager', recentCtrl]);

bmControllers.controller('classifyCtrl',['$scope', 'bookmarkManager', classifyCtrl]);

bmControllers.controller('hotCtrl',['$scope', 'bookmarkManager', hotCtrl]);

bmControllers.controller('trashCtrl',['$scope', 'bookmarkManager', trashCtrl]);

bmControllers.controller('setingCtrl',['$scope', 'bookmarkManager', setingCtrl]);

bmControllers.controller('searchCtrl',['$scope', '$routeParams', 'bookmarkManager', searchCtrl]);
			 
	

  
  
  
  
  
  
