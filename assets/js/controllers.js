'use strict';

/**
 * Controllers 
 */


// 列出书签树单个节点下所有子节点
function nodeCtrl($scope, $routeParams, bookmarkManager) {
	
	var getPath = function(id,call){
		var results = [];
		return (function f(id){
			return bookmarkManager.get(id).then(function (arr){
				var node = arr[0];
				if(node){
					results.unshift({id:node.id,title:node.title}); 
					id = node.parentId;	
					if(id){
						return f(id);
					}else{
						return results;//call && call(results);
					}
				}else{
					return results;//call && call(results);
				}
			});			
		})(id);
	};	
	
	var id = $routeParams.nodeId || '1';
	
	/////////////////////////////////////////////////////
	
	$scope._getData = function(){
		return bookmarkManager.getChildren(id);
	};
	
	//$scope._check = function(r){};
		
	
	$scope._update = function(r){
		
		getPath(id).then(function(r){
			$scope.paths = r;
		});
		
		$scope.bookmarks = r;		
	};
	
	/////////////////////////////////////////////////////
	
	// 默认以index排序
	$scope.orderProp = 'index';
	
	// 反转排序结果
	$scope.sortReverse = true;
	
	// 拖动排序限定
	$scope.dragChannel = 'dir';
	$scope.dropChannel = 'list';	
	
	//main
	$scope.main();
	
	$scope.$watch('orderProp',function(newValue){
		if(!newValue) {
			$scope.dropChannel = 'dir';
		}else{
			$scope.dropChannel = 'list';
		}
	});
	
	/////////////////////////////////////////////////////	
	//event handler
	$scope.$on('bookmarkTree.change', function(e, msg){
		$scope.onBookmarkTreeChangeHandler(e, msg);
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

	var findInTree = $scope.findInTree;
	
	var id = $routeParams.nodeId;
	
	/////////////////////////////////////////////////////
	
	$scope._getData = function(){
		return id ? bookmarkManager.getSubTree(id) : bookmarkManager.getTree();
	};
	
	$scope._check = function(r){
		
		var isCtree = function (r){
			for(var i in r){
				if('children' in r[i]){
					return 1;
				} 
			}
			return 0;
		};		

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
		
		return r;
	};
		
	$scope._update = function(r){
		$scope.tree = r;
		$scope.vtree = r[0]; 		
	};	
	
	/////////////////////////////////////////////////////
	
	// 拖动排序限定
	$scope.dragChannel = 'dir';
	$scope.dropChannel = 'dir';	
	
	// main
	$scope.main();
	
	/////////////////////////////////////////////////////	
	
	$scope.dropSuccessHandler = $scope.dropSuccessHandler;
    
    $scope.onDrop = function($event, $position, $data, node, root){

    	var destination = {};
		var z = findInTree(node.id, root);
		var place = z.place;
		var index = z.index;
		
		var dragId = $data.id;
		
		// 拖动的是目录节点
		if(!$data.url){
			
			$data.id = 'x_' + dragId;
			
	    	// 根据鼠标位置对拖动元素进行移动定位
	    	if($position == 'top'){
	    		
	    		place.splice(index, 0, $data); 
	    		
	    		destination.index = node.index;
	    		destination.parentId = node.parentId;	    		
	    		
	    	}else if($position == 'bottom'){
	    		
	    		index = index+1;
	    		place.splice(index, 0, $data);
	    		
	    		destination.index = node.index+1;
	    		destination.parentId = node.parentId;	    		
	    		
	    	}else if($position == 'middle'){
	    		
	    		node.children = node.children || [];
	    		node.children.push($data);
	    		
	    		destination.parentId = node.id;
	    		
	    	}  		
	    	
		}else{ // 或者拖动的是书签节点
			
	    	if($position == 'top'){
	    		
	    		destination.index = node.index;
	    		destination.parentId = node.parentId;
	    		
	    	}else if($position == 'bottom'){
	    		
	    		destination.index = node.index+1;
	    		destination.parentId = node.parentId;
	    		
	    	}else if($position == 'middle'){
	    		
	    		destination.parentId = node.id;
	    	}  			
		}
    	
    	//bookmarkManager.move(dragId, destination);
    	
    };		
	
	/////////////////////////////////////////////////////	
	
	$scope.$on('bookmarkTree.change', function(e, msg){
		$scope.onBookmarkTreeChangeHandler(e, msg);
	});
	
}


// 列出最近使用的书签
function recentCtrl($scope, bookmarkManager){

	$scope._getData = function(){
		return bookmarkManager.getRecent(100);
	};
	
	$scope._update = function(r){
		$scope.bookmarks = r;
	};
	
	/////////////////////////////////////////////////////	
	// main 
	$scope.main();
	
	/////////////////////////////////////////////////////
	$scope.$on('bookmarkTree.change', function(e, msg){
		$scope.onBookmarkTreeChangeHandler(e, msg);
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
	
	var main = $scope.main = function(){
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
		//main();
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
	
	var navs = $scope.navs = [{text:'Main',href:'node'},
	              //{text:'目录',href:'dir'},
	              {text:'最近',href:'recent'},
	              //{text:'hot',href:'hot'},
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
	
	$scope.remove = function(bookmark, bookmarks){
		
		var z = findInTree(bookmark.id, bookmarks);
		var place = z.place;
		var index = z.index;
		
		// 前端
		place.splice(index, 1); 
		
		// 后端
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
	
	$scope.add = function(node){
		if(!node.url){
			var place = node.children = node.children || [];
			var bookmark = {title:'新建文件夹',parentId : node.id};
			
			bookmarkManager.add(bookmark).then(function(r){
				//place.push(r);
				//$scope.edit(r);
				angular.extend(bookmark, r);
			});
			
			place.push(bookmark);
			$scope.edit(bookmark);
		}

	};
	
	//////////////////////////////////////////////////////////////////////	
	
	// 拖动排序限定
	$scope.dragChannel = 'dir';
	$scope.dropChannel = 'list';		
	
	//////////////////////////////////////////////////////////////////////

	// 用于在书签树中通过书签节点id查找书签的位置
	var findInTree = $scope.findInTree = function(node, root){
		
		var id = typeof node === 'object' ? node.id : node;
		var _r;
		var _i;
		var b = (function f(tree){
			_r = tree;
			var node;
			
			for(var i=0; i<tree.length; i++){
				_i = i;
				
				node = tree[i];
				
				if(node.id == id){
					return 1;
				}

			}
			
			for(i = 0; i< tree.length; i++){
				
				node = tree[i];
				if(node.children){
					if( f(node.children) ) return 1;
				}	
				
			}
			
		})(root);	
		
		return b ? {place: _r, index: _i} : {place:[]};
	};	
	
	//////////////////////////////////////////////////////////////////////

	//拖动处理
	$scope.dropSuccessHandler = function($event, node, root){
		
		// 根据拖动节点的Id找到所在原位置，删除
		var id = node.id;
		var z = findInTree(id, root);
		var place = z.place;
		var index = z.index;
		
		place.splice(index, 1); 
		
		// 查找复制的拖动节点，修改id为拖动节点的id
		z = findInTree('x_' + id, root);
		place = z.place;
		index = z.index;
		node = place[index];
		if(node){
			node.id = id;
		}
    };    
     
    $scope.onDrop = function($event, $position, $data, node, root){ 
		
    	var destination = {};
		var z = findInTree(node.id, root);
		var place = z.place;
		var index = z.index;
		
		var dragId = $data.id;
		
		$data.id = 'x_' + dragId;
    	
    	//根据鼠标位置对拖动元素进行移动定位
    	if($position == 'top' || ($position == 'middle' && node.url)){
    		
    		place.splice(index, 0, $data);
    		destination.index = node.index;
    		destination.parentId = node.parentId;
    		
    	}else if($position == 'bottom'){
    		
    		index = index + 1;
    		place.splice(index, 0, $data);
    		destination.index = node.index + 1;
    		destination.parentId = node.parentId;
    		
    	}else if($position == 'middle' && !node.url){
    		
    		destination.parentId = node.id;
    		
    	}  
    	
      bookmarkManager.move(dragId, destination);
       
    };	
    
    // 检查新数据是否有变化，用于子控制器继承;
	$scope._check = function(data){
		var now = JSON.stringify(data);
		
		if (this._old == now) return false;
		
		this._old = now;
		
		return data;		
	};
	
	// 程序入口，用于子控制器继承;
	$scope.main = function(){
		
		var that = this;
		
		that._getData()
		.then(function(data){
			return that._check(data);
		})
		.then(function(data){
			return data && that._update(data);
		});			
		
	};
    
    //////////////////////////////////////////////////////
	
	// bookmarkTreeChange事件处理程序，用于被子控制器继承
	$scope.onBookmarkTreeChangeHandler = function(e, msg){
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
		//console.log(JSON.stringify(msg));
		var eventName = msg[0];
		var that = this;
		
		// 如果当前标签页后台运行，更新数据
		if(0 && eventName == 'onCreated'){
			
			that._getData()
			.then(function(data){
				return that._check(data);
			})
			.then(function(data){
				return data && that._update(data);
			});	
			
		}

		
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
			 
	

  
  
  
  
  
  
