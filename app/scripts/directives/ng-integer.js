angular.module('businessWebApp')
.directive('ngInteger', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            var isEmpty = function (value) {
               return angular.isUndefined(value) || value === "" || value === null || isNaN(value);
            }

            var integerValidator = function(value) {
              if (!isEmpty(value) && value % 1 != 0) {
                ctrl.$setValidity('ngInteger', false);
                return value;
              } else {
                ctrl.$setValidity('ngInteger', true);
                return value;
              }
            };

            ctrl.$parsers.push(integerValidator);
            ctrl.$formatters.push(integerValidator);
        }
    };
});