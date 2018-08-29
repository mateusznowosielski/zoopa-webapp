'use strict';

/**
 * @ngdoc function
 * @name businessWebApp.controller:CompanyHoursCtrl
 * @description
 * # CompanyHoursCtrl
 * Controller of the businessWebApp
 */
angular.module('businessWebApp')
  .controller('CompanyHoursCtrl', ['$scope', '$rootScope', '$timeout', 'BusinessService', 'ErrorService',
  				                function ($scope,   $rootScope,   $timeout,   BusinessService,   ErrorService) {


    $scope.hours = null;
    $scope.is_open = null;

    function init() {

		$scope.hours = $rootScope.business.hours && $rootScope.business.hours.length ? deserializeHours($rootScope.business.hours) : [{}];
		$scope.is_open = $rootScope.business.is_open;
    }

    init();

 	function resetValidation() {
      
        $scope.hoursForm.$setPristine();
        $scope.hoursForm.$setUntouched();
    }

    $timeout(resetValidation);

    $scope.isInvalid = function(name, validation) {

    	return ($scope.hoursForm.$submitted || $scope.hoursForm[name].$touched) && $scope.hoursForm[name].$error[validation];
    }

    $scope.hoursList = buildHours();
    $scope.weekDays = [{id: 1, name: 'Monday'},
                       {id: 2, name: 'Tuesday'},
                       {id: 3, name: 'Wednesday'},
                       {id: 4, name: 'Thursday'},
                       {id: 5, name: 'Friday'},
                       {id: 6, name: 'Saturday'},
                       {id: 7, name: 'Sunday'}];

    $scope.weekDaysKeys = _.zipObject(_.pluck($scope.weekDays, 'id'), _.pluck($scope.weekDays, 'name'));

  	function buildHours() {

  		var hours = [];

  		for(var h = 0; h < 24; h++) {
  			for(var m = 0; m < 60; m += 30) {
  				var H = h === 0 ? 12 : h % 12;
  				var apm = h < 12 ? 'am' : 'pm';
  				hours.push((H < 10 ? "0" + H.toString() : H.toString()) + ":" + (m === 0 ? "00" : m.toString()) + " " + apm);
  			}
  		}

  		return hours;
  	}

  	function serializeHourFormat(hour) {

  		if(hour === "12:00 am") {
  			return "00:00";
  		}

		var arr = hour.split(' ');

		if(arr[1] === 'am') {
			return arr[0];
		}

		var arr2 = arr[0].split(':');

		var h = parseInt(arr2[0]) + 12;

		return h < 10 ? "0" + h.toString() + ':' + arr2[1] : h.toString() + ':' + arr2[1];
  	}

  	function deserializeHourFormat(hour) {

  		var arr = hour.split(':');

  		var h = parseInt(arr[0]);

  		if(h === 0) {
  			return "12:" + arr[1] + " am";
  		}

  		return h > 12 ? ((h - 12) < 10 ? "0" + (h - 12) + ":" + arr[1] + " pm" : (h - 12) + ":" + arr[1] + " pm") : (arr[0] + ":" + arr[1] + " am");
  	}

  	function serializeHours(hours) {

  		var serializedHours = [];

  		angular.forEach(hours, function(hour) {

  			var serializedHour = {day: hour.day,
								  open_time:serializeHourFormat(hour.open_time),
								  close_time:serializeHourFormat(hour.close_time)};

  			serializedHours.push(serializedHour);
  		});

  		return serializedHours;
  	}

  	function deserializeHours(hours) {

  		var deserializedHours = [];

  		angular.forEach(hours, function(hour) {

  			var deserializedHour = {day: hour.day,
				    open_time:deserializeHourFormat(hour.open_time),
				    close_time:deserializeHourFormat(hour.close_time)};

  			deserializedHours.push(deserializedHour);
  		});

  		return deserializedHours;
  	}

    $scope.addDayRow = function(dayRow) {

      var index = _.indexOf($scope.hours, dayRow);
      $scope.hours.splice(index + 1, 0, {});

      $timeout(resetValidation);
    }

    $scope.removeDayRow = function(dayRow) {

      _.remove($scope.hours, dayRow);

      $timeout(resetValidation);
    }

    $scope.saveOpeningHours = function() {
      
      $scope.hoursForm.$setSubmitted();

      $timeout(function() {

        if($scope.hoursForm.$valid) {

          //var business = _.cloneDeep($rootScope.business);
          var business = {};
          business.is_open = $scope.is_open;
          business.hours = serializeHours($scope.hours);

          BusinessService.editBusiness(business).then(
            function(response) {
              $rootScope.$emit('showAlert', 'success', 'Company opening hours were updated successfully.');

              $rootScope.business.hours = business.hours;
              $rootScope.business.is_open = business.is_open;

              init();
              $timeout(resetValidation);
            },
            function(error) {
              ErrorService.showMessage(error);
            }
          );
        }
      });
    }
    
}]);