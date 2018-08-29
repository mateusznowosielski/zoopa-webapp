'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.services:DevicesService
 * @description
 * # DevicesService
 * Services of the businessWebApp
 */

angular.module('businessWebApp')
  .factory('ErrorService', ['$rootScope',
                   function ($rootScope) {

    function getMessageValue(error) {

      if(error.data) {

        return error.data.error_description || error.data.message || error.data.error;
      }
      
      return "Unknown error occured";

    }

    function processMessage(error, dontShowMessage) {

      var message = getMessageValue(error);

      if(!dontShowMessage) {
        $rootScope.$emit('showAlert', 'error', message);
      }

      return message;
    }

    return {

      /**
       * GET issues
       * @param  {object} data
       * @return {object}
       */
      getMessage: function(error) {
        return processMessage(error, true);
      },

      showMessage: function(error) {
        processMessage(error);
      }

    };

  }]);
