'use strict';

var app = angular.module('app', ['rxprop']);

app.controller("ValidationCtrl", ["$scope",
    function ($scope) {
        $scope.inputText = new rxprop.ReactiveProperty($scope, {initValue: ""});

        $scope.displayText = $scope.inputText
            .select(function (x) {
                return x.toUpperCase();
            })
            .toReactiveProperty($scope);

        $scope.displayCommand = $scope.inputText.select(function (_) {
            return $scope.myform ? $scope.myform.inputText.$valid : false;
        }).toReactiveCommand($scope);

        $scope.displayCommand.subscribe(function (v) {
            alert("input text = " + v);
        });

    }]);
