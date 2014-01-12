    var ReactiveCollection = rxprop.ReactiveCollection = (function () {

        function ReactiveCollection(scope, bufferSize, reverse, source) {
            this.scope = scope;

            this.bufferSize = bufferSize;
            this.reverse = reverse;
            this.values = [];
            this.isDisposed = false;
            var self = this;

            if (source !== undefined) {
                this.sourceDisposable = source.subscribe(
                    function (val) {
                        var addVal = function () {
                            if (self.reverse) {
                                self.values.unshift(val)
                            } else {
                                self.values.push(val);
                            }
                            if (self.bufferSize && self.values.length > self.bufferSize) {
                                if (self.reverse) {
                                    self.values.pop();
                                } else {
                                    self.values.shift();
                                }
                            }
                        };
                        if (self.scope.$$phase) {
                            addVal();
                        } else {
                            self.scope.$apply(function(){
                                addVal();
                            });
                        }
                    }
                );
            }
        }

        Rx.Internals.addProperties(ReactiveCollection.prototype, {
            clear: function () {
                this.values = [];
            },

            dispose: function () {
                if (this.isDisposed) return;
                this.isDisposed = true;
                if (this.sourceDisposable) {
                    this.sourceDisposable.dispose();
                }
            }
        });

        return ReactiveCollection;
    }());
