angular.module('rxprop').config(['$provide', function ($provide) {
    $provide.decorator('$rootScope', ['$delegate', function ($delegate) {
        Object.defineProperties($delegate.constructor.prototype, {
            "$onAsObservable": {
                value: function (name) {
                    var scope = this;
                    return Rx.Observable.create(function (observer) {
                        var deregistration = scope.$on(name, function (ev, val) {
                            observer.onNext({event: ev, value: val});
                        });
                        return Rx.Disposable.create(deregistration);
                    });
                },
                enumerable: false
            },
            "$emitAsObserver": {
                value: function (name) {
                    var scope = this;
                    return Rx.Observer.create(function (val) {
                        scope.$emit(name, val);
                    });
                },
                enumerable: false
            },
            "$broadcastAsObserver": {
                value: function (name) {
                    var scope = this;
                    return Rx.Observer.create(function (val) {
                        scope.$broadcast(name, val);
                    });
                },
                enumerable: false
            }
        });
        return $delegate;
    }]);
}]);
