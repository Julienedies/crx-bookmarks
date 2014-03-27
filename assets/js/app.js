'use strict';

/**
 * 
 * App Module 
 * 
 */

var bmApp = angular.module('bmApp', [ 'ngRoute', 'bmServices', 'bmDirectives', 'bmFilters', 'bmAnimations', 'bmControllers' ]);
		

bmApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/node/:nodeId', {
		templateUrl : 'temp/list.html',
		controller : 'nodeCtrl'
	}).when('/dir', {
		templateUrl : 'temp/dir.html',
		controller : 'dirCtrl'
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

bmApp.config( [
               '$compileProvider',
               function( $compileProvider )
               {   
                   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
               }
           ]);












/*
 * iscroll 控件
 */ 
function loaded(){
    var GiScroll = new iScroll('leftwrapper', {
		//snap: true,
		//momentum: false,
		//hScrollbar: true,
        checkDOMChanges: true
		//useTransition: true,
    });
    var GiScroll2 = new iScroll('leftwrapper2', {
		//snap: true,
		//momentum: false,
		//hScrollbar: true,
        checkDOMChanges: true
		//useTransition: true,
    });   
}

document.addEventListener('touchmove', function(e){
    e.preventDefault();
}, false);

document.addEventListener('DOMContentLoaded', function(){
    setTimeout(loaded, 200);
}, false);