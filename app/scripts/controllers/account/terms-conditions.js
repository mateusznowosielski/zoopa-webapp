'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:TermsConditionsCtrl
 * @description
 * # TermsConditionsCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('TermsConditionsCtrl', ['$scope', '$modalInstance',
  				   			 function ($scope,   $modalInstance) {

  	$scope.cancel = function() {
  		$modalInstance.dismiss();
  	}

}]);
