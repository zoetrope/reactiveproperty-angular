'use strict';

var app = angular.module('app', ['rxprop']);

app.controller("CollectionCtrl", ["$scope",
    function ($scope) {

        $scope.items = Rx.Observable
            .interval(1000)
            .select(function (_) {
                return new Date()
            })
            .toReactiveCollection($scope);

        Rx.Observable
            .interval(5000)
            .subscribe(function(_){
               $scope.items.clear();
            });

    }]);
