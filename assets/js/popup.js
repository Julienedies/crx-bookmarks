
chrome.tabs.create({ url: 'index.html', selected: true });
window.close();


var bmApp = angular.module('bmApp', [ 'bmServices']);

bmApp.controller('addCtrl',['$scope', 'cTabsInterface', 'bookmarkManager', function($scope, cTabsInterface, bookmarkManager){
	
	$scope.bookmarkManager = bookmarkManager;
	
	$scope.openBookmarkManager = function(){
		var openUrl = 'bookmarkManager.html';
		chrome.tabs.create({ url: openUrl, selected: true });
	};
	
	var bookmark = $scope.bookmark = {};
	
	$scope.add = function(){
		bookmarkManager.add(bookmark).then(function(bk){
			bookmark.id = bk.id;
		});		
	};
	
	//获取当前标签的title和url,添加到书签栏
	cTabsInterface.getSelected().then(function(tab){
		
	    //alert(JSON.stringify(tab));
		bookmark.title = tab.title;
		bookmark.url = tab.url;
		
	});
	
}]);