angular.module('businessWebApp')
    .directive("focusInput", function() {
        return {
            link: function(scope, element, attributes) {
                 
                element.bind('click', function(event) {
                    var input = element.find('input');
                    if(input) {
                        input.focus();
                    }    
                });
            }
        };
    })
    .directive('toggle', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
              if (attrs.toggle=="tooltip"){
                $(element).tooltip();
              }
              if (attrs.toggle=="popover"){
                $(element).popover();
              }
            }
        };
    });