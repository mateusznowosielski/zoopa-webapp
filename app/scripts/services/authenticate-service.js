
'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:AuthenticateService
 * @description
 * # AuthenticateService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('AuthenticateService', ['$http', '$q', 'transformRequestAsFormPost', 'localStorageService', 'AppService',
                          function ($http,   $q,   transformRequestAsFormPost,   localStorageService,   AppService) {

    var access_token = null;
    var expires_in = null;
    var token_type = null;

    function clearAccessToken() {

      if(localStorageService.isSupported) {
        return localStorageService.remove("access_token");
      }
      else {
        access_token = null;
      }
    }

    function clearTokens() {

      clearAccessToken();

      if(localStorageService.isSupported) {
        return localStorageService.remove("refresh_token");
      }
    }

    function getAccessToken() {

      if(localStorageService.isSupported) {
        return localStorageService.get("access_token") || access_token;
      }
      
      return access_token;
    }

    function getRefreshToken() {

      if(localStorageService.isSupported) {
        return localStorageService.get("refresh_token");
      }

      return null;
    }

    function setAccessToken(accessToken, refreshToken, rememberMe) {

      if(localStorageService.isSupported) {
        localStorageService.set("access_token", accessToken);
        if(rememberMe) {
          localStorageService.set("refresh_token", refreshToken);
        }
      }
      else {
        access_token = value;
      }
    }

    function getAnonymousAccessToken() {

      var deferred = $q.defer();

      $http({
        url: AppService.host + "/" + AppService.services.access_token,
        method: 'POST',
        transformRequest: transformRequestAsFormPost,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
            grant_type: "client_credentials",
            client_id: "frontend_app",
            client_secret: "lASYG6VUw9qbP7PHZzYF5Ye24TATn8nxO16yKcW"
        }
      }).then(
        function(response){
          console.log('getAnonymousAccessToken', response);
          deferred.resolve(response.data);
        },
        function(error){
          deferred.reject(error);
        }
      );

      return deferred.promise;
    }

    return {

      getAccessToken: getAccessToken,
      getRefreshToken: getRefreshToken,
      clearAccessToken: clearAccessToken,
      clearTokens: clearTokens,
      getAnonymousAccessToken: getAnonymousAccessToken,

      /**
       * GET issues
       * @param  {object} data
       * @return {object}
       */
      authenticate: function(username, password, rememberMe) {

        var deferred = $q.defer();

        $http({
          url: AppService.host + "/" + AppService.services.access_token,
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
              grant_type: "password",
              client_id: "frontend_app",
              client_secret: "lASYG6VUw9qbP7PHZzYF5Ye24TATn8nxO16yKcW",
              username: username,
              password: password
          }
        }).then(
          function(response){
            setAccessToken(response.data.access_token, response.data.refresh_token, rememberMe);
            deferred.resolve(response.data);
          },
          function(error){
            deferred.reject(error);
          }
        );

        return deferred.promise;
      },
      refreshAccessToken: function() {

        var deferred = $q.defer();

        $http({
          url: AppService.host + "/" + AppService.services.access_token,
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: {
              grant_type: "refresh_token",
              client_id: "frontend_app",
              client_secret: "lASYG6VUw9qbP7PHZzYF5Ye24TATn8nxO16yKcW",
              refresh_token: getRefreshToken()
          }
        }).then(
          function(response){
            console.log('refreshAccessToken', response);
            setAccessToken(response.data.access_token, response.data.refresh_token, true);
            deferred.resolve(response.data);
          },
          function(error){
            deferred.reject(error);
          }
        );

        return deferred.promise;
      },
      forgotPassword: function(email) {

        var deferred = $q.defer();

        getAnonymousAccessToken().then(
          function(authResponse) {
            $http({
              url: AppService.host + "/" + AppService.services.business + "/remind",
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Authorization: 'Bearer ' + authResponse.access_token
              },
              data: $.param(
                {
                  email: email
                }
              )
            }).then(
              function(response){
                console.log('remind password success', response.data);
                deferred.resolve(response.data);
                //return response.data;
              },
              function(error){
                console.log('remind password error', error);
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
      }

    };

  }]);
