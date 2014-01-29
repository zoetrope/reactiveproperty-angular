'use strict';

var app = angular.module('app', ['rxprop']);


app.controller("ParentCtrl", ["$scope",
    function ($scope) {
        $scope.parentReceived = $scope
            .$onAsObservable("eventTest")
            .select(function (e) {
                return e.value;
            })
            .toReactiveProperty($scope);

    }]);

app.controller("OwnCtrl", ["$scope",
    function ($scope) {

        function isValidString(str){
            return typeof str === "string" && str !== "";
        }

        $scope.inputText = new rxprop.ReactiveProperty($scope, {initValue: ""});

        $scope.emitCommand = $scope.inputText
            .select(isValidString)
            .toReactiveCommand($scope);

        $scope.emitCommand.subscribe(function (v) {
            $scope.$emitAsObserver("eventTest").onNext(v)
        });

        $scope.broadcastCommand = $scope.inputText
            .select(isValidString)
            .toReactiveCommand($scope);

        $scope.broadcastCommand.subscribe(function (v) {
            $scope.$broadcastAsObserver("eventTest").onNext(v);
        });


        $scope.ownReceived = $scope
            .$onAsObservable("eventTest")
            .select(function (e) {
                return e.value;
            })
            .toReactiveProperty($scope);
    }]);

app.controller("ChildCtrl", ["$scope",
    function ($scope) {
        $scope.childReceived = $scope
            .$onAsObservable("eventTest")
            .select(function (e) {
                return e.value;
            })
            .toReactiveProperty($scope);
    }]);
