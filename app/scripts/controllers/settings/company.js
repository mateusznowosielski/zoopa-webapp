'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:CompanyCtrl
 * @description
 * # CompanyCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('CompanyCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'BusinessService',
  				           function ($scope,   $rootScope,   $state,   $timeout,   BusinessService) {

    $scope.state = $state;
    $scope.companyAccountFilled = true;
    $scope.companyDataFilled = false;
    $scope.openingHoursFilled = false;
    $scope.billingDataFilled = false;

    $rootScope.$watch('business', function(business) {

    	$scope.companyDataFilled = 	business.address1 &&
              						    		business.city &&
              						    		business.country &&
              						    		business.email &&
              						    		business.latitude &&
              						    		business.longitude &&
              						    		business.name &&
              						    		business.phone &&
              						    		business.state &&
              						    		business.website &&
              						    		business.zip;

		$scope.openingHoursFilled = business.hours.length > 0;
    }, true);

    $rootScope.$watch('accounts.length', function(accountsLength) {

    	$scope.billingDataFilled = accountsLength > 0;
    });

  }]);
