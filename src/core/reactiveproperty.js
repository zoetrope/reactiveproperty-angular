    rxprop.ReactivePropertyMode = {
        None: 0,
        DistinctUntilChanged: 1,
        RaiseLatestValueOnSubscribe: 2
    };

    var ReactiveProperty = rxprop.ReactiveProperty = (function (_super) {
        Rx.Internals.inherits(ReactiveProperty, _super);

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

        Rx.Internals.addProperties(ReactiveProperty.prototype, Rx.Observer, {
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
