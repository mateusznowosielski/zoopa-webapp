
'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:HTTPInterceptor
 * @description
 * # HTTPInterceptor
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('HttpInterceptor', ['$q', '$injector',
                      function ($q,   $injector) {

  return {
   //  // optional method
   //  request: function(requestData) {
   //    // do something on success
   //    return requestData;
   //  },

   //  // optional method
   // requestError: function(requestErrorData) {
   //    // do something on error
   //    return requestErrorData;
   //  },

   //  // optional method
   //  response: function(responseData) {
   //    // do something on success
   //    return responseData;
   //  },

    // optional method
   responseError: function(responseErrorData) {
      // do something on error
      //console.log('interceptor', responseErrorData);

      if(responseErrorData.status === 401) {
        //$injector.get('$state').go('login');
      }

      return $q.reject(responseErrorData);
    }
  };

 }]);