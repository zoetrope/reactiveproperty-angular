    rxprop.CountChangedStatus = {
        Increment: 0,
        Decrement: 1,
        Empty: 2,
        Max: 3
    };

    var CountNotifier = rxprop.CountNotifier = (function (_super) {
        Rx.Internals.inherits(CountNotifier, _super);

        function subscribe(observer) {
            return this.statusChanged.subscribe(observer);
        }

        function CountNotifier(max) {
            _super.call(this, subscribe);

            if (!max) {
                max = 2147483647;
            }
            this.count = 0;
            this.max = max;
            this.statusChanged = new Rx.Subject();

        }

        Rx.Internals.addProperties(CountNotifier.prototype, {

            increment: function () {

                if (this.count === this.max) {
                    return;
                } else if (this.count + 1 > this.max) {
                    this.count = max;
                } else {
                    this.count = this.count + 1;
                }

                this.statusChanged.onNext(rxprop.CountChangedStatus.Increment);

                if(this.count === this.max) {
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

                if(this.count === 0) {
                    this.statusChanged.onNext(rxprop.CountChangedStatus.Empty);
                }

                return this.isCanExecute;
            }
        });

        return CountNotifier;
    }(Rx.Observable));
