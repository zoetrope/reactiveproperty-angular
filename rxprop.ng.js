
(function (root, undefined) {
    var rxprop = {};
    var ReactiveProperty = rxprop.ReactiveProperty = (function (_super) {
        Rx.Internals.inherits(ReactiveProperty, _super);

        function subscribe(observer) {
            return this.observable.subscribe(observer);
        }

        function ReactiveProperty(scope, initValue, source) {
            _super.call(this, subscribe);

            this.scope = scope;
            this.another_trigger = new Rx.Subject();

            var self = this;

            if (!source) {
                source = Rx.Observable.never();
            }

            if (initValue) {
                this.value = initValue;
            }

            var merge = source.merge(this.another_trigger);
            this.observable = merge.distinctUntilChanged();
            merge.subscribe(
                function (val) {
                    self.value = val;
                    if (!self.scope.$$phase) {
                        self.scope.$apply();
                    }
                }
            );

            scope.$watch(
                function () {
                    return self.value;
                },
                function (newVal, oldVal) {
                    self.another_trigger.onNext(newVal);
                });

        }

        Rx.Internals.addProperties(ReactiveProperty.prototype, Rx.Observer, {
            onCompleted: function () {
                this.another_trigger.onCompleted()
            },
            onError: function (exception) {
                this.another_trigger.onError(exception)
            },
            onNext: function (value) {
                this.another_trigger.onNext(value)
            }
        });

        return ReactiveProperty;
    }(Rx.Observable));

    var ReactiveCollection = rxprop.ReactiveCollection = (function () {

        function ReactiveCollection(scope, source) {
            this.scope = scope;

            this.values = []
            var self = this;

            if (source) {
                source.subscribe(
                    function (val) {
                        self.values.push(val)
                        if (!self.scope.$$phase) {
                            self.scope.$apply();
                        }
                    }
                );
            }
        }

        Rx.Internals.addProperties(ReactiveCollection.prototype, {
            clear: function () {
                this.values = [];
            }
        });

        return ReactiveCollection;
    }());


    var ReactiveCommand = rxprop.ReactiveCommand = (function (_super) {
        Rx.Internals.inherits(ReactiveCommand, _super);

        function subscribe(observer) {
            return this.subject.subscribe(observer);
        }

        function ReactiveCommand(scope, source) {
            _super.call(this, subscribe);

            this.subject = new Rx.Subject();
            this.isCanExecute = true;
            this.scope = scope;
            var self = this;

            if (source) {
                source.distinctUntilChanged()
                    .subscribe(function(b){
                        self.isCanExecute = b;
                        if (!self.scope.$$phase) {
                            self.scope.$apply();
                        }
                    })
            }
        }

        Rx.Internals.addProperties(ReactiveCommand.prototype, {

            execute: function (param) {
                this.subject.onNext(param);
                if (!this.scope.$$phase) {
                    this.scope.$apply();
                }
            },

            canExecute: function () {
                return this.isCanExecute;
            }
        });

        return ReactiveCommand;
    }(Rx.Observable));


    root.rxprop = rxprop;

    //TODO: node.js用とかAMD用のコードを書く

})(this);

(function (root) {
    if (root.Rx == null) {
        throw new Error("can't find RxJS.");
    }

    var Rx = root.Rx;

    Rx.Observable.prototype.toReactiveProperty = function ($scope) {
        var source = this;
        return new rxprop.ReactiveProperty($scope, undefined, source);
    };

    Rx.Observable.prototype.toReactiveCollection = function ($scope) {
        var source = this;
        return new rxprop.ReactiveCollection($scope, source);
    };

    Rx.Observable.prototype.toReactiveCommand = function ($scope) {
        var source = this;
        return new rxprop.ReactiveCommand($scope, source);
    };
})(this);

angular.module('rxprop', [])

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
