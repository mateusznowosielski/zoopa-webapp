'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:ForgotPasswordCtrl
 * @description
 * # ForgotPasswordCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'AuthenticateService', 'ErrorService',
  				   			function ($scope,   $rootScope,   $state,   $timeout,   AuthenticateService,   ErrorService) {
    
 	//$scope.username = 'peter.bochniak@keyboarders.com';
 	//$scope.username = 'manualride@gmail.com';
 	//$scope.password = 'admin123';

 	$scope.loading = false;
 	$scope.error = false;
 	$scope.errorDescription = null;

	function resetValidation() {
        $scope.forgotPasswordForm.$setPristine();
        $scope.forgotPasswordForm.$setUntouched();
        $scope.errorDescription = null;
 		$scope.errorData = null;
    }

    $scope.isInvalid = function(name, validation) {

    	return ($scope.forgotPasswordForm.$submitted || $scope.forgotPasswordForm[name].$touched) && $scope.forgotPasswordForm[name].$error[validation];
    }

 	
 	$scope.forgotPassword = function(username) {

 		$scope.errorDescription = null;
        $scope.forgotPasswordForm.$setSubmitted();

        $timeout(function() {

	        if($scope.forgotPasswordForm.$valid) {

		 		$scope.loading = true;
		 		$scope.success = false;
		 		$scope.error = false;

		 		AuthenticateService.forgotPassword(username).then(
		 			function(response) {
		 				
		 				$scope.loading = false;
				 		$scope.error = false;

				 		$rootScope.$emit('showAlert', 'success', 'Please check your email address to reset the password.');
		 			},
		 			function(error) {

		 				$scope.loading = false;
 						$scope.error = true;
 						$scope.errorDescription = ErrorService.getMessage(error);
		 			}
		 		);
		 	}
		});
 	}

  }]);
