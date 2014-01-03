'use strict';

var app = angular.module('app', ['rxprop', 'ngMockE2E']);

app.run(["$httpBackend", "$timeout", function ($httpBackend, $timeout) {
    var items = [
        {name: 'hoge', date: new Date()},
        {name: 'fuga', date: new Date()}
    ];
    $httpBackend
        .whenGET('/items')
        .respond(function (status, data, headers) {
            if(Math.random() < 0.8) {
                return [503, {}, {}];
            } else {
                return [200, items, {}];
            }
        });
}]);

app.factory("DummySearch", ["$http", function ($http) {
    var search = function (term) {
        var deferred = $http({
            url: "/items",
            method: "GET"
        });

        return Rx.Observable
            .fromPromise(deferred)
            .select(function (response) {
                return response.data;
            });
    };

    return search;
}]);

app.controller("NotifierCtrl", ["$scope", "DummySearch",
    function ($scope, DummySearch) {

        var network = new rxprop.CountNotifier();

        $scope.downloadCommand = network
            .select(function (x) {
                return x === rxprop.CountChangedStatus.Empty;
            })
            .toReactiveCommand($scope);

        $scope.displayText = $scope.downloadCommand
            .selectMany(function (_) {
                network.increment();
                return Rx.Observable
                    .defer(function () {
                        network.increment();
                        return DummySearch().finally(function () {
                            network.decrement();
                        });
                    })
                    .onErrorRetry(function (e) {
                        $scope.displayText.value = "ERROR!";
                    }, 5, 1000);
            })
            .do(function (e) {network.decrement();})
            .finally(function (e) {network.decrement();})
            .retry()
            .toReactiveProperty($scope);

    }]);
