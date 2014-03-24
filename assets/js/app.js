'use strict';

/**
 * 
 * App Module 
 * 
 */

var bmApp = angular.module('bmApp', [ 'ngRoute', 'bmServices', 'bmDirectives', 'bmFilters', 'bmAnimations', 'bmControllers' ]);
		

bmApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/node/:nodeId', {
		templateUrl : 'assets/temp/list.html',
		controller : 'nodeCtrl'
	}).when('/dir', {
		templateUrl : 'assets/temp/dir.html',
		controller : 'dirCtrl'
	}).when('/recent', {
		templateUrl : 'assets/temp/list.html',
		controller : 'recentCtrl'
	}).when('/search/:searchText', {
		templateUrl : 'assets/temp/list.html',
		controller : 'searchCtrl'			
	}).when('/help', {
		templateUrl : 'assets/temp/help.html'
		//controller : 'recentCtrl'	
	}).when('/seting', {
		templateUrl : 'assets/temp/seting.html'
		//controller : 'recentCtrl'					
	}).otherwise({
		redirectTo : '/dir'
	});
} ]);

bmApp.config( [
               '$compileProvider',
               function( $compileProvider )
               {   
                   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
               }
           ]);