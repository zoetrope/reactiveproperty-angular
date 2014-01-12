
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
                        var setCanExecute = function() {
                            self.isCanExecute = b ? true : false;
                        };
                        if (self.scope.$$phase) {
                            setCanExecute();
                        } else {
                            self.scope.$apply(function(){
                                setCanExecute();
                            });
                        }
                    })
            }
        }

        Rx.Internals.addProperties(ReactiveCommand.prototype, {

            execute: function (param) {
                var self = this;
                var onNext = function() {
                    self.subject.onNext(param);
                };
                if (this.scope.$$phase) {
                    onNext();
                } else {
                    this.scope.$apply(function(){
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
