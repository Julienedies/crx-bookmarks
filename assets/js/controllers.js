'use strict';

/**
 * Controllers 
 */


// 列出书签树单个节点下所有子节点
function nodeCtrl($scope) {

	chrome.bookmarks.getTree(function(r){
		console.log(r); 

		$scope.$apply(function () {
			$scope.bookmarks = r;
		});

	});	
	
	//$scope.orderProp = 'age';
}

// 列出书签树中所有书签目录
function dirCtrl($scope, $routeParams) {
    //$scope.phoneId = $routeParams.phoneId;
}

// 列出最近使用的书签
function recentCtrl($scope, $routeParams){
	
}

var bmControllers = angular.module('bmControllers', []);
                                                         


bmControllers.controller('nodeCtrl',['$scope', '$routeParams', nodeCtrl]);

bmControllers.controller('dirCtrl',['$scope', dirCtrl]);

bmControllers.controller('recentCtrl',['$scope', recentCtrl]);
			 
	
  
  
  
  
  
  
  
