'use strict';

var app = angular.module('app', ['rxprop']);

app.controller("BasicsCtrl", ["$scope",
    function ($scope) {
        $scope.inputText = new rxprop.ReactiveProperty($scope, "");

        $scope.displayText = $scope.inputText
            .select(function (x) {
                return x.toUpperCase();
            })
            .delay(1000)
            .toReactiveProperty($scope);

        $scope.replaceTextCommand = $scope.inputText.select(function (s) {
            return s;
        }).toReactiveCommand($scope);

        $scope.replaceTextCommand.subscribe(function (_) {
            $scope.inputText.value = "Hello, ReactiveProperty for AngularJS!";
        });

    }]);
