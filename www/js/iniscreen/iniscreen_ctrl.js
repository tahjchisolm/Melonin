angular.module('starter.controllers')
.controller('IniscreenCtrl', function($scope,$rootScope,$location,$ionicSideMenuDelegate,$ionicHistory) {
	'use strict';

	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

	$scope.loginButton = function(){ $location.path("app/inilogin"); }
	$scope.signupButton = function(){ $location.path("app/inisignup"); }
	$scope.skipButton = function(){ $location.path("app/select-location"); }
	

})

.controller('IniLocationCtrl', function($scope,$rootScope,$location,$cordovaGeolocation,$timeout,usersService,progressService,$ionicSideMenuDelegate,$ionicHistory) {
	'use strict';
	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu
	


	$scope.findLocation = function(){
		  var posOptions = {timeout: 10000, enableHighAccuracy: false};
		  $cordovaGeolocation
			.getCurrentPosition(posOptions)
			.then(function (position) {
			  var lat  = position.coords.latitude
			  var lng = position.coords.longitude
				$scope.getAddress({lat:lat,lng:lng});


			}, function(err) {
			  // error
		  });
	}

	//$scope.findLocation();

    $scope.setLocation = function(data){
		$scope.userLocation = data;
		
		var lng  = data.geometry.location.lng();
		var lat  = data.geometry.location.lat();
		$scope.userAddress  = $scope.userLocation.formatted_address;
		$timeout(function(){ $location.path("app/dashboard");  }, 1000);
		
	}
	

})


.controller('IniSignupCtrl', function($scope,$rootScope,$location,$ionicSideMenuDelegate,$ionicHistory) {
	'use strict';
	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

    $scope.regLocation = function(data){
		$scope.userLocation = data;
		
		var lng  = data.geometry.location.lng();
		var lat  = data.geometry.location.lat();
		var lnglat = {lng:lng,lat:lat};
	}
	$scope.cuntryData = [{country_id:'',name:'-- Select HBCU --'},{country_id:'1',name:'Howard University'},{country_id:'2',name:'Florda A&M University'},{country_id:'3',name:'Morehouse College/Spelman College/Clark Atlanta University'},{country_id:'4',name:'North Carolina A&T University'},{country_id:'5',name:'Tuskegee University'}];


	$scope.iniRegister = {firstname:'', lastname:'',telephone:'',postcode:'',country_id:'',email:'',password:'',confirm:'',zone_id:'1433',agree:'1'}; 
	
	$scope.userRegister = function(form){
		if(form.$valid) {			
			$location.path("app/dashboard");		
		}
	}


})

.controller('IniLoginCtrl', function($scope,$rootScope,$location,$ionicSideMenuDelegate,$ionicHistory) {
	'use strict';
	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu
	
	$scope.iniLogin = {email:'',password:''};	
	
	$scope.userLogin = function(form){
		if(form.$valid) {			
			if($scope.iniLogin.email=="sales@opensourcetechnologies.com" && $scope.iniLogin.password=="demo1234"){
				$location.path("app/dashboard");
			}
			else{
				$rootScope.tostMsg("Invalid Credential");
			}			
		}
	}

	//-----------------------------
	$scope.iniReset = {email:''};
	$scope.userResetPassword = function(form){
		if(form.$valid) {
			$scope.iniReset = {email:''};
			$rootScope.showAlert('New password has been sent to your registered email address.');
		}
	}


});
