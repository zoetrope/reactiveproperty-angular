    Rx.Observable.prototype.toReactiveProperty = function ($scope, options) {
        var source = this;
        return new rxprop.ReactiveProperty($scope, options, source);
    };

    Rx.Observable.prototype.toReactiveCollection = function ($scope, options) {
        var source = this;
        return new rxprop.ReactiveCollection($scope, options, source);
    };

    Rx.Observable.prototype.toReactiveCommand = function ($scope, options) {
        var source = this;
        return new rxprop.ReactiveCommand($scope, options, source);
    };
