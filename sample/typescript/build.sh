#!/bin/bash

tsd install angular rx.js rx.time.js jquery
mkdir ./d.ts/ReactiveProperty/
cp ../../typescript/reactiveproperty-angular.d.ts ./d.ts/ReactiveProperty/
tsc typescript.ts