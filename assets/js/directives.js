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
        link : function(scope, elm, attrs) {
        	//var call = jQuery.proxy(scope.enterPress,element);
        	
        	var fn = function(e){
        		if(e.which == 13){
        			scope.enterPress();
        		}		
        	};
        	
        	elm.focus(function(){
        		elm.keypress(fn);
        	});
        	elm.blur(function(){
        		elm.unbind('keypress',fn);
        	});        	
        	
        }
    };
    
});

//
bmDirectives.directive('toggle', function() {
    return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
        	var status;
        	var call = function(){
        		if(!status){
        			elm.next().hide();
        			status = 1;
        		}else{
        			elm.next().show();
        			status = 0;
        		}
        	};
        	
        	elm[0].addEventListener('click',call,false);
        }
    };
    
});


//
bmDirectives.directive('currentActive', function() {
    return {
        restrict : 'A',
        scope : {
        	currentActive : '@'
        },        
        link : function(scope, elm, attrs) {
        	
        	var cla = scope.currentActive;
        	var current;
        	elm.delegate(':nth-child(n)','click',function(e){
        		jQuery(current).removeClass(cla);
        		jQuery(this).addClass(cla);
        		current = this;
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


//
bmDirectives.directive('bmDraggable', ['$document', function($document) {
    return function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;
 
      element.css({
       position: 'relative',
       cursor: 'pointer'
      });
 
      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });
 
      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }
 
      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
    };
  }]);


//
bmDirectives.directive("uiDraggable", [
                           '$parse',
                           '$rootScope',
                           function ($parse, $rootScope) {
                               return function (scope, element, attrs) {
                                   if (window.jQuery && !window.jQuery.event.props.dataTransfer) {
                                       window.jQuery.event.props.push('dataTransfer');
                                   }
                                   element.attr("draggable", false);
                                   attrs.$observe("uiDraggable", function (newValue) {
                                       element.attr("draggable", newValue);
                                   });
                                   var dragData = "";
                                   scope.$watch(attrs.drag, function (newValue) {
                                       dragData = newValue;
                                   });
                                   element.bind("dragstart", function (e) {
                                       var sendData = angular.toJson(dragData);
                                       var sendChannel = attrs.dragChannel || "defaultchannel";
                                       e.dataTransfer.setData("Text", sendData);
                                       $rootScope.$broadcast("ANGULAR_DRAG_START", sendChannel);
                                   });
                                   element.bind("dragend", function (e) {
                                       var sendChannel = attrs.dragChannel || "defaultchannel";
                                       $rootScope.$broadcast("ANGULAR_DRAG_END", sendChannel);
                                       if (e.dataTransfer.dropEffect !== "none") {
                                           if (attrs.onDropSuccess) {
                                               var fn = $parse(attrs.onDropSuccess);
                                               scope.$apply(function () {
                                                   fn(scope, {$event: e});
                                               });
                                           }
                                       }
                                   });
                               };
                           }
                       ])
                       .directive("uiOnDrop", [
                           '$parse',
                           '$rootScope',
                           function ($parse, $rootScope) {
                               return function (scope, element, attr) {
                                   var dropChannel = "defaultchannel";
                                   var dragChannel = "";
                                   var dragEnterClass = attr.dragEnterClass || "on-drag-enter";
                                   function onDragOver(e) {
                                       if (e.preventDefault) {
                                           e.preventDefault(); // Necessary. Allows us to drop.
                                       }
                                       if (e.stopPropagation) {
                                           e.stopPropagation();
                                       }
                                       e.dataTransfer.dropEffect = 'move';
                                       return false;
                                   }
                                   function onDrop(e) {
                                       if (e.preventDefault) {
                                           e.preventDefault(); // Necessary. Allows us to drop.
                                       }
                                       if (e.stopPropagation) {
                                           e.stopPropagation(); // Necessary. Allows us to drop.
                                       }
                                       var data = e.dataTransfer.getData("Text");
                                       data = angular.fromJson(data);
                                       var fn = $parse(attr.uiOnDrop);
                                       scope.$apply(function () {
                                           fn(scope, {$data: data, $event: e});
                                       });
                                       element.removeClass(dragEnterClass);
                                   }
                                   $rootScope.$on("ANGULAR_DRAG_START", function (event, channel) {
                                       dragChannel = channel;
                                       if (dropChannel === channel) {
                                           element.bind("dragover", onDragOver);
                                           element.bind("drop", onDrop);
                                           element.addClass(dragEnterClass);
                                       }
                                   });
                                   $rootScope.$on("ANGULAR_DRAG_END", function (e, channel) {
                                       dragChannel = "";
                                       if (dropChannel === channel) {
                                           element.unbind("dragover", onDragOver);
                                           element.unbind("drop", onDrop);
                                           element.removeClass(dragEnterClass);
                                       }
                                   });
                                   attr.$observe('dropChannel', function (value) {
                                       if (value) {
                                           dropChannel = value;
                                       }
                                   });
                               };
                           }
                       ]);


//
bmDirectives.directive('resizeable',['$document', function($document) {
	  return {
		    link: function(scope, elm, attrs) {
		    	
		    	var boxW = elm.parent().width();
		    	var elmW = elm.width();
		    	var dragLineW = 10;
		    	var maxW = boxW - dragLineW;
		    	
		    	var left;
		    	
		    	var disX, startX;
		    	
		    	var dragLine = jQuery('<em class="drag-line"><em class="cell"><i class="resize-btn"></i></em></em>').appendTo(elm);
		    	var resizeBtn = dragLine.find('.resize-btn');
		    	
		    	//elm.css({'margin-left':dragLineW+'px'});
		    	elm.css({'overflow-x':'hidden'});		    	
		    	
		    	dragLine.css({
		    		width: dragLineW+'px',
		    		height: '100%',
		    		cursor: 'w-resize',
		    		position: 'absolute',
		    		top: '0',
		    		left: '0'
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
	    			//elm.css({'margin-left':iT + 'px', 'width':boxW-iT+'px'});
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
bmDirectives.directive('autoWidth',[function() {
	  return {
		  	restrict : 'A',
		    link: function(scope, elm, attrs) {
		    	
			      scope.$watch(attrs.autoWidth, function(value) {
			    	  elm.width(textWidth(value));
				      });		    	
		    	
		    	  function textWidth(text){ 
		    	        var sensor = jQuery('<pre>'+ text +'</pre>').css({display: 'none'}); 
		    	        jQuery('body').append(sensor); 
		    	        var width = sensor.width();
		    	        sensor.remove(); 
		    	        return width+4;
		    	    };		    	
		    	
		    	 //jQuery(elm).unbind('keydown').bind('keydown', function(){
		    	    	//jQuery(this).width(textWidth(jQuery(this).val()));
		    	 //});		    	
		    }
		  };
		}]);


//
bmDirectives.directive('setFocus', [function() {
	  return {
		  	restrict : 'A',
	        scope : {
	        	setFocus : '='
	        }, 		  
	    link: function(scope, elm, attrs) {
	    	
	      scope.$watch('setFocus', function(value) {
	        if(value == true) { 
	        	//elm[0].disabled = false;
	        	elm[0].focus();
	            //scope[attrs.setFocus] = false;
	        }else{
	        	//elm[0].disabled = true;
	        }
	      });
	      
	    }
	  };
	}]);

//
bmDirectives.directive('returnTop', ['$compile',function($compile) {
	  return {
		  	restrict : 'A',
		  	link: function(scope, elm, attrs) {
		  		
		  		var $ = jQuery;
		  		var html = '<div class="return-top" bmDraggable>top</div>';
		  		var topBth = $(html).appendTo($("body"))
	            .click(function () {
	                elm.animate({
	                    scrollTop: 0
	                }, 240);
	            });
		  		
		  		//$compile(topBth[0])(scope);
	            
		  		var fn = function () {
		  			var s = elm.scrollTop();
		  			var vh = elm.parent().height(); 
		  			(s > 2*vh) ? topBth.fadeIn() : topBth.fadeOut();
		  		};
	        
	        elm.bind("scroll", fn);
	    	
	    }
	  };
	}]);


//
bmDirectives.directive('vtree',['d3', function(d3) {
	  return {
		  	restrict : 'A',
	        scope : {
	        	vtree : '='
	        },  		  	
		    link: function(scope, elm, attrs) {
		    	
		    	var data = scope.vtree;
		    	var ew = elm.width();
		    	var eh = elm.height();
		    	
		    	elm = elm[0];	
		    	
		    	scope.$watch('vtree', function (data, oldVal){
		    		
		    		//------------------------
		    		//console.log(JSON.stringify(data));
		    		if(!data) return;

		    		var w = ew || 1280 - 80,
		    		    h = eh || 800 - 180,
		    		    x = d3.scale.linear().range([0, w]),
		    		    y = d3.scale.linear().range([0, h]),
		    		    color = d3.scale.category20c(),
		    		    root,
		    		    node;

		    		var treemap = d3.layout.treemap()
		    		    .round(false)
		    		    .size([w, h])
		    		    .sticky(true)
		    		    .value(function(d) { return 84; /*d.size*/ });

		    		var svg = d3.select(elm).append("div")
		    		    .attr("class", "chart")
		    		    .style("width", w + "px")
		    		    .style("height", h + "px")
		    		  .append("svg:svg")
		    		    .attr("width", w)
		    		    .attr("height", h)
		    		  .append("svg:g")
		    		    .attr("transform", "translate(.5,.5)");

		    		  node = root = data;

		    		  var nodes = treemap.nodes(root)
		    		      .filter(function(d) { return !d.children; });

		    		  var cell = svg.selectAll("g")
		    		      .data(nodes)
		    		    .enter().append("svg:g")
		    		      .attr("class", "cell")
		    		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		    		      .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

		    		  cell.append("svg:rect")
		    		      .attr("width", function(d) { return d.dx - 1; })
		    		      .attr("height", function(d) { return d.dy - 1; })
		    		      .style("fill", function(d) { return color(d.parent.title); });

		    		  cell.append("svg:text")
		    		      .attr("x", function(d) { return d.dx / 2; })
		    		      .attr("y", function(d) { return d.dy / 2; })
		    		      .attr("dy", ".35em")
		    		      .attr("text-anchor", "middle")
		    		      .text(function(d) { return d.title; })
		    		      .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; })
		    		      .on('click',function(d,i){
		    		    	  location.hash = '#/dir/'+d.id;
		    		      });

		    		  d3.select(window).on("click", function() { zoom(root); });

		    		  d3.select("select").on("change", function() {
		    		    treemap.value(this.value == "size" ? size : count).nodes(root);
		    		    zoom(node);
		    		  });

		    		function size(d) {
		    		  return  79;/*d.index;*/
		    		}

		    		function count(d) {
		    		  return 1;
		    		}

		    		function zoom(d) {
		    		  var kx = w / d.dx, ky = h / d.dy;
		    		  x.domain([d.x, d.x + d.dx]);
		    		  y.domain([d.y, d.y + d.dy]);

		    		  var t = svg.selectAll("g.cell").transition()
		    		      .duration(d3.event.altKey ? 7500 : 750)
		    		      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

		    		  t.select("rect")
		    		      .attr("width", function(d) { return kx * d.dx - 1; })
		    		      .attr("height", function(d) { return ky * d.dy - 1; });

		    		  t.select("text")
		    		      .attr("x", function(d) { return kx * d.dx / 2; })
		    		      .attr("y", function(d) { return ky * d.dy / 2; })
		    		      .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

		    		  node = d;
		    		  d3.event.stopPropagation();
		    		}
		    		
		    	//----------------------------------	
		    		
		    	});
		    	
		    }
		  };
		}]);



