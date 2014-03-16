'use strict';

/**
 * App Module 
 * 
 */

var bmApp = angular.module('bmApp', [ 'ngRoute',
		'bmControllers' ]);

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
	}).otherwise({
		redirectTo : '/dir'
	});
} ]);