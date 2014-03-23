'use strict';

/**
 * 
 * Filters
 * 
 */

var bmFilters = angular.module('bmFilters', []);

bmFilters.filter('generateIcon', function() {
  return function(input) {
		    var durl=/^(\w+:\/\/\/?[^\/]+)\//i;  
		    var domain = input.match(durl);  
		return domain && domain[1] + '/favicon.ico';
    //return input ? '\u2713' : '\u2718';
  };
});

bmFilters.filter('isTree', function() {
	  return function(input) {
		  //console.log(input);
		  var out = [];
		  angular.forEach(input, function(item) {
			  if(typeof item === 'object' && !item.url ){
				  out.push(item);
			  }
		    });
		  
		  return out;
	  };
	});