'use strict';

/**
 * 
 * App module by Julienedies 
 * 
 */

(function(angular){
	
	
	
	var bmApp = angular.module('bmApp', [ 'ngRoute', 'bmServices', 'bmDirectives', 'bmFilters', 'bmAnimations', 'bmControllers' ]);
	
	// hash 路由配置
	bmApp.config([ '$routeProvider', function($routeProvider) {
		$routeProvider
		  .when('/node/:nodeId?', {
			templateUrl : 'temp/node.html',
			controller : 'nodeCtrl'
		}).when('/v/:type?', {
				templateUrl : 'temp/v.html',
				controller : 'vCtrl'					
		}).when('/dir/:nodeId?', {
			templateUrl : 'temp/vdir.html',
			controller : 'vdirCtrl'	
		}).when('/tag/:tag', {
			templateUrl : 'temp/list.html',
			controller : 'tagCtrl'				
		}).when('/recent', {
			templateUrl : 'temp/list.html',
			controller : 'recentCtrl'
		}).when('/classify', {
			templateUrl : 'temp/classify.html',
			controller : 'classifyCtrl'			
		}).when('/hot', {
			templateUrl : 'temp/hot.html',
			controller : 'hotCtrl'			
		}).when('/trash', {
			templateUrl : 'temp/trash.html',
			controller : 'trashCtrl'			
		}).when('/search/:q', {
			templateUrl : 'temp/list.html',
			controller : 'searchCtrl'			
		}).when('/seting', {
			templateUrl : 'temp/seting.html'
			//controller : 'recentCtrl'
		}).when('/help', {
			templateUrl : 'temp/help.html'
			//controller : 'recentCtrl'				
		}).otherwise({
			redirectTo : '/recent'
		});
	} ]);


	//
	bmApp.config( [
	               '$compileProvider',
	               function( $compileProvider )
	               {   
	                   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome|chrome-extension):/);
	                   $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|chrome|file|blob):|data:image\//);
	               }
	           ]);	
	
	
	
	
})(angular);





