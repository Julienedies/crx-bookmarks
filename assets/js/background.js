
var bmApp = angular.module('bmApp', [ 'bmServices']);

bmApp.controller('listenerCtrl',['$scope', 'cbInterface', 'rmBookmarkManager', function($scope, cbInterface, rmBookmarkManager){
	
	/*
	 * 因为没有办法从onRemoved事件中获取删除书签的title和url,
	 * 所以需要先备份当前书签树，根据删除书签的id，从备份书签树取得相关信息，保存在回收站
	 */
	 
	var back = {};	
	
	cbInterface.getTree().then(function(r){
		back = getListFromTree(r);
	});
	
	//////////////////////////////////////////////////////////////
	
	$scope.$on('bookmarkTree.change',function(e,data){
		
		var event = data.splice(0,1)[0];
		if(event === 'onRemoved'){ 
			var id = data.splice(0,1)[0];
			var bookmark = back[id];
			bookmark && rmBookmarkManager.set(bookmark);	
		}else{
			cbInterface.getTree().then(function(r){
				back = getListFromTree(r);
			});				
		}
		
		
	});
	
	
	//////////////////////////////////////////////////////////////
	
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
		var list = list || {};
		var item;
		
		for(var i in tree){
			item = tree[i];
			
			if( isTree(item) ){
				getListFromTree(item, list);
			}else if(typeof item === 'object'){
				list[item.id] = item;
			}	
		}
		
		return list;
	}		
	
	
}]);