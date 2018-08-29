'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:AccountCreationCtrl
 * @description
 * # AccountCreationCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('AccountCreationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$modal', 'usSpinnerService', 'BusinessService', 'ErrorService',
  				   			 function ($scope,   $rootScope,   $state,   $stateParams,   $timeout,   $modal,   usSpinnerService,   BusinessService,   ErrorService) {

 	$scope.username = $stateParams.email || null;
 	$scope.password1 = null;
 	$scope.password2 = null;
 	$scope.agreementId = $stateParams.agreement || null;

 	$scope.creating = false;
 	$scope.success = false;
 	$scope.error = false;
 	$scope.errorData = null;
 	$scope.errorDescription = null;

 	console.log('stateParams', $stateParams);

 	$timeout(function() {
 		usSpinnerService.spin('login-spinner');
 		resetValidation();
 	});


 	function resetValidation() {
        $scope.$$childTail.createAccountForm.$setPristine();
        $scope.$$childTail.createAccountForm.$setUntouched();
        $scope.errorDescription = null;
 		$scope.errorData = null;
    }

    $scope.isInvalid = function(name, validation) {

    	return ($scope.$$childTail.createAccountForm.$submitted || $scope.$$childTail.createAccountForm[name].$touched) && $scope.$$childTail.createAccountForm[name].$error[validation];
    }

 	$scope.createAccount = function(username, password, agreementId) {

 		$scope.errorDescription = null;
 		$scope.errorData = null;
        $scope.$$childTail.createAccountForm.$setSubmitted();

        $timeout(function() {

	        if($scope.$$childTail.createAccountForm.$valid) {

		 		$scope.creating = true;
		 		$scope.success = false;
		 		$scope.error = false;

		 		BusinessService.createAccount(username, password, agreementId).then(
		 			function(response) {
		 				
		 				$scope.username = username;
		 				$scope.creating = false;
				 		$scope.error = false;
				 		$scope.success = true;
		 			},
		 			function(error) {

		 				$scope.creating = false;
		 				$scope.success = false;
		 				$scope.error = true;
		 				$scope.errorData = error;
		 				$scope.errorDescription = ErrorService.getMessage(error);
		 			}
		 		);
		 	}
		});
 	}

  }]);
