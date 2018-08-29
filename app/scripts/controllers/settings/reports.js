'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('ReportsCtrl', ['$scope', 'TransactionsService',
  				           function ($scope,   TransactionsService) {

  	$scope.transactions  = null;
    $scope.filters = {};
  	$scope.filterOptions = {};

    $scope.filterOptions.transactionTypes = [{id:'unpaid', label:'Unpaid'},
                                   			 {id:'invoice1', label:'Invoice 1'},
                                   			 {id:'invoice2', label:'Invoice 2'},
                                   			 {id:'invoice3', label:'Invoice 3'},
                                   			 {id:'invoice4', label:'Invoice 4'},
                                   			 {id:'invoice5', label:'Invoice 5'},
                                   			 {id:'invoice6', label:'Invoice 6'},
                                   			 {id:'invoice7', label:'Invoice 7'},
                                   			 {id:'invoice8', label:'Invoice 8'},
                                   			 {id:'invoice9', label:'Invoice 9'},
                                   		     {id:'invoice10', label:'Invoice 10'},
                                   		     {id:'invoice10', label:'Invoice 11'},
                                   		     {id:'invoice10', label:'Invoice 12'},
                                   		     {id:'invoice10', label:'Invoice 13'},
                                   		     {id:'invoice10', label:'Invoice 14'},
                                   		     {id:'invoice10', label:'Invoice 15'}];

    $scope.filters.transactionTypes = [{id:'unpaid', label:'Unpaid'}];

    function getTransactions() {

      TransactionsService.getTransactions().then(
        function(data) {
          //console.log(data);
          $scope.transactions = data;
        },
        function(error) {
          // error
        }
      );
    }

    getTransactions();
  }]);
