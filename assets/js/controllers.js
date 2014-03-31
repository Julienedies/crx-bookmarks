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

	main();
	
	/////////////////////////////////////////////////////	
	
	$scope.remove = function(bookmak, index){
		$scope.removef(bookmak);
		$scope.bookmarks.splice(index, 1);
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

	var main = function(){
		bookmarkManager.getRecent(4).then(function(r){
			$scope.bookmarks = r;
		});			
	};
	/////////////////////////////////////////////////////
	
	main();	
	
	/////////////////////////////////////////////////////	
	
	$scope.remove = function(bookmak, index){
		$scope.removef(bookmak);
		$scope.bookmarks.splice(index, 1);
	};
	
	/////////////////////////////////////////////////////
	
	$scope.$on('bookmarkTree.change',function(e,data){
		console.log(data);
		main();		
	});

}

//
function searchCtrl($scope, $routeParams, bookmarkManager) {
	
	var main = function(){
		if($routeParams.searchText){
			bookmarkManager.search($routeParams.searchText).then(function(r){
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

//
function classifyCtrl($scope) {
	
}

//
function hotCtrl($scope) {
	
}

//
function trashCtrl($scope, bookmarkManager, rmBookmarkManager) {
	
	$scope.bookmarks = null;
	
	/////////////////////////////////////////////////////
	//main
	
	rmBookmarkManager.get().then(function(r){
		//console.log(r);
		$scope.bookmarks = JSON.stringify(r) == '{}' ? false : r;
	});		
	
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
	//event handler
	//$scope.$on('chrome.storage.change',function(e,data){});
	
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
function mainCtrl($scope, $window, $location, $timeout, bookmarkManager, rmBookmarkManager, DSmanager){
	
	var navs = $scope.navs = [{text:'Main',href:'node/1'},
	              {text:'目录',href:'dir'},
	              {text:'最近',href:'recent'},
	              {text:'hot',href:'hot'},
	              {text:'分类',href:'classify'},
	              {text:'回收站',href:'trash'},
	              {text:'设置',href:'seting'},
	              {text:'help',href:'help'}];
	
	var setActive = $scope.setActive = function(nav){
		$scope.current && ( $scope.current.cla = '');
		nav.cla = 'active';
		$scope.current = nav;
	};
	
	 //$scope.orderProp = 'index';
	
	$scope.bookmarkManager = bookmarkManager;
	$scope.rmBookmarkManager = rmBookmarkManager;
	$scope.DSmanager = DSmanager;
	
	////////////////////////////////////////////////////////////
	
	$scope.searchf = function(){
		if($scope.searchText){
			$location.path('/search/'+$scope.searchText);
		}
	};	
	
	$scope.edit = function(bookmark){
		var currentEditing = $scope.currentEditing;
		if(!bookmark.editing){
			currentEditing && (currentEditing.editing = false);
			bookmark.editing = true;
			$scope.currentEditing = bookmark;
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
		rmBookmarkManager.set(bookmark);
		bookmarkManager.remove(bookmark);
	};
	
	$scope.update = function(bookmark){
		bookmarkManager.update(bookmark);
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
	
}


var bmControllers = angular.module('bmControllers', []);
                                                         
bmControllers.controller('mainCtrl',['$scope', '$window', '$location', '$timeout', 'bookmarkManager', 'rmBookmarkManager', 'DSmanager', mainCtrl]);

bmControllers.controller('nodeCtrl',['$scope', '$routeParams', 'bookmarkManager', nodeCtrl]);

bmControllers.controller('dirCtrl',['$scope', 'bookmarkManager', dirCtrl]);

bmControllers.controller('vdirCtrl',['$scope', '$routeParams', 'bookmarkManager', vdirCtrl]);

bmControllers.controller('recentCtrl',['$scope', 'bookmarkManager', recentCtrl]);

bmControllers.controller('classifyCtrl',['$scope', 'bookmarkManager', classifyCtrl]);

bmControllers.controller('hotCtrl',['$scope', 'bookmarkManager', hotCtrl]);

bmControllers.controller('trashCtrl',['$scope', 'bookmarkManager', 'rmBookmarkManager', trashCtrl]);

bmControllers.controller('setingCtrl',['$scope', 'bookmarkManager', setingCtrl]);

bmControllers.controller('searchCtrl',['$scope', '$routeParams', 'bookmarkManager', searchCtrl]);
			 
	

  
  
  
  
  
  
