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
