
'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:TransactionsService
 * @description
 * # TransactionsService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('TransactionsService', ['$http',
                    	    function ($http) {

    return {

      /**
       * GET issues
       * @param  {object} data
       * @return {object}
       */
      getTransactions: function() {
        return $http({
          url: 'stubs/transactions.json',
          method: 'GET'
        }).then(
          function(response){
            return response.data;
          },
          function(error){
            return error;
          }
        );
      }

    };

  }]);
