# Syringe
`npm install syringe.ts --save-dev`

# What is it

Syringe is a dependency injection library for TypeScript, with a binding syntax inspired by Angular 2's DI system. Unlike other DI libraries, it has a lot of built-in type-safety. It's also fundamentally asynchronous, making handling asynchronous dependencies painless.

# Basic Usage

To begin using Syringe, you need to create an `Injector`. An `Injector` has bindings, which bind `Token`s to a 'recipe' explicating how to the injector should construct that dependency (e.g. via new'ing up a class, a factory, etc.).

````typescript
/// <reference path="./node_modules/syringe.ts/dist/syringe.d.ts"/>

import {Injector, Token, bind} from 'syringe.ts';

let injector = new Injector([
  bind(oneToken).toValue(1);
  bind(twoToken).toFactory(one => one + one,
                          oneToken);
]);

injector.get(twoToken).then(two => {
  expect(two).toBe(2); 
});
````
 

````typescript
/// <reference path="./node_modules/syringe.ts/dist/syringe.d.ts"/>

import {Injector, Token, bind} from 'syringe.ts';

interface ILog {
  info(message: string): void;
}

let logToken = new Token<ILog>();

class MyLog implements ILog {
  info(message: string): void {
    console.log(message);
  }
}       

let injector = new Injector([
  bind(logToken).toClass(MyLog)
]);

injector.get(logToken).then(log => {
  log.info('Hi!');
});
````