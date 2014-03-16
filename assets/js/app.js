'use strict';

/**
 * 
 * App Module 
 * 
 */

var bmApp = angular.module('bmApp', [ 'ngRoute','bmAnimations', 'bmControllers', 'bmFilters' ]);
		

bmApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/node/:nodeId', {
		templateUrl : 'assets/temp/list.html',
		controller : 'nodeCtrl'
	}).when('/dir', {
		templateUrl : 'assets/temp/list.html',
		controller : 'dirCtrl'
	}).when('/recent', {
		templateUrl : 'assets/temp/list.html',
		controller : 'recentCtrl'	
	}).when('/help', {
		templateUrl : 'assets/temp/help.html'
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