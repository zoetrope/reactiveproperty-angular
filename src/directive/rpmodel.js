angular.module('rxprop')
    .directive('rpModel', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            priority: 200,
            terminal: true,
            scope: false,
            link: function postLink(scope, element, attrs) {
                element.attr("ng-model", attrs.rpModel + ".value");
                element.removeAttr("rp-model");

                var linkfn = $compile(element)
                linkfn(scope)
            }
        };
    }]);
