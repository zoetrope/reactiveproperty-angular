'use strict';

var app = angular.module('app', ['rxprop']);

app.controller("EventCtrl", ["$scope",
    function ($scope) {
        $scope.mousemove = new rxprop.ReactiveProperty($scope, undefined, rxprop.ReactivePropertyMode.DistinctUntilChanged);

        $scope.currentPoint = $scope.mousemove
            .select(function (e) {
                return {x: e.x, y: e.y};
            })
            .toReactiveProperty($scope);

    }]);
