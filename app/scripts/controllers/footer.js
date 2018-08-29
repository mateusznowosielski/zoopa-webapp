/* global angular */
'use strict';

angular.module('businessWebApp')
  .controller('FooterCtrl', ['$scope', '$rootScope',
                    function ($scope,   $rootScope) {

  $rootScope.openTermsConditions = function() {

    var modalInstance = $modal.open({
      templateUrl: 'views/account/terms-conditions.html',
      controller: 'TermsConditionsCtrl',
      size: 'lg'
    });

    modalInstance.result.then(
      function (selectedItem) {
      },
      function () {
      }
    );
  }

  $rootScope.openPrivacyPolicy = function() {

    var modalInstance = $modal.open({
      templateUrl: 'views/account/privacy-policy.html',
      controller: 'PrivacyPolicyCtrl',
      size: 'lg'
    });

    modalInstance.result.then(
      function (selectedItem) {
      },
      function () {
      }
    );
  }

}]);
