# Syringe
`npm install syringe.ts --save-dev`

## What is it

Syringe is a dependency injection library for TypeScript, with a binding syntax inspired by Angular 2's DI system. Unlike other DI libraries, it has a lot of built-in type-safety. It's also fundamentally asynchronous, making handling asynchronous dependencies painless.

## Basic Usage

To begin using Syringe, you need to create an `Injector`. An `Injector` has bindings, which bind `Token`s to a 'recipe' explicating how to the injector should construct that dependency (e.g. via new'ing up a class, a factory, etc.).

````typescript
/// <reference path="./node_modules/syringe.ts/dist/syringe.d.ts"/>

import {Injector, Token, bind} from 'syringe.ts';

let oneToken = new Token<number>();
let twoToken = new Token<number>();

let injector = new Injector([
  bind(oneToken).toValue(1);
  bind(twoToken).toFactory(one => one + one,
                          oneToken);
]);

injector.get(twoToken).then(two => {
  expect(two).toBe(2); 
});
````
 
## Type-safe? How so?

In the example above, TypeScript knows that `injector.get(twoToken)` returns a `Promise<number>`, because the type of the dependency represented by `twoToken` is known to be `number`. 

Similarly, if you try to take a string and bind it to `oneValue`, TypeScript will error out. This makes Syringe far more powerful than other TS/JS DI libraries, where calling `injector.get(someTokenOrId)` returns `any`. It also means that when binding classes or factories, if the parameters to the class constructor or factory change from that of the binding tokens in type or arity, TypeScript gives an error. 



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