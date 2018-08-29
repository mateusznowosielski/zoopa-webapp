
'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:DevicesService
 * @description
 * # DevicesService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('DevicesService', ['$http', '$q', 'transformRequestAsFormPost', 'AppService', 'AuthenticateService',
                     function ($http,   $q,   transformRequestAsFormPost,   AppService,   AuthenticateService) {

    return {

      /**
       * GET issues
       * @param  {object} data
       * @return {object}
       */
      getDevices: function() {

        var deferred = $q.defer();

        $http({
          //url: AppService.host + "/" + AppService.services.offers_list + '?access_token=' + AuthenticateService.getAccessToken(),
          url: AppService.host + "/" + AppService.services.devices,
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
            console.log('offers_list error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },

      createDevice: function(device) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.devices + "/create",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          data: device
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

      saveDevice: function(id, description) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.devices + "/" + id + "/update",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          data: {description: description}
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

      deleteDevice: function(id) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.devices + "/" + id + "/destroy",
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
