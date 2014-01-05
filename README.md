# ReactiveProperty for AngularJS

A port of ReactiveProperty for AngularJS

* ReactiveProperty
  * http://reactiveproperty.codeplex.com/

* RxJS
  * https://github.com/Reactive-Extensions/RxJS

## Install

> bower install reactivepropety-angular

~~~html
<script type="text/javascript" src="angular/angular.js" charset="utf-8"></script>
<script type="text/javascript" src="rxjs/rx.lite.js" charset="utf-8"></script>
<script type="text/javascript" src="reactiveproperty-angular/reactiveproperty-angular.js" charset="utf-8"></script>
~~~

## Sample

### ReactiveProperty

~~~html
<div ng-controller="BasicsCtrl">
    <input type="text" ng-model="inputText.value">
    <br/>
    {{displayText.value}}
</div>
~~~

~~~js
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
    }]);
~~~


### ReactiveCollection

~~~html
<div ng-controller="CollectionCtrl">
     <div ng-repeat="item in items.values">
        {{item | json}} <br/>
    </div>
</div>
~~~

~~~js
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
~~~


### ReactiveCommand


~~~html
<div ng-controller="CommandCtrl">
    <input type="checkbox" ng-model="isChecked1.value">
    <input type="checkbox" ng-model="isChecked2.value">
    <input type="checkbox" ng-model="isChecked3.value">
    <input type="checkbox" ng-model="isChecked4.value">
    <input type="text" ng-model="currentText.value">

    <button rp-command="checkedCommand" rp-parameter="currentText.value">push</button>
</div>
~~~

~~~js
var app = angular.module('app', ['rxprop']);

app.controller("CommandCtrl", ["$scope",
    function ($scope) {
        $scope.isChecked1 = new rxprop.ReactiveProperty($scope, false);
        $scope.isChecked2 = new rxprop.ReactiveProperty($scope, false);
        $scope.isChecked3 = new rxprop.ReactiveProperty($scope, false);
        $scope.isChecked4 = new rxprop.ReactiveProperty($scope, false);
        $scope.currentText = new rxprop.ReactiveProperty($scope, "");

        $scope.checkedCommand = $scope.isChecked1
            .combineLatest($scope.isChecked2, $scope.isChecked3, $scope.isChecked4, $scope.currentText, function (a, b, c, d, txt) {
                return a && b && c && d && txt;
            })
            .toReactiveCommand($scope);

        $scope.checkedCommand
            .subscribe(function (param) {
                alert("Execute! input = " + param)
            })

    }]);
~~~

### Event to ReactiveProperty


~~~html
<div ng-controller="EventCtrl" rp-mousemove="mousemove">
    <div style="background-color:lightgray; margin:20px; padding:20px;">
    <pre>
Position: {{currentPoint.value | json}}
    </pre>
</div>
~~~

~~~js
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
~~~

#### support directives

* rp-click
* rp-dblclick
* rp-mousedown
* rp-mouseup
* rp-mouseover
* rp-mouseout
* rp-mousemove
* rp-mouseenter
* rp-mouseleave
* rp-keydown
* rp-keyup
* rp-keypress
* rp-submit
* rp-focus
* rp-blur
* rp-copy
* rp-cut
* rp-paste

