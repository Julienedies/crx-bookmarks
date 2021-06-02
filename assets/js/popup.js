'use strict';

//chrome.tabs.create({ url: 'index.html', selected: true });
//window.close();

(function(angular){
	

	var bmApp = angular.module('bmApp', [ 'ngRoute', 'bmServices', 'bmDirectives', 'bmFilters', 'bmAnimations', 'bmControllers']);

	bmApp.controller('addCtrl',['$scope', 'cTabsInterface', 'bookmarkManager', addCtrl ]);

	/////////////////////////////////////////////////////////////////////////////////

	function addCtrl($scope, cTabsInterface, bookmarkManager){
		
		// 从父控制器继承
		var bookmarkManager = $scope.bookmarkManager = bookmarkManager;
		var bmRelTableManager = $scope.bmRelTableManager = $scope.bmRelTableManager;		
		
		var bookmark = $scope.bookmark = {};
		
		
		// 获取当前标签的title和url
		cTabsInterface.getSelected().then(function(tab){
			//alert(JSON.stringify(tab));
			
			// 检查当前页面是否被添加到书签树
			bookmarkManager.search(tab.url).then(function(r){
				//alert(JSON.stringify(r));
				if(r && r.length === 1){
					angular.extend(bookmark,r[0]);
					
					bmRelTableManager.get(bookmark.id).then(function(r){
						if(r){
							bookmark.tags = r.tags;
						}
					});
					
				}else{
					bookmark.title = tab.title;
					bookmark.url = tab.url;					
				}
			});
			
		});	
		
		/////////////////////////////////////////////
		// 创建新书签
		$scope.create = function(){
			
			bookmarkManager.add(bookmark).then(function(bk){
				bookmark.id = bk.id;
				
				if(typeof bookmark.tags !== 'undefined'){
					bmRelTableManager.set({id:bk.id, tags:bookmark.tags});
				}		
				
			});		
		};
		
		// 修改书签
		$scope.updatef = function(bookmark){
			
			$scope.update(bookmark);
			
			if(bookmark.newParentId && bookmark.newParentId !== bookmark.parentId){
				bookmarkManager.move(bookmark.id, {parentId: bookmark.newParentId});
			}
			
		};		
		
		// 加载目录
		$scope.loadDir = function(){
			$scope.tempName = 'tmpl/dir-s.html';
		};
		
		// 打开书签管理页面
		$scope.openBookmarkManager = function(){
			var openUrl = 'index.html';
			chrome.tabs.create({ url: openUrl, selected: true });
		};		
		
		/////////////////////////////////////////////
		
		$scope.$on('selected.dir', function(e,msg){
			if(bookmark.id){
				bookmark.newParentId = msg.id;
			}else{
				bookmark.parentId = msg.id;
			}
			 
		});
		

		
	}
	
	
	

})(angular);