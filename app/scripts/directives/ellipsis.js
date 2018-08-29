'use strict';

angular.module('ellipsis', [])
  .directive('ellipsis', [function () {
    return {
        required: 'ngBindHtml',
        restrict: 'A',
        priority: 100,
        link: function ($scope, element, attrs, ctrl) {
            $scope.hasEllipsis = false;
            $scope.$watch(element.html(), function(value) {
               if (!$scope.hasEllipsis) {
                   // apply ellipsis only one
                   $scope.hasEllipsis = true;
                   element.ellipsis();
               }
            });
        }
    };
  }]);