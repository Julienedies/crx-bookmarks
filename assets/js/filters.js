'use strict';

/**
 * 
 * Filters
 * 
 */

angular.module('bmFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});