angular.module('businessWebApp')
.directive('routingNumber', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            var isEmpty = function (value) {
               return angular.isUndefined(value) || value === "" || value === null;
            }

            var routingNumberValidator = function(value) {
              
              var pattern = /^((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})$/;

              if (!isEmpty(value) && !pattern.test(value)) {
                ctrl.$setValidity('routingNumber', false);
                return value;
              } else {
                ctrl.$setValidity('routingNumber', true);
                return value;
              }
            };

            ctrl.$parsers.push(routingNumberValidator);
            ctrl.$formatters.push(routingNumberValidator);
        }
    };
});