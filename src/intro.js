/**
 * @license ReactiveProperty for AngularJS v0.1.3
 * Copyright (c) 2014 zoetrope https://github.com/zoetrope/reactiveproperty-angular/
 * License: MIT
 */
(function (root, undefined) {
    var rxprop = {};

    if (root.Rx == null) {
        throw new Error("can't find RxJS.");
    }
    var Rx = root.Rx;

    if (root.angular == null) {
        throw new Error("can't find AngularJS.");
    }
    var angular = root.angular;

    angular.module('rxprop', []);

