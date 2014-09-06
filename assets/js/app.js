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
			templateUrl : 'tmpl/node.html',
			controller : 'nodeCtrl'
		}).when('/v/:type?', {
				templateUrl : 'tmpl/v.html',
				controller : 'vCtrl'					
		}).when('/dir/:nodeId?', {
			templateUrl : 'tmpl/vdir.html',
			controller : 'vdirCtrl'	
		}).when('/tag/:tag', {
			templateUrl : 'tmpl/list.html',
			controller : 'tagCtrl'				
		}).when('/recent', {
			templateUrl : 'tmpl/list.html',
			controller : 'recentCtrl'
		}).when('/classify', {
			templateUrl : 'tmpl/classify.html',
			controller : 'classifyCtrl'			
		}).when('/hot', {
			templateUrl : 'tmpl/hot.html',
			controller : 'hotCtrl'			
		}).when('/trash', {
			templateUrl : 'tmpl/trash.html',
			controller : 'trashCtrl'			
		}).when('/search/:q', {
			templateUrl : 'tmpl/list.html',
			controller : 'searchCtrl'			
		}).when('/seting', {
			templateUrl : 'tmpl/seting.html'
			//controller : 'recentCtrl'
		}).when('/help', {
			templateUrl : 'tmpl/help.html'
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





