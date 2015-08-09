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
  bind(oneToken).toValue(1),
  bind(twoToken).toFactory(one => one + one,
                          oneToken)
]);

injector.get(twoToken).then(two => {
  expect(two).toBe(2); 
});
````
 
## Type-safe? How so?

In the example above, TypeScript knows that `injector.get(twoToken)` returns a `Promise<number>`, because the type of the dependency represented by `twoToken` is known to be `number`. 

Similarly, if you try to take a string and bind it to `oneValue`, TypeScript will error out. This makes Syringe far more powerful than other TS/JS DI libraries, where calling `injector.get(someTokenOrId)` returns `any`, forcing you to cast an assume that the types will be correct at runtime. It also means that when binding classes or factories, if the parameters to the class constructor or factory change from that of the binding tokens in type or arity, or vice-versa, TypeScript gives an error. 


## Bindings

### toValue

The most basic type of binding simply binds a token to a value that has no dependencies.

````typescript
/// <reference path="./node_modules/syringe.ts/dist/syringe.d.ts"/>

import {Injector, Token, bind} from 'syringe.ts';

let oneToken = new Token<number>();

let injector = new Injector([
  bind(oneToken).toValue(1)
]);

injector.get(oneToken).then(one => {
  expect(one).toBe(1);
});

````

### toFactory

This binds a token to the return value of a factory function, which can iteslf specify dependencies. The tokens for the dependencies follow the factory function.
 
````typescript
/// <reference path="./node_modules/syringe.ts/dist/syringe.d.ts"/>

import {Injector, Token, bind} from 'syringe.ts';

let helloToken = new Token<string>();
let worldToken = new Token<string>();
let helloWorldToken = new Token<string>();

let injector = new Injector([
  bind(helloToken).toValue('hello'),
  bind(worldToken).toValue('world'),
  bind(helloWorldToken).toFactory((hello, world) => `${hello} ${world}!`,
                                  helloToken, worldToken)
]);

injector.get(helloWorldToken).then(helloWorld => {
  expect(helloWorld).toEqual('hello world!');
});

````

### toAsyncFactory

Thanks to Syringe being asynchronous from the ground up, handling asynchronous dependencies is seamless. `toAsyncFactory` is similar to `toFactory` but takes a factory returning a `Promise`. This means that if you have a `string` dependency whose value is dependent on an async file read or XHR request, that can be done in the async factory and Syringe will simply wait for the promise to resolve prior to constructing dependent values.

````typescript
/// <reference path="./node_modules/syringe.ts/dist/syringe.d.ts"/>

import {Injector, Token, bind} from 'syringe.ts';

interface ICar {
   name: string;
}

let carsListToken = new Token<ICar[]>();
let carNamesToken = new Token<string>();

let injector = new Injector([
  bind(carsListToken).toAsyncFactory(() => {
    // Imagine doing an XHR or file read here to get a list of cars...
    
    return new Promise(resolve => {
       setTimeout(() => {
        resolve([
          {name: 'Vauxhall Corsa'},
          {name: 'Ford Fiesta'}
        ]);
       }, 100);
    });
  }),
  
  bind(carNamesToken).toFactory((carsList) => {
    // The type of carsList is ICar[]. No need to handle promises inside of here -- which is great for testing! Syringe handles the promise.
    
    return carsList.map(car => car.name).join(', '); 
  }, carsListToken)
]);

injector.get(carNamesToken).then(carNames => {
  expect(carNamesToken).toEqual('Vauxhall Corsa, Ford Fiesta');
});
````

This is an extremely powerful feature. It means that your code will no longer have to handle Promises as far as dependencies are concerned, because Syringe will wait for them to resolve before constructing an object dependent on it. This also means that when testing your code you no longer have to pass in promises, resolve them, reject them, etc, which can get a bit dirty. You just pass in a synchronous value.

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