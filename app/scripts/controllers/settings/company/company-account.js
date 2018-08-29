'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:CompanyAccountCtrl
 * @description
 * # CompanyAccountCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('CompanyAccountCtrl', ['$scope', '$rootScope', '$timeout', 'BusinessService', 'ErrorService',
  				                  function ($scope,   $rootScope,   $timeout,   BusinessService,   ErrorService) {

    $scope.email = null;
    $scope.password1 = null;
    $scope.password2 = null;

    function init() {

    	$scope.email = $rootScope.business.email;
    	$scope.password1 = $rootScope.business.password;
    	$scope.password2 = $rootScope.business.password;

    	//console.log($rootScope.business);
    }

    init();

 	  function resetValidation() {
      
        $scope.editAccountForm.$setPristine();
        $scope.editAccountForm.$setUntouched();
    }

    $timeout(resetValidation);

    $scope.isInvalid = function(name, validation) {

    	return ($scope.editAccountForm.$submitted || $scope.editAccountForm[name].$touched) && $scope.editAccountForm[name].$error[validation];
    }

  	$scope.saveAccount = function() {

      $scope.editAccountForm.$setSubmitted();

      $timeout(function() {

        if($scope.editAccountForm.$valid) {

          var business = {
            email: $scope.email,
            password: $scope.password1
          };

          BusinessService.editBusiness(business).then(
            function(response) {
              $rootScope.$emit('showAlert', 'success', 'Password has been updated successfully.');

              $rootScope.business.email = business.email;

              resetValidation();
              init();
            },
            function(error) {
              ErrorService.showMessage(error);
            }
          );
        }
      });
    }

}]);