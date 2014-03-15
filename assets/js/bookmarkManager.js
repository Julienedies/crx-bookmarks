/**
 * app目标：
 * 
 * 1：书签树格式化；
 * 2：可以按多种方式排序；
 * 
 */

//init
$(function($){
	
	//全局变量命名空间
	window.APPGLOBAL = {};
	
	function isTree(o){
		if(typeof o === 'object'){
			for(var i in o){
				if(typeof o[i] === 'object'){
					return 1;
				} 
			}
		}
		return 0;
	}
	
	function getListFromTree(tree,list){
		var list = list || [];
		var item;
		
		for(var i in tree){
			item = tree[i];
			
			if( isTree(item) ){
				getListFromTree(item, list);
			}else if(typeof item === 'object'){
				list.push(item);
			}	
		}
		
		return list;
	}	
	
	function cc(obj){
		return cg(JSON.stringify(obj));
	}
	function cg(obj){
		console.log(obj);
	}	
	
	function domainURI(str){  
	    var durl=/^(\w+:\/\/\/?[^\/]+)\//i;  
	    domain = str.match(durl);  
	    return domain && domain[1];  
	 }  
	
	function getPathById(id,call){
		var results = [];
		
		(function f(id){
			chrome.bookmarks.get(id, function (arr){
				var node = arr[0];
				if(node){
					results.unshift({id:node.id,title:node.title||'alias'}); 
					id = node.parentId;	
					if(id){
						f(id);
					}else{
						call && call(results);
					}
				}else{
					call && call(results);
				}
			});			
		})(id);

	}
	
	function getViewById(id,call){
		chrome.bookmarks.getSubTree(id, call);
	}
	
	function formatPath(r){
		var span = d3.select('#path').selectAll('span').data(r);
		
		span.enter().append('span');
		
		span.exit().remove();
		
		span.text(function(d){
			return d.title + ' › ';
		})
		.on('click',function(d,i){
			getPathById(d.id, function(r){
				formatPath(r);
			});	
			getViewById(d.id, function(r){
				d3.select('#view').selectAll('li').remove();
				formatView(r[0].children);
			});
		});
	}
	
	//将数据转换为dom
	function formatView(r){
		var li =  d3.select('#view').selectAll('li').data(r);
		
		li.enter().append('li');
		
		li.html(function(d){
			if(d.children){
				return '<b>'+(d.title||'alias')+'</b>';
			}else{
				var html = '<img src="$icon/favicon.ico" /><a href="$url" target="_blank">$title</a>';
				var icon = domainURI(d.url);
				return html.replace('$icon',icon).replace('$url',d.url).replace('$title',(d.title || d.url));				
			}
		})
		.on('click',function(d, i){
			var r;
			if( r = d.children){
				d3.select('#view').selectAll('li').remove();
				formatView(r);
				
				getPathById(d.id, function(r){
					formatPath(r);
				});				
			}
		});
	}
	
	//
	function getRecent(size){
		
		chrome.bookmarks.getTree(function(r){
			var slice,
				list = getListFromTree(r);
			
			list.sort(function(a,b){
				return a.dateAdded - b.dateAdded;
			});
			
			slice = list.slice(-size).reverse(); 
			
			formatView(slice);
		});

	}

	
	
	
	///////////////////////////////////////////////////////////
	
	
	
	

		

		
	
		

		
	
	
	
	/*
	chrome.bookmarks.getTree(function(r){
		console.log(r); 
		
		//window.qq = r;return;
		//r = JSON.stringify(r);
		//$('body').html(r);
		
	});	    
    
	*/	
	
	
	
});























