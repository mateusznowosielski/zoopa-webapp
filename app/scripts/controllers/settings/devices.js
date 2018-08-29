'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:DevicesCtrl
 * @description
 * # DevicesCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('DevicesCtrl', ['$scope', '$rootScope', '$timeout', 'DevicesService', 'ErrorService',
  				     function ($scope,   $rootScope,   $timeout,   DevicesService,   ErrorService) {
    
    $scope.devices = null;
    $scope.newDevice = null;
    $scope.editedDevice = null;
    $scope.devices = null;

    function resetNewFormValidation() {

        $scope.newDeviceForm.$setPristine();
        $scope.newDeviceForm.$setUntouched();
    }

    function resetEditedFormValidation() {

        $scope.$$childHead.editedDeviceForm.$setPristine();
        $scope.$$childHead.editedDeviceForm.$setUntouched();
    }

    $timeout(resetNewFormValidation);

    $scope.isNewInvalid = function(name, validation) {

        return ($scope.newDeviceForm.$submitted || $scope.newDeviceForm[name].$touched) &&
                $scope.newDeviceForm[name].$error[validation];
    }

    $scope.isEditedInvalid = function(name, validation) {

        if(!$scope.editedDevice) {
            return;
        }

        return ($scope.$$childHead.editedDeviceForm.$submitted || $scope.$$childHead.editedDeviceForm[name].$touched) &&
                $scope.$$childHead.editedDeviceForm[name].$error[validation];
    }

    function getDevices() {

      DevicesService.getDevices().then(
        function(data) {
          //console.log(data);
          $scope.devices = data;
        },
        function(error) {
          ErrorService.showMessage(error);
        }
      );
    }

    getDevices();

    $scope.createDevice = function(device) {

        $scope.newDeviceForm.$setSubmitted();

        $timeout(function() {

            if($scope.newDeviceForm.$valid) {

                DevicesService.createDevice(device).then(
                    function(data) {

                        getDevices();

                        $scope.newDevice = null;
                        $timeout(resetNewFormValidation);

                        $rootScope.$emit('showAlert', 'success', 'Device was added successfully.');
                    },
                    function(error) {
                        ErrorService.showMessage(error);
                    }
                );
            }
        });

    }


    $scope.editDevice = function(id) {

    	var device = _.find($scope.devices, {id:id});
        device.editing = true;
    	$scope.editedDevice = angular.copy(device);

        $timeout(resetEditedFormValidation);
    }

    $scope.cancelEditingDevice = function(id) {

    	var device = _.find($scope.devices, {id:id});
        resetEditedFormValidation();
    	device.editing = false;
        $scope.editedDevice = null;
    }

    $scope.saveDevice = function(id, device) {

        $scope.$$childHead.editedDeviceForm.$setSubmitted();

        $timeout(function() {

            if($scope.$$childTail.editedDeviceForm.$valid) {

                DevicesService.saveDevice(id, device.description).then(
                    function(data) {

                        getDevices();
                        resetEditedFormValidation();

                        $scope.editedDevice = null;

                        $rootScope.$emit('showAlert', 'success', 'Device was saved successfully.');
                    },
                    function(error) {
                        ErrorService.showMessage(error);
                    }
                );
            }
        });
    }

    $scope.deleteDevice = function(id) {

        DevicesService.deleteDevice(id).then(
            function(data) {
                getDevices();
                $rootScope.$emit('showAlert', 'success', 'Device was deleted successfully.');
            },
            function(error) {
                ErrorService.showMessage(error);
            }
        );
    }

  }]);
