'use strict';

/**
 * 
 * Filters
 * 
 */

angular.module('bmFilters', []).filter('generateIcon', function() {
  return function(input) {
		    var durl=/^(\w+:\/\/\/?[^\/]+)\//i;  
		    var domain = input.match(durl);  
		return domain && domain[1] + '/favicon.ico';
    //return input ? '\u2713' : '\u2718';
  };
});