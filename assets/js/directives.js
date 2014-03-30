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
		    	
		    	//alert(ew+' '+eh);
		    		
		    	scope.$watch('vtree', function (data, oldVal){
//------------------------
		    		if(!data) return;
		    		//console.log(JSON.stringify(data));

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

		    		//d3.json("flare.json", function(data) {
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
		    		      //.attr("href", function(d) { return '#/node/'+d.id; })
		    		      .text(function(d) { return d.title; })
		    		      .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; })
		    		      .on('click',function(d,i){
		    		    	  location.hash = '#/node/'+d.id;
		    		      });

		    		  d3.select(window).on("click", function() { zoom(root); });

		    		  d3.select("select").on("change", function() {
		    		    treemap.value(this.value == "size" ? size : count).nodes(root);
		    		    zoom(node);
		    		  });
		    		//});

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



