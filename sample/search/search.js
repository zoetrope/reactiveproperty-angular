'use strict';

var app = angular.module('app', ['rxprop']);

app.factory("WikipediaSearch", ["$http", function ($http) {
    var search = function (term) {
        var deferred = $http({
            url: "http://en.wikipedia.org/w/api.php?&callback=JSON_CALLBACK",
            method: "jsonp",
            params: {
                action: "opensearch",
                search: term,
                format: "json"
            }
        });

        return Rx.Observable
            .fromPromise(deferred)
            .select(function (response) {
                return response.data[1]
            });
    };

    return search;
}]);

app.controller("SearchCtrl", ["$scope", "WikipediaSearch",
    function ($scope, WikipediaSearch) {
        $scope.inputText = new rxprop.ReactiveProperty($scope);

        $scope.results = $scope.inputText
            .throttle(300)
            .distinctUntilChanged()
            .select(WikipediaSearch)
            .switchLatest()
            .toReactiveProperty($scope);

    }]);
