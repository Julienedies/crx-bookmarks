'use strict';

/**
 * Controllers 
 */


//---------------------------------------------

function bookmarkListCtrl($scope) {

	chrome.bookmarks.getTree(function(r){
		console.log(r); 

		$scope.$apply(function () {
			$scope.bookmarks = r;
		});

	});	
	
	//$scope.orderProp = 'age';
}

//---------------------------------------------

var bookmarkManager = angular.module('bookmarkManager', ['ngRoute', 'bookmarkManagerControllers']);
                                                         


bookmarkManager.controller('bookmarkListCtrl',['$scope', bookmarkListCtrl]);
			 
	
  
  
  
  
  
  
  
