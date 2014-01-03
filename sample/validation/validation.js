'use strict';

var app = angular.module('app', ['rxprop']);

app.controller("ValidationCtrl", ["$scope",
    function ($scope) {
        $scope.inputText = new rxprop.ReactiveProperty($scope);

        $scope.displayText = $scope.inputText
            .where(function (x) {
                return x;
            })
            .select(function (x) {
                return x.toUpperCase();
            })
            .toReactiveProperty($scope);

        $scope.displayCommand = $scope.inputText.select(function (_) {
            return $scope.myform.inputText.$valid;
        }).toReactiveCommand($scope);

        $scope.displayCommand.subscribe(function (v) {
            alert("input text = " + v);
        });

    }]);
