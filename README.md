# Syringe

![Travis CI build status](https://api.travis-ci.org/matthewjh/Syringe.png)
[![npm version](https://badge.fury.io/js/syringe.ts.svg)](http://badge.fury.io/js/syringe.ts)

Syringe is a dependency injection library for TypeScript, with a binding syntax inspired by Angular 2's DI system. Unlike other DI libraries, it has a lot of built-in type-safety. It's also fundamentally asynchronous, making handling asynchronous dependencies painless.

Features                                                          | Supported?
------------------------------------------------------            | ------------------
Asynchronous dependencies                                         | ✓                 
Type safety and static analysis via typed tokens                  | ✓                 
Can express dependencies of any type, including TS interfaces     | ✓                 
Declarative binding syntax                                        | ✓                 
  
##Table of Contents

- [Syringe](#)
	- [Installation](#installation)
	- [Basic Usage](#basic-usage)
	- [Type-safe? How so?](#type-safe-how-so)
	- [Bindings](#bindings)
		- [toValue](#tovalue)
		- [toFactory](#tofactory)
		- [toAsyncFactory](#toasyncfactory)
		- [toClass](#toclass)
	- [Injector Hierachies](#injector-hierachies)
	- [Lazy Dependencies](#lazy-dependencies)
	- [Using in JavaScript applications](#using-in-javascript-applications)
- [License](#license)

## Installation

`npm install -g tsd` (if you don't already have `tsd`)
`npm install syringe.ts --save-dev`
`tsd link`
`tsd install es6-promise --save`

Syringe is packaged as a UMD module, so it can be loaded via CommonJS, AMD, or even via a global (`window.syringe`). 

## Basic Usage

To begin using Syringe, you need to create an `Injector`. An `Injector` has bindings, which bind `Token`s to a 'recipe' describing how the injector should construct that dependency (e.g. via new'ing up a class, a factory, etc.).

`test.ts`
````typescript
import {Injector, Token, bind} from 'syringe.ts';

// In a real-world app, you'd export your tokens from many files and import them here to create the Injector
class OneToken extends Token<number> {}
class TwoToken extends Token<number> {}

let injector = new Injector([
  bind(OneToken).toValue(1),
  bind(TwoToken).toFactory(one => one + one,
                          OneToken)
]);

injector.get(TwoToken).then(two => {
  console.log(two); // logs 2
});
````

To compile and run:
````
tsc test.ts typings/tsd.d.ts --module commonjs
````
`node test.js` => prints 2
 
## Type-safe? How so?

In the example above, TypeScript knows that `injector.get(TwoToken)` returns a `Promise<number>`, because the type of the dependency represented by `TwoToken` is known to be `number`. 

Similarly, if you try to take a string and bind it to `OneToken`, TypeScript will error out. This makes Syringe far more powerful than other TS/JS DI libraries, where calling `injector.get(someTokenOrId)` returns `any`, forcing you to cast an assume that the types will be correct at runtime. It also means that when binding classes or factories, if the parameters to the class constructor or factory change from that of the binding tokens in type or arity, or vice-versa, TypeScript gives an error. 

The same system of type-parametized tokens enables Syringe to correctly handle and type non-class dependencies e.g. interfaces where other frameworks cannot due to their dependency on TypeScript decorator metadata (which don't work for interfaces in particular) and/or class tokens (which, again, don't work with interfaces nor non-class types).

## Bindings

### toValue

The most basic type of binding simply binds a token to a value that has no dependencies.

````typescript
import {Injector, Token, bind} from 'syringe.ts';

class OneToken extends Token<number> {}

let injector = new Injector([
  bind(OneToken).toValue(1)
]);

injector.get(OneToken).then(one => {
  expect(one).toBe(1);
});

````

### toFactory

This binds a token to the return value of a factory function, which can iteslf specify dependencies. The tokens for the dependencies follow the factory function.
 
````typescript
import {Injector, Token, bind} from 'syringe.ts';

class HelloToken extends Token<string> {}
class WorldToken extends Token<string> {}
class HelloWorldToken extends Token<string> {}

let injector = new Injector([
  bind(HelloToken).toValue('hello'),
  bind(WorldToken).toValue('world'),
  bind(HelloWorldToken).toFactory((hello, world) => `${hello} ${world}!`,
                                  HelloToken, WorldToken)
]);

injector.get(HelloWorldToken).then(helloWorld => {
  expect(helloWorld).toEqual('hello world!');
});

````

### toAsyncFactory

Thanks to Syringe being asynchronous from the ground up, handling asynchronous dependencies is seamless. `toAsyncFactory` is similar to `toFactory` but takes a factory returning a `Promise`. This means that if you have a `string` dependency whose value is dependent on an async file read or XHR request, that can be done in the async factory and Syringe will simply wait for the promise to resolve prior to constructing dependent values.

````typescript
import {Injector, Token, bind} from 'syringe.ts';

interface ICar {
   name: string;
}

class CarsListToken extends Token<ICar[]> {}
class CarNamesToken extends Token<string> {}

let injector = new Injector([
  bind(CarsListToken).toAsyncFactory(() => {
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
  
  bind(CarNamesToken).toFactory((carsList) => {
    // The type of carsList is ICar[]. No need to handle promises inside of here -- which is great for testing! Syringe handles the promise.
    
    return carsList.map(car => car.name).join(', '); 
  }, CarsListToken)
]);

injector.get(CarNamesToken).then(carNames => {
  expect(carNamesToken).toEqual('Vauxhall Corsa, Ford Fiesta');
});
````

This is an extremely powerful feature. It means that your code will no longer have to handle Promises as far as dependencies are concerned, because Syringe will wait for them to resolve before constructing objects dependent on them. This also means that when testing your code you no longer have to pass in promises, resolve them, reject them, etc, which can get a bit dirty. You just pass in a synchronous value.

### toClass

`toClass` creates a binding between a token and a class, meaning that the dependency will be created by constructing a new instance of that class. The class's dependencies will be passed into its constructor.

````typescript
import {Injector, Token, bind} from 'syringe.ts';

interface ILog {
  info(message: string): void;
}

class LogToken extends Token<ILog> {}
class IsDevelopmentModeToken extends Token<boolean> {}
  
class MyLog implements ILog {
  private _isDevelopmentMode: boolean;

  constructor(isDevelopmentMode: boolean) {
  	this._isDevelopmentMode = isDevelopmentMode;
  }

  info(message: string): void {
    if (this._isDevelopmentMode) {
      console.log(message);
    }
  }
}       

let injector = new Injector([
  bind(LogToken).toClass(MyLog,
                         IsDevelopmentModeToken),
  bind(IsDevelopmentModeToken).toValue(true)
]);

injector.get(LogToken).then(log => {
  log.info('Hi!');
});
````

You can also specify a class's dependency tokens by decorating it with `Inject`. Note that this requires that the decorators flag (`--experimentalDecorators`) be passed to the TypeScript compiler and that you target at least ES5 (`--target es5`):

````typescript
import {Injector, Inject, Token, bind} from 'syringe.ts';

interface ILog {
  info(message: string): void;
}

class LogToken extends Token<ILog> {}
class IsDevelopmentModeToken extends Token<boolean> {}
  
@Inject(IsDevelopmentModeToken)
class MyLog implements ILog {
  private _isDevelopmentMode: boolean;

  constructor(isDevelopmentMode: boolean) {
  	this._isDevelopmentMode = isDevelopmentMode;
  }

  info(message: string): void {
    if (this._isDevelopmentMode) {
      console.log(message);
    }
  }
}       

let injector = new Injector([
  bind(LogToken).toClass(MyLog),
  bind(IsDevelopmentModeToken).toValue(true)
]);

injector.get(LogToken).then(log => {
  log.info('Hi!');
});
````

Note that if Syringe has a class dependency that is both decorated with `Inject` and has inline dependency tokens in the `toClass` call, the latter will take precendence.

## Injector Hierachies

You can create `Injector` hierarchies by passing in a parent `Injector` when creating a new `Injector`:

````typescript
import {Injector, Token, bind} from 'syringe.ts';

class OneToken extends Token<number> {}
class TwoToken extends Token<number> {}

let parentInjector = new Injector([
   bind(OneToken).toValue(1)
]);
 
let childInjector = new Injector([
  bind(TwoToken).toFactory(one => one + 1,
                            OneToken)
], parentInjector);

injector.get(TwoToken).then(two => {
  expect(two).toBe(2);
});
````

This works as you'd expect in that if you `get` a token from a child injector and it's not bound on the child, the parent is then checked. Here, when we get `twoToken`'s value, the dependency on `oneToken` in `twoToken`'s factory will be retrieved from the parent injector because it is not bound on the child.

## Lazy Dependencies

Sometimes it is desirable to construct a dependency in a context after that context has been created by the injector. For this, Syringe has a lazy feature, meaning that the dependency will not be retrieved until `.get` is called on the lazy instance. 

This can sometimes be useful to avoid cyclic dependency errors, if you know that a dependency is not needed until sometime after the injector has created other dependencies:

````typescript
import {Injector, Inject, Token, bind} from 'syringe.ts';

class AToken extends Token<A> {}
class BToken extends Token<B> {}

@Inject(BToken)
class A {
  private _b: B;

  constructor(b: B) {
  	this._b = b;
  }

  foo(): void {
  	this._b.foo();
  }
}

@Inject(AToken)
class B {
  private _a: A;

  constructor(a: A) {
  	this._a = a;
  }

  foo(): void {
  	console.log('foo');
  }
}

let injector = new Injector([
  bind(AToken).toClass(A),
  bind(BToken).toClass(B)
]);

// Throws CyclicDependencyError, because A depends on B and B depends on A.
injector.get(AToken).then(a => {
  a.foo();
});
```` 

but, if we know that we don't need a reference to B prior to calling `A#foo`, we can specify that we want `bToken` to be injected lazily.

Note that this means that the client code has to handle the asynchrony usually handled by the injector behind the scenes.

````typescript
import {Injector, Inject, Token, Lazy, ILazy, bind} from 'syringe.ts';

class AToken extends Token<A> {}
class BToken extends Token<B> {}
  
@Inject(Lazy(BToken))
class A {
  private _b: ILazy<B>;

  constructor(b: ILazy<B>) {
  	this._b = b;
  }

  foo(): Promise<void> {
  	return this._b.get().then(b => {
  		b.foo();
  	});
  }
}

@Inject(AToken)
class B {
  private _a: A;

  constructor(a: A) {
  	this._a = a;
  }

  foo(): void {
  	console.log('foo');
  }
}

let injector = new Injector([
  bind(AToken).toClass(A),
  bind(BToken).toClass(B)
]);

injector.get(AToken).then(a => {
  return a.foo();
});
````

## Using in JavaScript applications
 
 You can use Syringe for DI in your JavaScript code, though you will then of course not get the benefit of type-safety.
 
 ````javascript
<script src="https://raw.githubusercontent.com/matthewjh/Syringe/master/dist/syringe.min.js" type="text/javascript"></script>
 
<script type="text/javascript">
  var oneToken = syringe.Token.create();
  var injector = new syringe.Injector([
    syringe.bind(oneToken).toValue(5)
  ]);
  
  injector.get(oneToken).then(function(one) {
    console.log(one);
  });
</script>
 ````
 
# License
 
 ````
The MIT License (MIT)

Copyright (c) 2015 Matthew Hill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````
