'use strict';

var app = angular.module('app', ['rxprop', 'ngMockE2E']);

app.run(["$httpBackend", "$timeout", function ($httpBackend, $timeout) {
    var items = [
        {name: 'hoge'},
        {name: 'fuga'}
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
                return Rx.Observable.defer(function () {
                    network.increment();
                    return DummySearch().finally(function () {
                        network.decrement();
                    });})
                    .onErrorRetry(function (e) {
                        console.log("error");
                    }, 5, 1000)
            })
            .toReactiveProperty($scope);

    }]);
