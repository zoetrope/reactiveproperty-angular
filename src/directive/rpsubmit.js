angular.module('rxprop')
    .directive('rpSubmit', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            priority: 200,
            terminal: true,
            scope: false,
            link: function postLink(scope, element, attrs) {

                element.attr("ng-submit", attrs.rpCommand + ".execute(" + (attrs.rpParameter || "") + ")");
                element.removeAttr("rp-submit");
                element.removeAttr("rp-parameter");

                var linkfn = $compile(element)
                linkfn(scope)
            }

        };
    }]);
