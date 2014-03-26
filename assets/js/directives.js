'use strict';

/**
 * 
 * directives
 * 
 */

var bmDirectives = angular.module('bmDirectives', []);

bmDirectives.directive('enterPress', function() {
    return {
        restrict : 'A',
        scope : {
        	enterPress : '='
        },        
        link : function(scope, element, attrs) {
        	//var call = jQuery.proxy(scope.enterPress,element);
        	
        	var fn = function(e){
        		if(e.which == 13){
        			scope.enterPress();
        		}		
        	};
        	
        	element.focus(function(){
        		element.keypress(fn);
        	});
        	element.blur(function(){
        		element.unbind('keypress',fn);
        	});        	
        	
        }
    };
    
});

bmDirectives.directive('contenteditable', function() {
	  return {
		    require: 'ngModel',
		    link: function(scope, elm, attrs, ctrl) {
		      // 视图 -> 模型
		      elm.on('blur', function() {
		        scope.$apply(function() {
		        	var text = jQuery.trim(elm.text());
		        	ctrl.$setViewValue(text);
		        });
		      });
		 
		      // 模型 -> 视图
		      ctrl.$render = function() {
		        elm.html(ctrl.$viewValue);
		      };
		 
		      // 从DOM中初始化数据
		      //ctrl.$setViewValue(elm.html());
		    }
		  };
		});










