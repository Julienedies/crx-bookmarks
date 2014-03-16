'use strict';

/**
 * 
 * Services
 * 
 */

var bmServices = angular.module('bmServices', ['ngResource']);

bmServices.factory('bm', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);
