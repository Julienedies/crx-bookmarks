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
function dirCtrl($scope, BOOKMARKS) {
	
	function isTree(o){
		if(typeof o === 'object'){
			for(var i in o){
				if(typeof o[i] === 'object'){
					return 1;
				} 
			}
		}
		return 0;
	}
	
	function getListFromTree(tree,list){
		var list = list || [];
		var item;
		
		for(var i in tree){
			item = tree[i];
			
			if( isTree(item) && item.children ){
				list.push({id:item.id, title:item.title});
				getListFromTree(item.children, list);
			}
		}
		
		return list;
	}
	
	BOOKMARKS.getTree().then(function(r){
		console.log(r); 
		$scope.tree = r;
	});		
	
}

// 列出最近使用的书签
function recentCtrl($scope, BOOKMARKS){
	/*
	chrome.bookmarks.getRecent(240,function(r){
		$scope.$apply(function () {
			$scope.bookmarks = r;
		});
	});	
	*/
	
	BOOKMARKS.getRecent(240).then(function(r){
		$scope.bookmarks = r;
	});
	
}




var bmControllers = angular.module('bmControllers', []);
                                                         


bmControllers.controller('nodeCtrl',['$scope', '$routeParams', nodeCtrl]);

bmControllers.controller('dirCtrl',['$scope', 'BOOKMARKS', dirCtrl]);

bmControllers.controller('recentCtrl',['$scope', 'BOOKMARKS', recentCtrl]);
			 
	
  
  
  
  
  
  
  
