
var rpEventDirectives = {};
angular.forEach(
    'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
    function(name) {
        var directiveName = 'rp' + name.charAt(0).toUpperCase() + name.slice(1);
        rpEventDirectives[directiveName] = ['$parse', function($parse) {
            return {
                compile: function($element, attr) {
                    var bindValue = $parse(attr[directiveName] + ".value");
                    return function(scope, element, attr) {
                        element.on(name, function(event) {
                            scope.$apply(function() {
                                bindValue.assign(scope, {$event:event})
                            });
                        });
                    };
                }
            };
        }];
    }
);
angular.module('rxprop').directive(rpEventDirectives);
