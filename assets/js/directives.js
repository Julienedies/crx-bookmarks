'use strict';

/**
 * 
 * directives
 * 
 */

var bmDirectives = angular.module('bmDirectives', []);

//
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

//
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

//expanderable
bmDirectives.directive('resizeable',['$document', function($document) {
	  return {
		    link: function(scope, elm, attrs) {
		    	
		    	var boxW = elm.parent().width();
		    	var elmW = elm.width();
		    	var dragLineW = 10;
		    	var maxW = boxW - dragLineW;
		    	
		    	var left;
		    	
		    	var disX, startX;
		    	
		    	var dragLine = jQuery('<em class="dragLine"><em class="cell"><i class="resizeBtn"></i></em></em>').appendTo(elm);
		    	var resizeBtn = dragLine.find('.resizeBtn');
		    	
		    	//elm.css({'margin-left':dragLineW+'px'});
		    	elm.css({'overflow':'hidden'});		    	
		    	
		    	dragLine.css({
		    		width: dragLineW+'px',
		    		height: '100%',
		    		cursor: 'w-resize',
		    		position: 'absolute',
		    		top: '0',
		    		left: '0px'
		    	});
		    	
		    	//originalEvent 
		    	dragLine.on('mousedown',function mousedown(event) {
		    		disX = event.clientX;
		    		//startX = dragLine.offset().left;
		    		startX = this.offsetLeft;
		    		//startX = elm.css('margin-left');
		    		
		            $document.on('mousemove', mousemove);
		            $document.on('mouseup', mouseup);
		            
		            dragLine.setCapture && dragLine.setCapture();
		            return false;
		    	});
		    	
	    		function mousemove(event){
	    			var iT = startX + (event.clientX );
	    			iT < 0 && (iT = 0);
	    			iT > maxW && (iT = maxW);
	    			//dragLine.css('left',iT-dragLineW+ 'px');
	    			elm.css({'margin-left':iT + 'px', 'width':boxW-iT+'px'});
	    			return false;
	    		}
	    		
	    		function mouseup(){
	    		    $document.unbind('mousemove', mousemove);
	    	        $document.unbind('mouseup', mouseup);
	    	        dragLine.releaseCapture && dragLine.releaseCapture();
	    		}		    	
		    }
		  };
		}]);

//
bmDirectives.directive('currenActive',['$location', function($location) {
	  return {
		  	restrict : 'A',
		    link: function(scope, elm, attrs) {
		    	elm.children().click(function(){
		    		console.log($location);
		    		var th = jQuery(this);
		    		th.siblings().removeClass('active');
		    		th.addClass('active');
		    		
		    	});
		    }
		  };
		}]);






