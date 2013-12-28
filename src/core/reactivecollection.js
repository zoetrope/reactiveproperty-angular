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
