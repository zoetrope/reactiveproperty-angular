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

            var merge = source.merge(this.another_trigger).distinctUntilChanged();
            var connectable = merge.publish();

            this.observable = connectable.asObservable();
            connectable.subscribe(
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

            connectable.connect();
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
