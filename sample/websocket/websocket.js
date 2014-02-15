'use strict';

var app = angular.module('app', ['rxprop']);

function webSocketAsObservable(url) {
    var connector = new Rx.AsyncSubject();

    var Socket = WebSocket || MozWebSocket;
    var socket = new Socket(url);

    socket.onerror = function (ee) {
        connector.onError(ee);
    };
    socket.onclose = function (ce) {
        connector.onCompleted();
    };

    socket.onopen = function (e) {
        var receiver =
            Rx.Observable.createWithDisposable(function (observer) {
                socket.onmessage = function (msg) {
                    observer.onNext(msg);
                };
                socket.onerror = function (ee) {
                    observer.onError(ee);
                };
                socket.onclose = function (ce) {
                    observer.onCompleted();
                };
                return Rx.Disposable.create(function () {
                    socket.close();
                });
            });
        connector.onNext(receiver);
        connector.onCompleted();
    };

    return connector.asObservable();
}

app.controller("WebSocketCtrl", ["$scope",
    function ($scope) {

        $scope.items = webSocketAsObservable("ws://localhost:9991")
            .selectMany(function (receiver) {
                return receiver;
            })
            .select(function (x) {
                return angular.fromJson(x.data);
            })
            .toReactiveCollection($scope);

    }]);
