'use strict';

/**
 * 
 * define directives by Julienedies
 * 
 */

(function(angular){


	var bmDirectives = angular.module('bmDirectives', []);


	// 监听回车键按下
	bmDirectives.directive('bmEnterPress', function() {
	    return {
	        restrict : 'A',
	        scope : {
	        	enterPress : '=bmEnterPress'
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

	// 显示隐藏切换
	bmDirectives.directive('bmToggle', function() {
	    return {
	        restrict : 'A',
	        link : function(scope, elm, attrs) {
	        	var status;
	        	var call = function(){
	        		if(!status){
	        			elm.addClass('a').next().hide();
	        			status = 1;
	        		}else{
	        			elm.removeClass('a').next().show();
	        			status = 0;
	        		}
	        	};
	        	
	        	elm[0].addEventListener('click',call,false);
	        }
	    };
	    
	});


	// display 设置
	bmDirectives.directive('bmDisplayModel', function() {
	    return {
	        restrict : 'A',
	        scope : {
	        	m : '=bmDisplayModel'
	        },        
	        link : function(scope, elm, attrs) {
	        	
	        	var btn = jQuery('<b class="display-full-btn" title="">[全屏模式切换] </b>').appendTo(elm);
	        	btn.click(function(){
	        		elm.toggleClass('display-full');
	        	});
	        	
	        }
	    };
	    
	});
	
	// 关闭按钮
	bmDirectives.directive('bmCloseBtn', function() {
	    return {
	        restrict : 'A',
	        scope : {
	        	click : '=bmCloseBtn'
	        },        
	        link : function(scope, elm, attrs) {
	        	
	        	var btn = jQuery('<b class="close-btn" title="关闭">X</b>').appendTo(elm);
	        	btn.click(function(){
	        		scope.click();
	        	});
	        	
	        }
	    };
	    
	});	



	// 当前激活显示
	bmDirectives.directive('bmCurrentActive', function() {
	    return {
	        restrict : 'A',
	        scope : {
	        	bmCurrentActive : '@',
	        	bmCurrentActiveClass : '@'
	        },        
	        link : function(scope, elm, attrs) {
	        	
	        	var selector = scope.bmCurrentActive;
	        	var cla = scope.bmCurrentActiveClass;
	        	var current;
	        	elm.delegate(selector,'click',function(e){
	        		jQuery(current).removeClass(cla);
	        		jQuery(this).addClass(cla);
	        		current = this;
	        	});
	        	
	        }
	    };
	    
	});

	// 使元素可作为编辑模型
	bmDirectives.directive('bmContenteditable', function() {
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


	// 监听拖动
	bmDirectives.directive('bmDraggable', ['$parse', '$rootScope',function($parse, $rootScope) {
	    return {
	        restrict : 'A',
	        link : function(scope, element, attrs) {
	        	
	        	var dragData = "";
	        	var dragChannel;
	        	
	            if (window.jQuery && !window.jQuery.event.props.dataTransfer) {
	                window.jQuery.event.props.push('dataTransfer');
	            }
	            
	            scope.$watch(attrs.bmDraggable, function (value) {
	            	value ? element.attr("draggable", value) : element.removeAttr('draggable');
	            });
	            
	            scope.$watch(attrs.bmDrag, function (value) {
	                dragData = value;
	            });
	            
	            scope.$watch(attrs.bmDragChannel, function (value) {
	            	if(value){
	            		dragChannel = value;
	            	}
	             }); 
	            
	            element.bind("dragstart", function (e) {
	                var sendData = angular.toJson(dragData);
	                var sendChannel = dragChannel || "defaultchannel";
	                e.dataTransfer.setData("Text", sendData);
	                $rootScope.$broadcast("ANGULAR_DRAG_START", {channel:sendChannel, dom:element});
	            });
	            
	            element.bind("dragend", function (e) {
	                var sendChannel = dragChannel || "defaultchannel";
	                $rootScope.$broadcast("ANGULAR_DRAG_END", {channel:sendChannel, dom:element});
	                
	                if (e.dataTransfer.dropEffect !== "none") {
	                    if (attrs.bmOnDropSuccess) {
	                        var fn = $parse(attrs.bmOnDropSuccess);
	                        scope.$apply(function () {
	                            fn(scope, {$event: e});
	                        });
	                    }
	                }
	                
	            });
	        	
	        }
	    };
	    
	}]);


	// 监听拖入
	bmDirectives.directive('bmOnDrop', ['$parse', '$rootScope',function($parse, $rootScope) {
	    return {
	        restrict : 'A',
	        link : function(scope, element, attrs) {
	        	
	            var dropChannel = "defaultchannel";
	            var dragChannel = "";
	            var dragOverClass = attrs.bmDragOverClass || "on-drag-over";
	            var dragEnterClass = attrs.bmDragEnterClass || "on-drag-enter";
	            
	            scope.$watch(attrs.bmDropChannel, function (value) { 
	            	dropChannel = value;
	             }); 
	            /*
	            attrs.$observe('bmDropChannel', function (value) {
	                if (value) {
	                    dropChannel = value;
	                }
	            });             
	            */
	            $rootScope.$on("ANGULAR_DRAG_START", function (event, msg) {
	                dragChannel = msg.channel;
	                
	                var dragElement = msg.dom;
	                
	                if (dropChannel === msg.channel && element !== dragElement && !!!jQuery(dragElement.parent()).find(element.parent()).length) {
	                    element.bind("dragover", onDragOver);
	                    element.bind("dragenter", onDragEnter);
	                    element.bind("dragleave", onDragLeave);
	                    element.bind("drop", onDrop);
	                }
	            });
	            $rootScope.$on("ANGULAR_DRAG_END", function (e, msg) {
	                dragChannel = "";
	                if (dropChannel === msg.channel) {
	                    element.unbind("dragover", onDragOver);
	                    element.unbind("dragenter", onDragEnter);
	                    element.unbind("dragleave", onDragLeave);
	                    element.unbind("drop", onDrop);
	                }
	            });
	            
	            
	            function onDragOver(e) {
	                e.preventDefault && e.preventDefault(); 
	                e.stopPropagation && e.stopPropagation(); 
	                
	                e.dataTransfer.dropEffect = 'move';
	                
	                //根据鼠标位置判断是移动到目标元素前面还是后面还是目标元素本身
	                var h = element.height();
	                var y = e.originalEvent.offsetY;
	                var position;
	                if(y/h < 1/5){
	                	position = 'top';
	                }else if(y/h > 1/5 && y/h < 4/5){
	                	position = 'middle';
	                }else{
	                	position = 'bottom';
	                }    
	                
	           	 	//element.addClass(dragEnterClass+'-'+position);                
	                element.addClass(dragOverClass+'-'+position);
	                return false;
	            }
	            
	            function onDragEnter(e) {
	            	
	            }
	            
	            function onDragLeave(e) {
	           	 	element.removeClass(dragOverClass+'-top'+' '+dragEnterClass+'-top'+' '+dragOverClass+'-middle'+' '+dragEnterClass+'-middle'+' '+dragOverClass+'-bottom'+' '+dragEnterClass+'-bottom');
	            } 
	            
	            function onDrop(e) {
	                e.preventDefault && e.preventDefault(); 
	                e.stopPropagation && e.stopPropagation(); 
	                
	                //根据鼠标位置判断是移动到目标元素前面还是后面还是目标元素本身
	                var h = element.height();
	                var y = e.originalEvent.offsetY;
	                var position;
	                
	                if(y/h<1/5){
	                	position = 'top';
	                }else if(y/h > 1/5 && y/h < 4/5){
	                	position = 'middle';
	                }else{
	                	position = 'bottom';
	                }                   
	                
	                var data = e.dataTransfer.getData("Text");
	                data = angular.fromJson(data);
	                var fn = $parse(attrs.bmOnDrop);
	                
	                scope.$apply(function () {
	                    fn(scope, {$data: data, $event: e, $position:position});
	                });
	                
	           	 	element.removeClass(dragOverClass+'-top'+' '+dragEnterClass+'-top'+' '+dragOverClass+'-middle'+' '+dragEnterClass+'-middle'+' '+dragOverClass+'-bottom'+' '+dragEnterClass+'-bottom');
	            }
	        	
	        }
	    };
	    
	}]);


	// 调整元素margin
	bmDirectives.directive('bmResizeAble',['$document', function($document) {
		  return {
			    link: function(scope, elm, attrs) {
			    	
			    	/*
		            scope.$watch(attrs.bmResizeAble, function (value) { 
		            	console.log(value);
		            	elm.css({'margin-left':value + 'px'});
		             }); 		    	
			    	*/
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
		    			elm.css({'margin-left':iT + 'px'});
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
	bmDirectives.directive('bmAutoWidth',[function() {
		  return {
			  	restrict : 'A',
			    link: function(scope, elm, attrs) {
			    	  
			    	  //var ghost = elm.prev('.ghost'); 
				      //scope.$watch(attrs.bmAutoWidth, function(value) {
				    	  //elm.width(textWidth(value));
				    	  //var w = ghost ? ghost.width()+10 : textWidth(value);
				    	  //elm.width(w);
					   // });		    	
			    	
			    	  function textWidth(text){ 
			    	        var sensor = jQuery('<pre>'+ text +'</pre>').css({display: 'none'}); 
			    	        jQuery('body').append(sensor); 
			    	        var width = sensor.width();
			    	        sensor.remove(); 
			    	        return width;
			    	    };		    	
			    	
			    	 jQuery(elm).bind('keydown', function(){
			    	    	elm.width(textWidth(elm.val()));
			    	 });		    	
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
	bmDirectives.directive('bmAnimateShow', [function() {
		  return {
			  	restrict : 'A',
			  	link: function(scope, elm, attrs) {
		    	
		      elm.hide();
		      
		      scope.$watch(attrs.bmAnimateShow, function(value) {
		    	  if(value){
		    		  elm.removeClass('animated bounceOut').addClass('animated bounceIn').show();
		    	  }else{
		    		  elm.on('webkitAnimationEnd',function(e){
		    			  this.classList.contains('bounceOut') && elm.hide();
		    		  });
		    		  elm.removeClass('animated bounceIn').addClass('animated bounceOut');
		    	  }
		      });
		      
		    }
		  };
		}]);	

	//
	bmDirectives.directive('bmReturnTop', ['$compile',function($compile) {
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


	// 可视化 布局树
	bmDirectives.directive('bmVtree',['d3', function(d3) {
		  return {
			  	restrict : 'A',
		        scope : {
		        	vtree : '=bmVtree'
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

			    		var svg = d3.select(elm).append('div')
			    		    .attr('class', 'chart')
			    		    .style('width', w + 'px')
			    		    .style('height', h + 'px')
			    		  .append('svg:svg')
			    		    .attr('width', w)
			    		    .attr('height', h)
			    		  .append('svg:g')
			    		    .attr('transform', 'translate(.5,.5)');

			    		  node = root = data;

			    		  var nodes = treemap.nodes(root)
			    		      .filter(function(d) { return !d.children; });

			    		  var cell = svg.selectAll('g')
			    		      .data(nodes)
			    		    .enter().append('svg:g')
			    		      .attr('class', 'cell')
			    		      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
			    		      .on('click', function(d) { return zoom(node === d.parent ? root : d.parent); });

			    		  cell.append('svg:rect')
			    		      .attr('width', function(d) { return d.dx - 1; })
			    		      .attr('height', function(d) { return d.dy - 1; })
			    		      .style('fill', function(d) { return color(d.parent.title); });

			    		  cell.append('svg:text')
			    		      .attr('x', function(d) { return d.dx / 2; })
			    		      .attr('y', function(d) { return d.dy / 2; })
			    		      .attr('dy', '.35em')
			    		      .attr('text-anchor', 'middle')
			    		      .text(function(d) { return d.title; })
			    		      .style('opacity', function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; })
			    		      .on('click',function(d,i){
			    		    	  location.hash = '#/node/'+d.id;
			    		      });

			    		  d3.select(window).on('click', function() { zoom(root); });

			    		  d3.select('select').on('change', function() {
			    		    treemap.value(this.value === 'size' ? size : count).nodes(root);
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

			    		  var t = svg.selectAll('g.cell').transition()
			    		      .duration(d3.event.altKey ? 7500 : 750)
			    		      .attr('transform', function(d) { return 'translate(' + x(d.x) + ',' + y(d.y) + ')'; });

			    		  t.select('rect')
			    		      .attr('width', function(d) { return kx * d.dx - 1; })
			    		      .attr('height', function(d) { return ky * d.dy - 1; });

			    		  t.select('text')
			    		      .attr('x', function(d) { return kx * d.dx / 2; })
			    		      .attr('y', function(d) { return ky * d.dy / 2; })
			    		      .style('opacity', function(d) { return kx * d.dx > d.w ? 1 : 0; });

			    		  node = d;
			    		  d3.event.stopPropagation();
			    		}
			    		
			    	//----------------------------------	
			    		
			    	});
			    	
			    }
			  };
			}]);


	
	// 可视化标签云效果
	bmDirectives.directive('bmVwCloud',['d3', '$location', function(d3, $location) {
		  return {
			  	restrict : 'A',
		        scope : {
		        	vdata : '=bmVwCloud'
		        },  		  	
			    link: function(scope, elm, attrs) {
			    	
			    	var padding = 5;
			    	var ew = elm.width() - padding * 2;
			    	var eh = elm.height() - padding * 2;
			    	
			    	elm = elm[0];	
			    	
			    	scope.$watch('vdata', function (data, oldVal){
			    		//console.log(JSON.stringify(data));
			    		if(!data) return;
				    		        
			    		//------------------------
			    		  var family = 'Microsoft Yahei';
			    		  var wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g;
			    		  var tags;
			    		  var words;
			    		  var max;
			    		  var maxLength = 40;
			    		  var fontSize;
			    		  var complete;
			    		  var fill = d3.scale.category20();
			    		  
			    		  var layout = d3.layout.cloud().size([ew, eh])
			    		      .words(data.map(function(d) {
			    		        return {text: d, size: 10 + Math.random() * 90};
			    		      }))
			    		      .padding(padding)
			    		      .rotate(function() { return ~~(Math.random() * 2) * 90; })
			    		      .font(family)
			    		      .fontSize(function(d) { return d.size; })
			    		      .on('end', draw)
			    		      .start();
			    		   /* 
			    		  var layout = d3.layout.cloud()
			    		    .timeInterval(10)
			    		    .size([ew, eh])
			    		    .fontSize(function(d) { return fontSize(+d.value); })
			    		    .text(function(d) { return d.key; })
			    		    //.on("word", progress)
			    		    .on("end", draw);			    		  

			    		  parseText(data);
			    		  */
			    		  //////////////////////////////////////////////////////////////////
			    		  
			    		  function draw(words) {
			    		    d3.select(elm).append('svg')
			    		        .attr('width', ew)
			    		        .attr('height', eh)
			    		      .append('g')
			    		        .attr('transform', 'translate('+ew/2+','+eh/2+')')
			    		      .selectAll('text')
			    		        .data(words)
			    		      .enter().append('text')
			    		        .style('font-size', function(d) { return d.size + 'px'; })
			    		        .style('font-family', family)
			    		        .attr('cursor', 'pointer')
			    		        .style('fill', function(d, i) { return fill(i); })
			    		        .attr('text-anchor', 'middle')
			    		        .attr('transform', function(d) {
			    		          return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
			    		        })
			    		        .text(function(d) { return d.text; })
			    		        .on('click',function(d){
			    		        	//console.log(d);
			    		        	//$location.path('/search/'+d.text);
			    		        	location.hash = '#/search/'+encodeURIComponent(d.text);
			    		        });
			    		  }
			    		  
			    		  function parseText(text) {
				    			 text = text.slice ? text : text.split( true ? /\n/g : wordSeparators);
					    		 tags = {};
					    		 var cases = {};
					    		 text.forEach(function(word) {
					    		      word = word.substr(0, maxLength);
					    		      cases[word.toLowerCase()] = word;
					    		      tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
					    		    });
					    		 tags = d3.entries(tags).sort(function(a, b) { return b.value - a.value; });
					    		 tags.forEach(function(d) { d.key = cases[d.key]; });
					    		 generate();
			    		  }

			    		  function generate() {
			    		    layout
			    		        .font(family)
			    		        .spiral('archimedean' || 'rectangular');
			    		    fontSize = d3.scale['log' || 'sqrt' || 'linear']().range([10, 100]);
			    		    if (tags.length) fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
			    		    complete = 0;
			    		    words = [];
			    		    layout.stop().words(tags.slice(0, max = Math.min(tags.length, 200))).start();
			    		  }
			    		
			    	//----------------------------------	
			    		
			    	});
			    	
			    }
			  };
			}]);


})(angular);  
