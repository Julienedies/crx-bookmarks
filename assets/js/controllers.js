'use strict';

/**
 * Controllers 
 */


// 列出书签树单个节点下所有子节点
function nodeCtrl($scope, $routeParams, bookmarkManager) {
	
	var getPathById = function(id,call){
		var results = [];
		(function f(id){
			bookmarkManager.get(id).then(function (arr){
				var node = arr[0];
				if(node){
					results.unshift({id:node.id,title:node.title}); 
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
	};	
	
	var id = $routeParams.nodeId || 1;
	
	var main = function(){
		getPathById(id, function(r){
			$scope.$emit("paths.change", r);
		});

		bookmarkManager.getSubTree(id).then(function(r){
			//console.log(JSON.stringify(r));
			$scope.bookmarks = r[0].children;
		});				
	};
	
	/////////////////////////////////////////////////////
	
	$scope.orderProp = 'index';

	main();
	
	/////////////////////////////////////////////////////	
	
	$scope.remove = function(bookmak, index){
		$scope.bookmarks.splice(index, 1);
		$scope.removef(bookmak);
	};
	
	/////////////////////////////////////////////////////	
	//event handler
	$scope.$on('bookmarkTree.change',function(e,data){
		console.log(data);
		console.log(e);
		main();	
	});
	
}

//列出书签树中所有书签目录
function dirCtrl($scope, bookmarkManager) {
	
	var main = function(){
		bookmarkManager.getTree().then(function(r){
			$scope.tree = r;
		});			
	};

	/////////////////////////////////////////////////////
	
	main();
	
	/////////////////////////////////////////////////////
	
	$scope.$on('bookmarkTree.change',function(e,data){
		main();			
	});
	
}


//书签树可视化
function vdirCtrl($scope, $routeParams, bookmarkManager) {

	var isCtree = function (r){
		for(var i in r){
			if('children' in r[i]){
				return 1;
			} 
		}
		return 0;
	};

	var call = function(r){
		//console.log(r); 
		//r = [{children:[{children:[{name:111},{name:112}],name:11},{children:[{name:121},{name:122}],name:12}],name:1},{name:2},{name:3}];
		(function f(r){
			var v;
			for(var i=0; i<r.length; i++){
				v = r[i];
				if(v.children){
					if(isCtree(v.children)){
						f(v.children);
					}else{
						delete v.children;
					}					
				}else{
					r.splice(i,1);
					i--;
				}
			}
		})(r);
	
		//console.log(r); 
		//console.log(JSON.stringify(r[0]));
		$scope.vtree = r[0]; 		
	};

	var call2 = function(r){
		$scope.vtree = r[0]; 
	};
	
	
	var id = $routeParams.nodeId;
	
	var main = function(){
		if(!id){
			bookmarkManager.getTree().then(call);
		}else{
			bookmarkManager.getSubTree(id).then(call2);
		}		
	};	

	/////////////////////////////////////////////////////

	main();
				
	/////////////////////////////////////////////////////	
	
	$scope.$on('bookmarkTree.change',function(e,data){
		main();			
	});
	
}


// 列出最近使用的书签
function recentCtrl($scope, bookmarkManager){

	var main = function(e,msg){
		
		bookmarkManager.getRecent(100).then(function(r){
			
			var e = e;
			var msg = msg;
			
			if(!e){//如果不是事件回调
				
				$scope.bookmarks = r;
				
			}else{
				$scope.bookmarks.unshift(msg.splice(1,1)[0]);
				/*
				//对新值和旧值进行比较，如果变化，根据变化修改旧值;避免直接覆盖旧值，导致dom全部更新，造成性能下降;
				if(JSON.stringify($scope.bookmarks) !== JSON.stringify(r)){
					console.log('It\'s changed,it have to update!',new Date);
					$scope.bookmarks.unshift(msg.splice(1,1)[0]);
					
					var eventName = msg.splice(0,1)[0];
					if(eventName == 'onCreated'){
						console.log(eventName,msg.splice(1,1)[0]);
					}
				}	
				*/			
			}
		});			
	};
	
	/////////////////////////////////////////////////////
	
	main();	
	
	/////////////////////////////////////////////////////	
	
	$scope.remove = function(bookmak, index){
		$scope.bookmarks.splice(index, 1);
		$scope.removef(bookmak);
	};
	
	/////////////////////////////////////////////////////
	
	$scope.$on('bookmarkTree.change',function(e,msg){
		var eventName = msg.splice(0,1)[0];
		if(eventName == 'onCreated'){
			main(e,msg);
		}
	});

}

//
function searchCtrl($scope, $routeParams, bookmarkManager) {
	
	var main = function(){
		var q = $routeParams.q;
		if(q){
			bookmarkManager.search(q).then(function(r){
				$scope.bookmarks = r || [];
			});		
		}			
	};
	
	/////////////////////////////////////////////////////
	
	main();
	
	/////////////////////////////////////////////////////	
	
	$scope.remove = function(bookmak, index){
		//调用父控制器的removef方法
		$scope.removef(bookmak);
		$scope.bookmarks.splice(index, 1);
	};
	
	/////////////////////////////////////////////////////
	

}

// 显示标签列表
function tagsCtrl($scope) {
	
	var bmRelTableManager = $scope.bmRelTableManager = $scope.bmRelTableManager;
	var bookmarkManager = $scope.bookmarkManager = $scope.bookmarkManager;
	
	var getTags = function(m){
		var o = {};
		var r=[];
		for(var i in m){
			r = m[i].tags;
			r = r.replace(/，/g,',').replace(/\s+/g,'').split(',');
			for(var j = 0,v; j< r.length; j++){
				v = r[j];
				o[v] = o[v] || [];
				o[v].push(i);
			}
		}
		return o;
	};
	
	var main = function(){
		bmRelTableManager.get().then(function(bmRelTable){
			var tagsMap;
			//console.log(bmRelTable);
			$scope.bmRelTable = bmRelTable;
			tagsMap = $scope.tagsMap = getTags(bmRelTable);
			$scope.$emit("tagsMap", tagsMap);
		});
	};
	
	/////////////////////////////////////////////////////
	main();
	
	/////////////////////////////////////////////////////
	$scope.$on('chrome.storage.change',function(e,data){
		console.log('chrome.storage.change.tags',data);
		main();
	});
		
}

//显示某标签下的所有书签
function tagCtrl($scope, $routeParams, bookmarkManager) {
	
	var tags = $routeParams.tag;
	var tagsMap = $scope.tagsMap;
	var ids = tagsMap[tags];
	
	var main = function(){
		bookmarkManager.get(ids).then(function(r){
			$scope.bookmarks = r;
		});			
	};
	
	/////////////////////////////////////////////////////
	
	//$scope.orderProp = 'dateAdded';

	main();
	
	/////////////////////////////////////////////////////	
	
	$scope.remove = function(bookmak, index){
		$scope.removef(bookmak);
		$scope.bookmarks.splice(index, 1);
	};
	
	/////////////////////////////////////////////////////	
	
}


//
function classifyCtrl($scope) {
	
	var bmRelTableManager = $scope.bmRelTableManager = $scope.bmRelTableManager;
	var bookmarkManager = $scope.bookmarkManager = $scope.bookmarkManager;
	
	var getTags = function(m){
		var o = {};
		var r=[];
		for(var i in m){
			r = m[i].tags;
			r = r.replace(/，/g,',').replace(/\s+/g,'').split(',');
			for(var j = 0,v; j< r.length; j++){
				v = r[j];
				o[v] = o[v] || [];
				o[v].push(i);
			}
		}
		return o;
	};
	
	var main = function(){
		bmRelTableManager.get().then(function(bmRelTable){
			console.log(bmRelTable);
			$scope.bmRelTable = bmRelTable;
			$scope.tags = getTags(bmRelTable);
		});
	};
	
	/////////////////////////////////////////////////////
	main();
	
	////////////////////////////////////////////////////
	$scope.getBmByTag = function(ids){
		bookmarkManager.get(ids).then(function(r){
			$scope.bookmarks = r;
		});
	};
}

//
function hotCtrl($scope) {
	
}

//
function trashCtrl($scope, bookmarkManager, rmBookmarkManager) {
	
	var main = function(){
		rmBookmarkManager.get().then(function(r){
			//console.log(r);
			$scope.bookmarks = JSON.stringify(r) == '{}' ? false : r;
		});			
	};
	
	/////////////////////////////////////////////////////
	
	main();
	
	/////////////////////////////////////////////////////
	
	$scope.clear = function(){
		$scope.bookmarks = false;
		rmBookmarkManager.clear();
	};	
	
	$scope.remove = function(bookmark, key){
		rmBookmarkManager.remove(bookmark);
		delete $scope.bookmarks[key];
	};	
	
	$scope.recover = function(bookmark, key){
		bookmarkManager.recover(bookmark);
		rmBookmarkManager.remove(bookmark);
		delete $scope.bookmarks[key];
	};	
	
	/////////////////////////////////////////////////////
	
	$scope.$on('chrome.storage.change',function(e,data){
		console.log('data',data);
		main();
	});
	
}

//
function setingCtrl($scope) {
	
}

/*
	<li ng-class="style.node"><a href="#/node/1">Main</a></li>
	<li ng-class=""><a href="#/dir">书签目录</a></li>
	<li ng-class=""><a href="#/recent">最近使用</a></li>
	<li ng-class=""><a href="#/hot">高频书签</a></li>
	<li ng-class=""><a href="#/classify">分类&标签</a></li>
	<li ng-class=""><a href="#/trash">回收站</a></li>	
	<li ng-class=""><a href="#/seting">设置</a></li>
	<li ng-class=""><a href="#/help">help</a></li>
 */

//
function mainCtrl($scope, $window, $location, $timeout, bookmarkManager, bmRelTableManager, rmBookmarkManager, DSmanager){
	
	var navs = $scope.navs = [{text:'Main',href:'node/1'},
	              {text:'目录',href:'dir'},
	              {text:'最近',href:'recent'},
	              {text:'hot',href:'hot'},
	              //{text:'分类',href:'classify'},
	              {text:'回收站',href:'trash'},
	              {text:'设置',href:'seting'},
	              {text:'help',href:'help'}];
	
	var setActive = $scope.setActive = function(nav){
		$scope.current && ( $scope.current.cla = '');
		nav.cla = 'active';
		$scope.current = nav;
	};
	
	 //$scope.orderProp = 'index';
	$scope.$location = $location;
	$scope.bookmarkManager = bookmarkManager;
	$scope.bmRelTableManager = bmRelTableManager;
	$scope.rmBookmarkManager = rmBookmarkManager;
	$scope.DSmanager = DSmanager;
	
	////////////////////////////////////////////////////////////
	
	$scope.searchf = function(){
		if($scope.q){
			$location.path('/search/'+$scope.q);
		}
	};	
	
	$scope.edit = function(bookmark){
		var currentEditing = $scope.currentEditing;
		if(!bookmark.editing){
			currentEditing && (currentEditing.editing = false);
			bookmark.editing = true;
			$scope.currentEditing = bookmark;
			if(typeof bookmark.tags === 'undefined'){
				bmRelTableManager.get(bookmark.id).then(function(bmRel){
					if(bmRel){
						bookmark.tags = bmRel.tags;
					}
				});				
			}
		}else{
			bookmark.editing = false;
		}
	};
	
	$scope.exit = function(bookmark){
		bookmark.editing = false;
	};
	
	$scope.open = function(bookmark){
		if(bookmark.url){
			$window.open(bookmark.url);
		}else{
			$location.path('/node/'+bookmark.id);
		}
	};		
	
	
	$scope.removef = function(bookmark, index){
		//rmBookmarkManager.set(bookmark);
		bookmarkManager.remove(bookmark);
		bmRelTableManager.remove(bookmark);
	};
	
	$scope.update = function(bookmark){
		bookmark.editing = false;
		bookmarkManager.update(bookmark);
		console.log(typeof bookmark.tags);
		if(typeof bookmark.tags !== 'undefined'){
			bmRelTableManager.set({id:bookmark.id,tags:bookmark.tags});
		}
	};

	//拖动处理
	$scope.dropSuccessHandler = function($event,index,bookmark,bookmarks){
		bookmarks.splice(index,1);
    };
     
    $scope.onDrop = function($event,index,bookmark,$data,$suffix,bookmarks){
    	
    	var destination = {}; console.log($suffix);
    	var parentId = bookmark.parentId;
    	
    	if (bookmark.id == $data.id) return;
    	
    	if($suffix == 'top'){
    		
    		bookmarks.splice(index,0,$data);
    		destination.index = index;
    		
    	}else if($suffix == 'bottom'){
    		
    		index = index+1;
    		bookmarks.splice(index,0,$data);
    		destination.index = index;
    		
    	}else if(!bookmark.url){
    		
    		parentId = bookmark.id;
    		
    	}  
    	
    	destination.parentId = parentId;
    	//bookmarkManager.move($data,{parentId:$data.parentId,index:bookmark.index});
        bookmarkManager.move($data,destination);
    };	
	
	
	// bookmarkTreeChange事件处理程序，用于被子控制器继承
	$scope.bookmarkTreeChangeHandler = function(e, msg){
		var fs = {
				onCreated: function(){
					
				},
				onRemoved: function(){
					
				},
				onChanged: function(){
					
				},
				onMoved: function(){
					
				},
				onChildrenReordered: function(){
					
				}				
				
		};
		//具体事件名
		var eventName = data.splice(0,1)[0];
		
		this.updateBms().then(function(data){
			
		});
	};
	
	//////////////////////////////////////////////////////////////
	
	 $scope.$on('$locationChangeSuccess',function(e,msg){
		 delete $scope.paths;
		 var reg = /\#\/(\w+)(?:\/\S+)?$/;
		 var result = msg.match(reg);
		 var hash = result && result[1];
		 var nav;
		 for(var i in navs){
				nav = navs[i];
				if(nav.href.search(hash)==0){
					setActive(nav);
				}
			}		
	 });	
	
	 $scope.$on('paths.change',function(e,msg){
		 $scope.paths = msg;
	 });
	 
	 $scope.$on('tagsMap',function(e,msg){
		 $scope.tagsMap = msg;
	 });	 
	
}


var bmControllers = angular.module('bmControllers', []);
                                                         
bmControllers.controller('mainCtrl',['$scope', '$window', '$location', '$timeout', 'bookmarkManager', 'bmRelTableManager', 'rmBookmarkManager', 'DSmanager', mainCtrl]);

bmControllers.controller('nodeCtrl',['$scope', '$routeParams', 'bookmarkManager', nodeCtrl]);

bmControllers.controller('dirCtrl',['$scope', 'bookmarkManager', dirCtrl]);

bmControllers.controller('vdirCtrl',['$scope', '$routeParams', 'bookmarkManager', vdirCtrl]);

bmControllers.controller('recentCtrl',['$scope', 'bookmarkManager', recentCtrl]);

bmControllers.controller('classifyCtrl',['$scope', 'bookmarkManager', classifyCtrl]);

bmControllers.controller('hotCtrl',['$scope', 'bookmarkManager', hotCtrl]);

bmControllers.controller('trashCtrl',['$scope', 'bookmarkManager', 'rmBookmarkManager', trashCtrl]);

bmControllers.controller('setingCtrl',['$scope', 'bookmarkManager', setingCtrl]);

bmControllers.controller('searchCtrl',['$scope', '$routeParams', 'bookmarkManager', searchCtrl]);
			 
	

  
  
  
  
  
  
