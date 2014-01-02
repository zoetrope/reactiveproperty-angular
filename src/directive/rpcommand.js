angular.module('rxprop')
    .directive('rpCommand', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            priority: 200,
            terminal: true,
            scope: false,
            link: function postLink(scope, element, attrs) {

                element.attr("ng-click", attrs.rpCommand + ".execute(" + (attrs.rpParameter || "") + ")");
                element.attr("ng-disabled", "!" + attrs.rxCommand + ".canExecute()");
                element.removeAttr("rp-command");
                element.removeAttr("rp-parameter");

                var linkfn = $compile(element)
                linkfn(scope)
            }

        };
    }]);
