
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
            this.isDisposed = false;
            var self = this;

            if (source !== undefined) {
                this.canExecuteSubscription = source.distinctUntilChanged()
                    .subscribe(function(b){
                        self.isCanExecute = b ? true : false;
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
            },

            dispose: function () {
                if (this.isDisposed) return;
                this.isDisposed = true;
                if(this.canExecuteSubscription){
                    this.canExecuteSubscription.dispose();
                }

                this.subject.onCompleted();
                this.subject.dispose();

                this.isCanExecute = false;
            }
        });

        return ReactiveCommand;
    }(Rx.Observable));
