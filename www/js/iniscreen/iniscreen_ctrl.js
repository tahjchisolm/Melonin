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
	
	$scope.getAddress = function(attrs){
			progressService.showLoader();
			var geocoder = new google.maps.Geocoder();
			var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						$scope.userAddress = results[1].formatted_address;
						progressService.hideLoader();
						$timeout(function(){ $location.path("app/dashboard");  }, 1500);
					} else {
						$scope.userAddress = 'Location not found';
					}
				} else {
					$scope.userAddress = 'Geocoder failed due to: ' + status;
				}
			});
	}

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
		$scope.iniRegister.city  = $scope.userLocation.formatted_address;
	}
	$scope.cuntryData = [{country_id:'',name:'-- Select Country --'},{country_id:'99',name:'India'}];


	$scope.iniRegister = {firstname:'', lastname:'',telephone:'',postcode:'',country_id:'',city:'',address_1:'',email:'',password:'',confirm:'',zone_id:'1433',agree:'1'}; 
	
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
