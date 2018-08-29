
'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:DevicesService
 * @description
 * # DevicesService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('BillingService', ['$http', '$q', 'transformRequestAsFormPost', 'AppService', 'AuthenticateService',
                     function ($http,   $q,   transformRequestAsFormPost,   AppService,   AuthenticateService) {

    return {

      /**
       * GET issues
       * @param  {object} data
       * @return {object}
       */
      getAccounts: function() {

        var deferred = $q.defer();

        $http({
          //url: AppService.host + "/" + AppService.services.offers_list + '?access_token=' + AuthenticateService.getAccessToken(),
          url: AppService.host + "/" + AppService.services.billing,
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

      createAccount: function(account) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.billing + "/create",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          data: $.param(account)
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
      },

      saveAccount: function(id, tax_id, label) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.billing + "/" + id + "/update",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          data: {tax_id: tax_id, label: label}
        }).then(
          function(response){
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },

      deleteAccount: function(id) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.billing + "/" + id + "/destroy",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          }
        }).then(
          function(response){
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },

      makeDefaultAccount: function(id) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.billing + "/" + id + "/make-default",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          }
        }).then(
          function(response){
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      }

    };

  }]);
