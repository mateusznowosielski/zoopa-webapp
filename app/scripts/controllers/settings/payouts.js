'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:CompanyAccountCtrl
 * @description
 * # CompanyAccountCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('PayoutsCtrl', ['$scope', '$rootScope', '$timeout', 'PayoutsService', 'ErrorService',
  				           function ($scope,   $rootScope,   $timeout,   PayoutsService,   ErrorService) {

  $scope.gridApi = null;
  $scope.moment = moment;
  $scope.payouts = null;
  $scope.selectedPayout = null;

  function selectedRowHandler(event) {

    $scope.getPayoutLines(event.entity.payout_id);
  }

  // $scope.gridPayoutsListOptions = {
    
  //   columnDefs: [
  //     {field: 'payout_id', displayName: 'Id'},
  //     {field: 'status', displayName: 'Status'},
  //     {field: 'fee_percent', displayName: 'Fee'},
  //     {field: 'begin_at', displayName: 'Start'},
  //     {field: 'end_at', displayName: 'End'},
  //     {field: 'transactions_count', displayName: 'Count'},
  //     {field: 'is_min_satisfied', displayName: 'Payable'},
  //     {field: 'total_amount', displayName: 'Total'},
  //     {field: 'total_fee_amount', displayName: 'Total Fee'},
  //     {field: 'total_final_amount', displayName: 'Total Final'},
  //     {field: 'money_transfer_id', displayName: 'Tranfer Id'}
  //   ],
  //   enableRowSelection: true,
  //   enableRowHeaderSelection: false,
  //   multiSelect: false,
  //   onRegisterApi: function( gridApi ) {
  //     $scope.gridApi = gridApi;
  //     $scope.gridApi.selection.on.rowSelectionChanged($scope, selectedRowHandler);
  //   }
  // };

  function getPayouts() {

    PayoutsService.getPayouts().then(
      function(data) {
        if(data && data.length) {
          // var newData = angular.copy(data);
          // angular.forEach(newData, function(payout) {
          //   payout.payout_id = Math.round(Math.random() * 100000);
          //   payout.status = "paid";
          // });
          // $scope.payouts = data.concat(newData);
          $scope.payouts = data;
          $scope.getPayoutLines($scope.payouts[0]);
        }
        else {
          $scope.payouts = [];
        }
      },
      function(error) {
        $scope.payouts = [];
        ErrorService.showMessage(error);
      }
    );
  }

  getPayouts();

  $scope.gridPayoutsLinesOptions = {
    columnDefs: [
      // {field: 'id', displayName: 'Id', width: '7%'},
      {field: 'transaction_id', displayName: 'Transaction Id', width: '11%'},
      {field: 'created_at', displayName: 'Date', width: '100'},
      {field: 'name', displayName: 'Name'},
      {field: 'offer_id', displayName: 'Offer Id', width: '7%'},
      {field: 'offer_name', displayName: 'Offer Name'},
      {field: 'transaction_amount', displayName: 'Amount', width: '9%'},
      {field: 'fee_amount', displayName: 'Fee Amount', width: '10%'},
      {field: 'final_amount', displayName: 'Final Amount', width: '11%', textAlign: 'right'}
    ]
  };

  function deserializePayoutLines(data) {

    var deserializedLines = [];

    angular.forEach(data, function(line) {
      var deserializedLine = {
        id: line.id,
        transaction_id: line.transaction_id,
        created_at: moment(line.created_at * 1000).format('DD MMM YYYY'),
        name: line.last_name + ", " + line.first_name,
        offer_id: line.offer_id,
        offer_name: line.offer_name,
        transaction_amount: line.transaction_amount,
        fee_amount: line.fee_amount,
        final_amount: line.final_amount
      };
      deserializedLines.push(deserializedLine);
    });

    return deserializedLines;
  }

  $scope.getPayoutLines = function(payout) {

    $scope.selectedPayout = payout;

    PayoutsService.getPayoutLines(payout.payout_id).then(
      function(data) {
        var payoutLines = deserializePayoutLines(data);
        // for(var i = 0; i < 3; i++) {
        //   var item = angular.copy(payoutLines[0]);
        //   item.id = Math.round(Math.random() * 100000);
        //   item.transaction_id = Math.round(Math.random() * 100000);
        //   payoutLines.push(item);
        // };
        $scope.gridPayoutsLinesOptions.data = payoutLines;
      },
      function(error) {
        $scope.gridPayoutsLinesOptions.data = [];
        ErrorService.showMessage(error);
      }
    );
  }

}]);