/* global angular */
'use strict';

angular.module('businessWebApp')
  .controller('NotificationsCtrl', ['$scope', '$rootScope', '$timeout',
                           function ($scope,   $rootScope,   $timeout) {

    $scope.visible = false;
    $scope.type = null;
    $scope.title = null;
    $scope.message = null;

    /**
     * Opens a notification box with a proper title and message.
     * @param   {object}    event
     * @param   {string}    severity of notification: success | warning | error | info
     * @param   {string}    first line of notification
     * @param   {string}    second line of notification
     */
    $rootScope.$on('showAlert', function(event, type, title, message) {
       $scope.type = type;
       $scope.title = title;
       $scope.message = message;
       $scope.visible = true;

       $timeout($scope.closeNotification, 5000);
    });


    /**
     * Close notification box
     */
    $scope.closeNotification = function() {
      $scope.visible = false;
    };

  }]);
