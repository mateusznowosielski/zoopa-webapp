'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:OffersService
 * @description
 * # OffersService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('OffersService', ['$http', '$q', 'transformRequestAsFormPost', 'AppService', 'AuthenticateService',
                    function ($http,   $q,   transformRequestAsFormPost,   AppService,   AuthenticateService) {

    return {

      /**
       * GET issues
       * @param  {object} data
       * @return {object}
       */
      getOffers: function() {

        var deferred = $q.defer();

        $http({
          //url: AppService.host + "/" + AppService.services.offers_list + '?access_token=' + AuthenticateService.getAccessToken(),
          url: AppService.host + "/" + AppService.services.offers,
          headers: {
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          method: 'GET'
        }).then(
          function(response){
            console.log('offers_list', response.data);
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

      publishOffer: function(offerId) {
        
        var deferred = $q.defer(); 

        $http({
          url: AppService.host + "/" + AppService.services.offers + "/" + offerId + "/publish",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          }
        }).then(
          function(response){
            console.log('publish success', response);
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('publish error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },

      unpublishOffer: function(offerId) {

        var deferred = $q.defer();

        $http({
          url: AppService.host + "/" + AppService.services.offers + "/" + offerId + "/unpublish",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          }
        }).then(
          function(response){
            console.log('publish success', response);
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('publish error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },

      createOffer: function(offer) {

        var deferred = $q.defer();

        $http({
          url: AppService.host + "/" + AppService.services.offers + "/create",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          data: offer
        }).then(
          function(response){
            console.log('create offer success', response.data);
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('create offer error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },

      editOffer: function(offerId, offer) {

        var deferred = $q.defer();

        $http({
          url: AppService.host + "/" + AppService.services.offers + "/" + offerId + "/update",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          },
          data: offer
        }).then(
          function(response){
            console.log('edit offer success', response.data);
            deferred.resolve(response.data);
            //return response.data;
          },
          function(error){
            console.log('edit offer error', error);
            deferred.reject(error);
            //return error;
          }
        );

        return deferred.promise;
      },

      deleteOffer: function(offerId) {

        var deferred = $q.defer();

        $http({
          url: AppService.host + "/" + AppService.services.offers + "/" + offerId + "/destroy",
          method: 'POST',
          transformRequest: transformRequestAsFormPost,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + AuthenticateService.getAccessToken()
          }
        }).then(
          function(response){
            console.log('delete offer success', response.data);
            deferred.resolve(response.data);
          },
          function(error){
            console.log('delete offer error', error);
            deferred.reject(error);
          }
        );

        return deferred.promise;
      }



    };

  }]);
