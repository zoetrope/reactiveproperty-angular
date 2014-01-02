'use strict';

var app = angular.module('app', ['rxprop']);

app.controller("CommandCtrl", ["$scope",
    function ($scope) {
        $scope.mousemove = new rxprop.ReactiveProperty($scope);

        $scope.currentPoint = $scope.mousemove
            .where(function (e) {
                return e && e.$event;
            })
            .select(function (e) {
                return {x: e.$event.x, y: e.$event.y};
            })
            .toReactiveProperty($scope);

    }]);
