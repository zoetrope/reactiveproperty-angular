'use strict';

var app = angular.module('app', ['rxprop']);

app.controller("CommandCtrl", ["$scope",
    function ($scope) {
        $scope.isChecked1 = new rxprop.ReactiveProperty($scope);
        $scope.isChecked2 = new rxprop.ReactiveProperty($scope);
        $scope.isChecked3 = new rxprop.ReactiveProperty($scope);
        $scope.isChecked4 = new rxprop.ReactiveProperty($scope);
        $scope.currentText = new rxprop.ReactiveProperty($scope);

        $scope.checkedCommand = $scope.isChecked1
            .combineLatest($scope.isChecked2, $scope.isChecked3, $scope.isChecked4, $scope.currentText, function (a, b, c, d, txt) {
                return a && b && c && d && txt;
            })
            .toReactiveCommand($scope);

        $scope.checkedCommand
            .subscribe(function (_) {
                alert("Execute!")
            })

    }]);
