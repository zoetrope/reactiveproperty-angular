/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />

declare module rxprop {
    export interface ReactiveProperty<T> extends Rx.Observable<T>{
        value: T;
    }
    interface ReactivePropertyStatic {
        new<T> ($scope: ng.IScope): ReactiveProperty<T>;
    }
    export var ReactiveProperty: ReactivePropertyStatic;

    export interface ReactiveCollection<T> extends Rx.Observable<T>{
        value: T[];
    }
    interface ReactiveCollectionStatic {
        new<T> ($scope: ng.IScope): ReactiveCollection<T>;
    }
    export var ReactiveCollection: ReactiveCollectionStatic;

    export interface ReactiveCommand<T> extends Rx.Observable<T>{
        execute(param: any);
        canExecute(param) : boolean;
    }
    interface ReactiveCommandStatic {
        new<T> (scope: ng.IScope): ReactiveCommand<T>;
    }
    export var ReactiveCommand: ReactiveCommandStatic;
}

declare module Rx {
    export interface Observable<T> {
        toReactiveProperty : ($scope: ng.IScope) => rxprop.ReactiveProperty<T>;
        toReactiveCollection : ($scope: ng.IScope) => rxprop.ReactiveCollection<T>;
        toReactiveCommand : ($scope: ng.IScope) => rxprop.ReactiveCommand<T>;
    }
}