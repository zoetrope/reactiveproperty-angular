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
