'use strict';

/**
 * 
 * define filters by Julienedies
 * 
 */

(function(angular){
	
	
	var bmFilters = angular.module('bmFilters', []);

	bmFilters.filter('getIcon', function() {
	  return function(input) {
			    var durl=/^(\w+:\/\/\/?[^\/]+)\//i;  
			    var domain = input.match(durl);  
			    //return domain && domain[1] + '/favicon.ico';
			    return 'chrome://favicon/' + input;
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

	bmFilters.filter('toBookmark', ['Bookmark',function(Bookmark) {
		  return function(input) {
			  console.log(input);
			  //var o = new Bookmark(input);console.log(o); return o;
			 
			  var out = [];
			  angular.forEach(input, function(item) {
				  if(typeof item === 'object' && item.id ){
					  angular.extend(item,Bookmark.prototype);
					  out.push(item);
					  //out.push(new Bookmark(item));
					  //out.push( angular.extend(item,Bookmark.prototype) );
				  }
			    });
			  
			  return out;
		  };
		}]);
	
	
	
	
})(angular);

