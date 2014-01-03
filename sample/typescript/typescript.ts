/// <reference path="d.ts/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="d.ts/DefinitelyTyped/rx.js/rx.d.ts" />
/// <reference path="d.ts/DefinitelyTyped/rx.js/rx.time.d.ts" />
/// <reference path="d.ts/ReactiveProperty/reactiveproperty-angular.d.ts" />

'use strict';

var app = angular.module('app', ['rxprop']);


module controller {

    export interface TSScope extends ng.IScope {
        inputText: rxprop.ReactiveProperty<string>;
        displayText: rxprop.ReactiveProperty<string>;
        replaceTextCommand: rxprop.ReactiveCommand<string>;
    }

    export class TSController {

        constructor(private $scope: TSScope)
        {
            $scope.inputText = new rxprop.ReactiveProperty<string>($scope);

            $scope.displayText = $scope.inputText
                .where(function (x) {
                    return x != null;
                })
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
        }
    }
}

app.controller("TSCtrl", ["$scope",
    ($scope: controller.TSScope):controller.TSController => {
        return new controller.TSController($scope)
    }]);
