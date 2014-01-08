/// <reference path="../DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../DefinitelyTyped/rx.js/rx.d.ts" />

declare module rxprop {

    enum ReactivePropertyMode {
        None,
        DistinctUntilChanged,
        RaiseLatestValueOnSubscribe
    }
    export interface ReactiveProperty<T> extends Rx.Observable<T>, Rx.Observer<T>, Rx.IDisposable {
        value: T;
    }
    interface ReactivePropertyStatic {
        new<T> ($scope:ng.IScope, initValue?:T, mode?:ReactivePropertyMode): ReactiveProperty<T>;
    }
    export var ReactiveProperty:ReactivePropertyStatic;

    export interface ReactiveCollection<T> extends Rx.Observable<T>, Rx.IDisposable {
        values: Array<T>;
    }
    interface ReactiveCollectionStatic {
        new<T> ($scope:ng.IScope, bufferSize?:number, reverse?:boolean): ReactiveCollection<T>;
    }
    export var ReactiveCollection:ReactiveCollectionStatic;

    export interface ReactiveCommand<T> extends Rx.Observable<T>, Rx.IDisposable {
        execute(param:T);
        canExecute(param) : boolean;
    }
    interface ReactiveCommandStatic {
        new<T> (scope:ng.IScope): ReactiveCommand<T>;
    }
    export var ReactiveCommand:ReactiveCommandStatic;

    enum CountChangedStatus {
        Increment,
        Decrement,
        Empty,
        Max
    }
    export interface CountNotifier extends Rx.Observable<CountChangedStatus> {
        increment();
        decrement();
    }
    interface CountNotifierStatic {
        new<T> (max?:number): CountNotifier;
    }
    export var CountNotifier:CountNotifierStatic;
}

declare module Rx {
    export interface Observable<T> {
        toReactiveProperty : ($scope:ng.IScope, initValue?:T, mode?:rxprop.ReactivePropertyMode) => rxprop.ReactiveProperty<T>;
        toReactiveCollection : ($scope:ng.IScope, bufferSize?:number, reverse?:boolean) => rxprop.ReactiveCollection<T>;
        toReactiveCommand : ($scope:ng.IScope) => rxprop.ReactiveCommand<T>;

        onErrorRetry<TException>(onError:(ex:TException)=> void, retryCount?:number, delay?:number): Observable<T>;
    }
}