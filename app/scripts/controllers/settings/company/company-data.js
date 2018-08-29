'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:CompanyDataCtrl
 * @description
 * # CompanyDataCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('CompanyDataCtrl', ['$scope', '$rootScope', '$timeout', 'BusinessService',
  				               function ($scope,   $rootScope,   $timeout,   BusinessService) {


    function init() {

    	$scope.businessEdited = _.cloneDeep($rootScope.business);
      $scope.businessEdited.tax_percent = Number($rootScope.business.tax_percent);
    }

    init();

 	  function resetValidation() {
      
        $scope.businessForm.$setPristine();
        $scope.businessForm.$setUntouched();
    }

    function getBusiness(businessObject) {

      return {
        name: businessObject.name,
        phone: businessObject.phone,
        website: businessObject.website,
        address1: businessObject.address1,
        address2: businessObject.address2,
        city: businessObject.city,
        zip: businessObject.zip,
        state: businessObject.state,
        country: businessObject.country,
        tax_percent: businessObject.tax_percent,
        latitude: businessObject.latitude,
        longitude: businessObject.longitude
      };
    }

    $timeout(resetValidation);

    $scope.isInvalid = function(name, validation) {

      if(validation === 'fcsaNumber') {
        console.log($scope.businessForm[name]);
      }

    	return ($scope.businessForm.$submitted || $scope.businessForm[name].$touched) && $scope.businessForm[name].$error[validation];
    }

    $scope.restoreBusiness = function() {

      resetValidation();
      init();
    }

  	$scope.saveBusiness = function() {

      $scope.businessForm.$setSubmitted();

      $timeout(function() {

        if($scope.businessForm.$valid) {

          var business = getBusiness($scope.businessEdited);

          BusinessService.geocodeLocation(business).then(
            function(response) {
                if(response.status === "OK") {
                  var location = response.results[0].geometry.location;

                  business.latitude = location.lat;
                  business.longitude = location.lng;

                  BusinessService.editBusiness(business).then(
                    function(response) {
                      $rootScope.$emit('showAlert', 'success', 'Company data were updated successfully.');

                      $rootScope.business.name = business.name;
                      $rootScope.business.phone = business.phone;
                      $rootScope.business.website = business.website;
                      $rootScope.business.address1 = business.address1;
                      $rootScope.business.address2 = business.address2;
                      $rootScope.business.city = business.city;
                      $rootScope.business.zip = business.zip;
                      $rootScope.business.state = business.state;
                      $rootScope.business.country = business.country;
                      $rootScope.business.tax_percent = business.tax_percent;
                      $rootScope.business.latitude = business.latitude;
                      $rootScope.business.longitude = business.longitude;

                      resetValidation();
                      init();
                    },
                    function(error) {
                      var message = error.data.error_description ? error.data.error_description : error.data.message;
                      $rootScope.$emit('showAlert', 'error', message);
                    }
                  );
                }
                else {
                  $rootScope.$emit('showAlert', 'error', "Cannot evaluate the address. Please correct the address.");
                }
            },
            function(error) {
              $rootScope.$emit('showAlert', 'error', "Can't connect to Google Maps API service. Please try again later.");
            }
          );

        }
      });
    }

}]);