'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'usSpinnerService', 'AuthenticateService', 'BusinessService', 'BillingService', 'ErrorService',
  				   function ($scope,   $rootScope,   $state,   $timeout,   usSpinnerService,   AuthenticateService,   BusinessService,   BillingService,   ErrorService) {
    
 	//$scope.username = 'peter.bochniak@keyboarders.com';
 	//$scope.username = 'manualride@gmail.com';
 	//$scope.password = 'admin123';

 	$scope.loging = false;
 	$scope.error = false;
 	$scope.errorDescription = null;

 	$timeout(function() {
 		usSpinnerService.spin('login-spinner');
 	});

 	AuthenticateService.clearTokens();

 	var loadDetails = function() {

      return BusinessService.getBusiness()
        .then(function(businessResponse) {
          $rootScope.business = businessResponse;
          return BillingService.getAccounts();
        })
        .then(function(accountsData) {
          $rootScope.accounts = accountsData;
        });
    }

 	function getBusinessAndGrantUser() {

		loadDetails().then(
			function(response) {
				$scope.loging = false;
				$scope.error = false;
				$state.go('main.dashboard');
			},
			function(error) {
				$scope.loging = false;
				$scope.error = false;
				ErrorService.showMessage(error);
			});

 	}
 	
 	$scope.login = function(username, password, rememberMe) {

 		$scope.loging = true;
 		$scope.error = false;

 		AuthenticateService.authenticate(username, password, rememberMe).then(
 			function(response) {
				getBusinessAndGrantUser();
 			},
 			function(error) {
 				$scope.loging = false;
 				$scope.error = true;
 				$scope.errorDescription = ErrorService.getMessage(error);
 			}
 		);
 	}

 	$scope.goToCreateAccount = function() {

 		$state.go('accountCreation');
 	}

  }]);
