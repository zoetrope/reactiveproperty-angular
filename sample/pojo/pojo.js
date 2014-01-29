'use strict';

var app = angular.module('app', ['rxprop']);

app.controller("PojoCtrl", ["$scope",
    function ($scope) {
        var rawValue = {name: "hoge", age: 17};
        $scope.inputValue = new rxprop.ReactiveProperty($scope, {initValue: rawValue});
        $scope.displayValue = new rxprop.ReactiveProperty($scope, {initValue: rawValue});



    }]);
