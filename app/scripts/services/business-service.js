
'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:BusinessService
 * @description
 * # BusinessService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('BusinessService', ['$http', '$q', 'transformRequestAsFormPost', 'AppService', 'AuthenticateService',
                      function ($http,   $q,   transformRequestAsFormPost,   AppService,   AuthenticateService) {

    return {

      /**
       * GET issues
       * @param  {object} data
       * @return {object}
       */
      getBusiness: function() {

        var deferred = $q.defer();

        $http({
          url: AppService.host + "/" + AppService.services.business,
          headers: {
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          method: 'GET'
        }).then(
          function(response){
            console.log('business', response.data);
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('business error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },
      editBusiness: function(business) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.business + "/update",
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          data: $.param(business)
        }).then(
          function(response){
            console.log('update business success', response.data);
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('update business error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },
      createBusiness: function(business) {

        var deferred = $q.defer();
        
        $http({
          url: AppService.host + "/" + AppService.services.business + "/create",
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          data: $.param(
            {
            }
          )
        }).then(
          function(response){
            console.log('create business success', response.data);
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('create business error', error);
            //deferred.reject(error);
            deferred.resolve({})
            //return error;
          }
        );

        return deferred.promise;
      },
      createAccount: function(username, password, agreementId) {

        var deferred = $q.defer();

        AuthenticateService.getAnonymousAccessToken().then(
          function(authResponse) {
            $http({
              url: AppService.host + "/" + AppService.services.business + "/create",
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Authorization: 'Bearer ' + authResponse.access_token
              },
              data: $.param(
                {
                  email: username,
                  password: password,
                  agreement_token: agreementId
                }
              )
            }).then(
              function(response){
                console.log('create account success', response.data);
                deferred.resolve(response.data);
                //return response.data;
              },
              function(error){
                console.log('create account error', error);
                deferred.reject(error);
                //deferred.resolve({})
                //return error;
              }
            );
          },
          function(authError) {
            console.log('auth error', authError);
            deferred.reject(authError);
          }
        );
        
        return deferred.promise;
      },
      geocodeLocation: function(business) {

        var deferred = $q.defer();

        var formattedAddress = "";
        formattedAddress += business.address1 ? business.address1.replace(/\s/g, '+') : '';
        formattedAddress += business.address2 ? ',' + business.address2.replace(/\s/g, '+') : '';
        formattedAddress += business.city ? ',' + business.city.replace(/\s/g, '+') : '';
        formattedAddress += business.state ? ',' + business.state.replace(/\s/g, '+') : '';
        formattedAddress += business.zip ? ',' + business.zip.replace(/\s/g, '+') : '';
        formattedAddress += business.country ? ',' + business.country.replace(/\s/g, '+') : '';
        
        $http({
          url: AppService.map.api + AppService.map.service.geocode + "/json?address=" + formattedAddress + "&key=" + AppService.map.key,
          method: 'GET',
        }).then(
          function(response){
            deferred.resolve(response.data);
          },
          function(error){
            deferred.resolve(error);
          }
        );

        return deferred.promise;
      }

    };

  }]);