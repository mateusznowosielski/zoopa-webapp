'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:CompanyCreationCtrl
 * @description
 * # CompanyCreationCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('CompanyCreationCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'usSpinnerService', 'BusinessService', 'ErrorService',
  				   			 function ($scope,   $rootScope,   $state,   $timeout,   usSpinnerService,   BusinessService,   ErrorService) {

 	$scope.creating = false;
 	$scope.error = false;
 	$scope.errorDescription = null;

 	$timeout(function() {
 		usSpinnerService.spin('login-spinner');
 	});
 	

 	$scope.createCompany = function(business) {

 		$scope.creating = true;
 		$scope.error = false;

 		BusinessService.createBusiness(business).then(
 			function(response) {
 				
 				$scope.creating = false;
		 		$scope.error = false;

		 		$state.go('dashboard');
 			},
 			function(error) {

 				$scope.creating = false;
 				$scope.error = true;
 				ErrorService.showMessage(error);
 			}
 		);
 	}

 	$scope.goToLogin = function() {

 		$state.go('login');
 	}

  }]);
