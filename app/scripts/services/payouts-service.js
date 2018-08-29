'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:DevicesService
 * @description
 * # DevicesService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('PayoutsService', ['$http', '$q', 'transformRequestAsFormPost', 'AppService', 'AuthenticateService',
                     function ($http,   $q,   transformRequestAsFormPost,   AppService,   AuthenticateService) {

    return {

      /**
       * GET issues
       * @param  {object} data
       * @return {object}
       */
      getPayouts: function() {

        var deferred = $q.defer();

        $http({
          //url: AppService.host + "/" + AppService.services.offers_list + '?access_token=' + AuthenticateService.getAccessToken(),
          url: AppService.host + "/" + AppService.services.payouts,
          headers: {
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          method: 'GET'
        }).then(
          function(response){
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('accounts_list error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },

      getPayoutLines: function(payoutId) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.payouts + "/" + payoutId + "/lines",
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          }
        }).then(
          function(response){
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('create device error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      }

    };

  }]);
