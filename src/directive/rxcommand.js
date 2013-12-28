angular.module('rxprop')
    .directive('rxCommand', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            priority: 200,
            terminal: true,
            scope: false,
            link: function postLink(scope, element, attrs) {

                element.attr("ng-click", attrs.rxCommand + ".execute(" + (attrs.rxParameter || "") + ")");
                element.attr("ng-disabled", "!" + attrs.rxCommand + ".canExecute()");
                element.removeAttr("rx-command");
                element.removeAttr("rx-parameter");

                var linkfn = $compile(element)
                linkfn(scope)
            }

        };
    }]);
