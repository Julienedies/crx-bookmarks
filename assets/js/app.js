'use strict';

/**
 * 
 * App Module 
 * 
 */

var bmApp = angular.module('bmApp', [ 'ngRoute', 'bmServices', 'bmDirectives', 'bmFilters', 'bmAnimations', 'bmControllers' ]);
		
//
bmApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/node/:nodeId?', {
		templateUrl : 'temp/list.html',
		controller : 'nodeCtrl'
	}).when('/dir/:nodeId?', {
		templateUrl : 'temp/vdir.html',
		controller : 'vdirCtrl'			
	}).when('/recent', {
		templateUrl : 'temp/list.html',
		controller : 'recentCtrl'
	}).when('/classify', {
		templateUrl : 'temp/classify.html',
		controller : 'classifyCtrl'			
	}).when('/hot', {
		templateUrl : 'temp/list.html',
		controller : 'hotCtrl'			
	}).when('/trash', {
		templateUrl : 'temp/trash.html',
		controller : 'trashCtrl'			
	}).when('/search/:searchText', {
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
                   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
               }
           ]);




