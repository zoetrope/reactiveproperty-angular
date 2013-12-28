angular.module('rxprop')
    .directive('rxModel', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            priority: 200,
            terminal: true,
            scope: false,
            link: function postLink(scope, element, attrs) {
                element.attr("ng-model", attrs.rxModel + ".value");
                element.removeAttr("rx-model");

                var linkfn = $compile(element)
                linkfn(scope)
            }
        };
    }]);
