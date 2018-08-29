'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the businessWebApp
 */

angular.module('businessWebApp')
  .controller('MainCtrl', ['$scope', '$state',
  				  function ($scope,   $state) {

  	$scope.state = $state;

  }]);
