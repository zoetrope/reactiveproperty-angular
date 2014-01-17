    var ReactiveCollection = rxprop.ReactiveCollection = (function (_super) {
        Rx.Internals.inherits(ReactiveCollection, _super);

        function subscribe(observer) {
            return this.observable.subscribe(observer);
        }

        function ReactiveCollection(scope, initValues, bufferSize, reverse, source) {
            _super.call(this, subscribe);

            this.scope = scope;

            if (initValues !== undefined) {
                this.values = initValues;
            } else {
                this.values = [];
            }
            this.bufferSize = bufferSize;
            this.reverse = reverse;
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

        Rx.Internals.addProperties(ReactiveCollection.prototype, {
            add: function (val) {
                if (this.reverse) {
                    this.values.unshift(val)
                } else {
                    this.values.push(val);
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
