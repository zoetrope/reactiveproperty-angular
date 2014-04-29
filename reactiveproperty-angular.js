/**
 * @license ReactiveProperty for AngularJS v0.2.2
 * Copyright (c) 2014 zoetrope https://github.com/zoetrope/reactiveproperty-angular/
 * License: MIT
 */
(function (root, undefined) {
    var rxprop = {};

    if (root.Rx == null) {
        throw new Error("can't find RxJS.");
    }
    var Rx = root.Rx;

    if (root.angular == null) {
        throw new Error("can't find AngularJS.");
    }
    var angular = root.angular;

    angular.module('rxprop', []);


    rxprop.ReactivePropertyMode = {
        None: 0,
        DistinctUntilChanged: 1,
        RaiseLatestValueOnSubscribe: 2
    };

    var ReactiveProperty = rxprop.ReactiveProperty = (function (_super) {
        Rx.internals.inherits(ReactiveProperty, _super);

        function subscribe(observer) {
            return this.observable.subscribe(observer);
        }

        function ReactiveProperty(scope, options, source) {
            _super.call(this, subscribe);

            this.scope = scope;
            this.anotherTrigger = new Rx.Subject();
            this.isDisposed = false;

            var self = this;

            options = options || {};
            this.val = options.initValue;
            var mode = options.mode ||
                rxprop.ReactivePropertyMode.RaiseLatestValueOnSubscribe | rxprop.ReactivePropertyMode.DistinctUntilChanged;

            if (source === undefined) {
                source = Rx.Observable.never();
            }

            var merge = source.merge(this.anotherTrigger);
            if ((mode & rxprop.ReactivePropertyMode.DistinctUntilChanged) == rxprop.ReactivePropertyMode.DistinctUntilChanged) {
                merge = merge.distinctUntilChanged();
            }
            if ((mode & rxprop.ReactivePropertyMode.RaiseLatestValueOnSubscribe) == rxprop.ReactivePropertyMode.RaiseLatestValueOnSubscribe) {
                var connectable = merge.publishValue(options.initValue);
            } else {
                var connectable = merge.publish();
            }

            this.observable = connectable.asObservable();
            this.raiseSubscription = connectable.subscribe(
                function (val) {
                    var setVal = function () {
                        self.val = val;
                    };
                    if (self.scope.$$phase) {
                        setVal();
                    } else {
                        self.scope.$apply(function () {
                            setVal();
                        });
                    }
                }
            );

            this.sourceDisposable = connectable.connect();
        }

        Object.defineProperty(ReactiveProperty.prototype, "value", {
            get: function () {
                return this.val;
            },
            set: function (val) {
                this.anotherTrigger.onNext(val);
            },
            enumerable: true,
            configurable: true
        });

        Rx.internals.addProperties(ReactiveProperty.prototype, Rx.Observer, {
            onCompleted: function () {
                this.anotherTrigger.onCompleted()
            },

            onError: function (exception) {
                this.anotherTrigger.onError(exception)
            },

            onNext: function (value) {
                this.anotherTrigger.onNext(value)
            },

            dispose: function () {
                if (this.isDisposed) return;
                this.isDisposed = true;
                this.anotherTrigger.dispose();
                this.raiseSubscription.dispose();
                this.sourceDisposable.dispose();
            }
        });

        return ReactiveProperty;
    }(Rx.Observable));

    var ReactiveCollection = rxprop.ReactiveCollection = (function (_super) {
        Rx.internals.inherits(ReactiveCollection, _super);

        function subscribe(observer) {
            return this.observable.subscribe(observer);
        }

        function ReactiveCollection(scope, options, source) {
            _super.call(this, subscribe);

            this.scope = scope;

            options = options || {};
            this.values = options.initValues || [];
            this.bufferSize = options.bufferSize;
            this.reverse = options.reverse;
            this.flatten = options.flatten;
            this.isDisposed = false;
            this.observable = new Rx.Subject();
            var self = this;

            if (source !== undefined) {
                this.sourceDisposable = source.subscribe(
                    function (val) {
                        var addVal = function () {
                            self.add(val);
                        };
                        if (self.scope.$$phase) {
                            addVal();
                        } else {
                            self.scope.$apply(function () {
                                addVal();
                            });
                        }
                    }
                );
            }

            self.scope.$watch(
                function () {
                    return self.values;
                },
                function (newVals, oldVals) {
                    self.observable.onNext(newVals);
                }, true);
        }

        Rx.internals.addProperties(ReactiveCollection.prototype, {
            add: function (val) {
                if (this.reverse) {
                    if (val instanceof Array && this.flatten) {
                        this.values.unshift.apply(this.values, val.reverse());
                    } else {
                        this.values.unshift(val);
                    }
                } else {
                    if (val instanceof Array && this.flatten) {
                        this.values.push.apply(this.values, val);
                    } else {
                        this.values.push(val);
                    }

                }
                if (this.bufferSize && this.values.length > this.bufferSize) {
                    if (this.reverse) {
                        this.values.pop();
                    } else {
                        this.values.shift();
                    }
                }
            },

            remove: function (val) {
                this.values.splice(this.values.indexOf(val), 1);
            },

            update: function (currentVal, newVal) {
                this.values[this.values.indexOf(currentVal)] = newVal;
            },

            clear: function () {
                this.values = [];
            },

            dispose: function () {
                if (this.isDisposed) return;
                this.isDisposed = true;
                if (this.sourceDisposable) {
                    this.sourceDisposable.dispose();
                }
                this.observable.onCompleted();
                this.observable.dispose();
            }
        });

        return ReactiveCollection;
    }(Rx.Observable));

    var ReactiveCommand = rxprop.ReactiveCommand = (function (_super) {
        Rx.internals.inherits(ReactiveCommand, _super);

        function subscribe(observer) {
            return this.subject.subscribe(observer);
        }

        function ReactiveCommand(scope, options, source) {
            _super.call(this, subscribe);

            this.subject = new Rx.Subject();

            options = options || {};
            if (options.initCanExecute === undefined) {
                this.isCanExecute = true;
            } else {
                this.isCanExecute = options.initCanExecute;
            }
            if (options.action !== undefined) {
                this.actionDisposable = this.subscribe(options.action);
            }

            this.scope = scope;
            this.isDisposed = false;
            var self = this;

            if (source !== undefined) {
                this.canExecuteSubscription = source.distinctUntilChanged()
                    .subscribe(function (b) {
                        var setCanExecute = function () {
                            self.isCanExecute = b ? true : false;
                        };
                        if (self.scope.$$phase) {
                            setCanExecute();
                        } else {
                            self.scope.$apply(function () {
                                setCanExecute();
                            });
                        }
                    })
            }

        }

        Rx.internals.addProperties(ReactiveCommand.prototype, {

            execute: function (param) {
                var self = this;
                var onNext = function () {
                    self.subject.onNext(param);
                };
                if (this.scope.$$phase) {
                    onNext();
                } else {
                    this.scope.$apply(function () {
                        onNext();
                    });
                }
            },

            canExecute: function () {
                return this.isCanExecute;
            },

            dispose: function () {
                if (this.isDisposed) return;
                this.isDisposed = true;
                if (this.canExecuteSubscription) {
                    this.canExecuteSubscription.dispose();
                }
                if (this.actionDisposable) {
                    this.actionDisposable.dispose();
                }

                this.subject.onCompleted();
                this.subject.dispose();

                this.isCanExecute = false;
            }
        });

        return ReactiveCommand;
    }(Rx.Observable));

    rxprop.CountChangedStatus = {
        Increment: 0,
        Decrement: 1,
        Empty: 2,
        Max: 3
    };

    var CountNotifier = rxprop.CountNotifier = (function (_super) {
        Rx.internals.inherits(CountNotifier, _super);

        function subscribe(observer) {
            return this.statusChanged.subscribe(observer);
        }

        function CountNotifier(max) {
            _super.call(this, subscribe);

            if (max === undefined) {
                max = 2147483647;
            }
            this.count = 0;
            this.max = max;
            this.statusChanged = new Rx.Subject();

        }

        Rx.internals.addProperties(CountNotifier.prototype, {

            increment: function () {

                if (this.count === this.max) {
                    return;
                } else if (this.count + 1 > this.max) {
                    this.count = max;
                } else {
                    this.count = this.count + 1;
                }

                this.statusChanged.onNext(rxprop.CountChangedStatus.Increment);

                if (this.count === this.max) {
                    this.statusChanged.onNext(rxprop.CountChangedStatus.Max);
                }

                return this.isCanExecute;
            },

            decrement: function () {

                if (this.count === 0) {
                    return;
                } else if (this.count - 1 < 0) {
                    this.count = 0;
                } else {
                    this.count = this.count - 1;
                }

                this.statusChanged.onNext(rxprop.CountChangedStatus.Decrement);

                if (this.count === 0) {
                    this.statusChanged.onNext(rxprop.CountChangedStatus.Empty);
                }

                return this.isCanExecute;
            }
        });

        return CountNotifier;
    }(Rx.Observable));

    angular.module('rxprop').config(['$provide', function ($provide) {
        $provide.decorator('$rootScope', ['$delegate', function ($delegate) {
            Object.defineProperties($delegate.constructor.prototype, {
                "$onAsObservable": {
                    value: function (name) {
                        var scope = this;
                        return Rx.Observable.create(function (observer) {
                            var deregistration = scope.$on(name, function (ev, val) {
                                observer.onNext({event: ev, value: val});
                            });
                            return Rx.Disposable.create(deregistration);
                        });
                    },
                    enumerable: false
                },
                "$emitAsObserver": {
                    value: function (name) {
                        var scope = this;
                        return Rx.Observer.create(function (val) {
                            scope.$emit(name, val);
                        });
                    },
                    enumerable: false
                },
                "$broadcastAsObserver": {
                    value: function (name) {
                        var scope = this;
                        return Rx.Observer.create(function (val) {
                            scope.$broadcast(name, val);
                        });
                    },
                    enumerable: false
                }
            });
            return $delegate;
        }]);
    }]);

    Rx.Observable.prototype.onErrorRetry = function (onError, retryCount, delay) {
        var source = this;

        var result = Rx.Observable.defer(function () {
            if (retryCount === undefined) retryCount = 0;
            if (delay === undefined) delay = 0;
            var empty = Rx.Observable.empty();
            var count = 0;

            var self = null;
            self = source.catch(function (e) {
                onError(e);

                count++;
                if (count < retryCount) {
                    if (delay === 0) {
                        return self.subscribeOn(Rx.Scheduler.currentThread);
                    } else {
                        return empty.delay(delay).concat(self);
                    }
                } else {
                    return Rx.Observable.throw(e);
                }
            });
            return self;
        });

        return result;
    };

    Rx.Observable.prototype.toReactiveProperty = function ($scope, options) {
        var source = this;
        return new rxprop.ReactiveProperty($scope, options, source);
    };

    Rx.Observable.prototype.toReactiveCollection = function ($scope, options) {
        var source = this;
        return new rxprop.ReactiveCollection($scope, options, source);
    };

    Rx.Observable.prototype.toReactiveCommand = function ($scope, options) {
        var source = this;
        return new rxprop.ReactiveCommand($scope, options, source);
    };

    angular.module('rxprop')
        .directive('rpCommand', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                priority: 200,
                terminal: true,
                scope: false,
                link: function postLink(scope, element, attrs) {

                    element.attr("ng-click", attrs.rpCommand + ".execute(" + (attrs.rpParameter || "") + ")");
                    element.attr("ng-disabled", "!" + attrs.rpCommand + ".canExecute()");
                    element.removeAttr("rp-command");
                    element.removeAttr("rp-parameter");

                    var linkfn = $compile(element)
                    linkfn(scope)
                }

            };
        }]);

    angular.module('rxprop')
        .directive('rpSubmit', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                priority: 200,
                terminal: true,
                scope: false,
                link: function postLink(scope, element, attrs) {

                    element.attr("ng-submit", attrs.rpSubmit + ".execute(" + (attrs.rpParameter || "") + ")");
                    element.removeAttr("rp-submit");
                    element.removeAttr("rp-parameter");

                    var linkfn = $compile(element)
                    linkfn(scope)
                }

            };
        }]);

    var rpEventDirectives = {};
    angular.forEach(
        'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
        function (name) {
            var directiveName = 'rp' + name.charAt(0).toUpperCase() + name.slice(1);
            rpEventDirectives[directiveName] = ['$parse', function ($parse) {
                return {
                    compile: function ($element, attr) {
                        var bindValue = $parse(attr[directiveName] + ".value");
                        return function (scope, element, attr) {
                            element.on(name, function (event) {
                                scope.$apply(function () {
                                    bindValue.assign(scope, event)
                                });
                            });
                        };
                    }
                };
            }];
        }
    );
    angular.module('rxprop').directive(rpEventDirectives);


    root.rxprop = rxprop;
})(this);