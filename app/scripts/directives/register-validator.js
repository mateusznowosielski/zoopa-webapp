/* global angular, _ */
'use strict';

angular.module('businessWebApp')
  .directive('registerValidator', function () {
    return {
        scope: {
            registerValidator: "="
        },
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {

            scope.registerValidator.$addControl(ctrl);

            elem.on('$destroy', function() {
                scope.registerValidator.$removeControl(ctrl);
            });
        }
    }

  });