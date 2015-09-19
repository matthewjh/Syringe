///<reference path="../../built/src/syringe.d.ts"/>
///<reference path="../../typings/tsd.d.ts"/>

import {Token, Inject, bind} from 'syringe.ts';

class OneToken extends Token<number> {}
class TwoToken extends Token<number> {}
class ThreeToken extends Token<number> {}

class StringToken extends Token<string> {}

class AToken extends Token<A> {}
class BToken extends Token<B> {}

class A {
  constructor(public one: number) {}
}

class B {
  constructor(public a: A) {}
}

// Should pass
bind(OneToken).toFactory(two => two - 1, TwoToken);

// Should fail - factory parameter without token
bind(OneToken).toFactory(two => two - 1);

// Should fail -- `StringToken` has type string, not number
bind(StringToken).toFactory(() => 5);

// Should fail -- `two` is not an array
bind(OneToken).toFactory(two => two.split(','), TwoToken);

// Should fail -- `ThreeToken` has type number, not string
bind(ThreeToken).toValue('a');

// Should pass
bind(TwoToken).toValue(2);

// Should pass
bind(OneToken).toAsyncFactory(two => Promise.resolve(two - 1), TwoToken);

// Should fail -- async factory parameter without token
bind(OneToken).toAsyncFactory(two => Promise.resolve(two - 1));

// Should fail -- `OneToken` has type number, not string
bind(OneToken).toAsyncFactory(() => Promise.resolve('a'));

// Should fail -- async factory doesn't return `Thenable`
bind(OneToken).toAsyncFactory(two => two - 1, TwoToken);

// Should fail (but doesn't at the moment :( ))
bind(AToken).toClass(A);

// Should pass
bind(AToken).toClass(A, OneToken);

// Should fail -- A's ctor's parameter is of type number, not string
bind(AToken).toClass(A, StringToken);

// Should fail -- B's ctor's parameter is of type number, not string
bind(BToken).toClass(B, StringToken);

// Should fail because B is not A
bind(AToken).toClass(B);

@Inject(OneToken)
class DecoratedA {
  constructor(public one: number) {}
}
class DecoratedAToken extends Token<DecoratedA> {}
// Should pass
bind(DecoratedAToken).toClass(DecoratedA);
bind(DecoratedAToken).toClass(DecoratedA, OneToken);

// Should fail -- DecoratedA's ctor's parameter is of type number, not string
bind(DecoratedAToken).toClass(DecoratedA, StringToken);

// Should fail -- DecoratedA2's ctor's parameter is of type number, not string
class DecoratedA2Token extends Token<DecoratedA2> {}
@Inject(StringToken)
class DecoratedA2 {
  constructor(public one: number) {}
}

// Should fail but doesn't
class DecoratedA3Token extends Token<DecoratedA3> {}
@Inject(OneToken, StringToken)
class DecoratedA3 {
  constructor(public one: number) {}
}


