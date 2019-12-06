angular.module('starter.controllers', ['ionic', 'ngCordova','ionic-datepicker'])

.controller('AppCtrl', function($scope,$rootScope,$filter,$state,$location,usersService,$ionicModal,$cordovaDialogs,$cordovaPush,$ionicSideMenuDelegate, categoryService,dashboardService, ionicMaterialInk) {

	
	
	//---------------------
	/*if($rootScope.userData=='' || typeof($rootScope.userData)=='undefined'){		
		usersService.userDetails()
		.then(function(response) {
			
			if(response.data.success){
				$rootScope.userData = response.data.data;				
			}
		});
	}*/
	//---------------------
	$scope.popularSearch = [{heading:'Popular Search',items:[{id:0,title:'Dal'},{id:0,title:'Rice'},{id:0,title:'Maggi'},{id:0,title:'Atta'},{id:0,title:'Desi Ghee'}]}];

	$scope.getSearchResult = function(keywords){
		$scope.searchCats = $filter('filter')($scope.searchDefaultCats, { title: keywords });
		if($scope.searchCats=='') $scope.searchCats = '';
	}
	$scope.resetSearch = function(keywords){ $scope.searchCats = '';	}
	$scope.searchProduct = function(cat_id,title){ $location.path("app/search/"+cat_id+"/"+title.replace("&amp;","and"));	}
	//---------------------


	$rootScope.accordionConfig = {
		debug: false, //For developing
		animDur: 300, //Animations duration minvalue is 0
		expandFirst: false, //Auto expand first item
		autoCollapse: true, //Auto collapse item flag
		watchInternalChanges: false, //watch internal attrs of the collection (false if not needed)
		headerClass: '', //Adding extra class for the headers
		beforeHeader: '', //Adding code or text before all the headers inner content
		afterHeader: '', //Adding code or text after all the headers inner content
		topContentClass: '', //Adding extra class for topContent
		beforeTopContent: '', //Adding code or text before all the topContent if present on item
		afterTopContent: '', //Adding code or text after all the topContent if present on item
		bottomContentClass: '', //Adding extra class for topContent
		beforeBottomContent: '', //Adding code or text before all the topContent if present on item
		afterBottomContent: '', //Adding code or text before all the topContent if present on item
		menuLink: '#/app/products' //Adding code or text before all the topContent if present on item
	};


	//$scope.searchProduct = function(){ $state.go('app.search'); }

	
	$scope.viewCart = function(){ $state.go('app.shopping-cart'); }

	$scope.toggleLeftSideMenu = function() { $ionicSideMenuDelegate.toggleLeft();  };

	$scope.logout = function() { 
			usersService.userLogout()
			.then(function(response) {
				if(response.data.success){
					$rootScope.userData = '';
					$location.path('app/dashboard');
				}
			}, function(error) {
				$rootScope.tostMsg(error);
				$location.path('app/iniscreen'); 
			});
	};

	$ionicModal.fromTemplateUrl('js/products/products-search.html', { scope: $scope })
	.then(function(modal) { $scope.searchModal = modal; });
	$scope.searchClose = function() { $scope.searchModal.hide(); };
	$scope.searchShow = function() { 
		$scope.searchModal.show(); 
	};



  ionicMaterialInk.displayEffect();
})
