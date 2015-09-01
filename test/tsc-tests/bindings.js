///<reference path="../../built/src/syringe.d.ts"/>
///<reference path="../../typings/es6-promise/es6-promise.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var syringe_ts_1 = require('syringe.ts');
var OneToken = (function (_super) {
    __extends(OneToken, _super);
    function OneToken() {
        _super.apply(this, arguments);
    }
    return OneToken;
})(syringe_ts_1.Token);
var TwoToken = (function (_super) {
    __extends(TwoToken, _super);
    function TwoToken() {
        _super.apply(this, arguments);
    }
    return TwoToken;
})(syringe_ts_1.Token);
var ThreeToken = (function (_super) {
    __extends(ThreeToken, _super);
    function ThreeToken() {
        _super.apply(this, arguments);
    }
    return ThreeToken;
})(syringe_ts_1.Token);
var StringToken = (function (_super) {
    __extends(StringToken, _super);
    function StringToken() {
        _super.apply(this, arguments);
    }
    return StringToken;
})(syringe_ts_1.Token);
var AToken = (function (_super) {
    __extends(AToken, _super);
    function AToken() {
        _super.apply(this, arguments);
    }
    return AToken;
})(syringe_ts_1.Token);
var BToken = (function (_super) {
    __extends(BToken, _super);
    function BToken() {
        _super.apply(this, arguments);
    }
    return BToken;
})(syringe_ts_1.Token);
var A = (function () {
    function A(one) {
        this.one = one;
    }
    return A;
})();
var B = (function () {
    function B(a) {
        this.a = a;
    }
    return B;
})();
// Should pass
syringe_ts_1.bind(OneToken).toFactory(function (two) { return two - 1; }, TwoToken);
// Should fail - factory parameter without token
syringe_ts_1.bind(OneToken).toFactory(function (two) { return two - 1; });
// Should fail -- `StringToken` has type string, not number
syringe_ts_1.bind(StringToken).toFactory(function () { return 5; });
// Should fail -- `two` is not an array
syringe_ts_1.bind(OneToken).toFactory(function (two) { return two.split(','); }, TwoToken);
// Should fail -- `ThreeToken` has type number, not string
syringe_ts_1.bind(ThreeToken).toValue('a');
// Should pass
syringe_ts_1.bind(TwoToken).toValue(2);
// Should pass
syringe_ts_1.bind(OneToken).toAsyncFactory(function (two) { return Promise.resolve(two - 1); }, TwoToken);
// Should fail -- async factory parameter without token
syringe_ts_1.bind(OneToken).toAsyncFactory(function (two) { return Promise.resolve(two - 1); });
// Should fail -- `OneToken` has type number, not string
syringe_ts_1.bind(OneToken).toAsyncFactory(function () { return Promise.resolve('a'); });
// Should fail -- async factory doesn't return `Thenable`
syringe_ts_1.bind(OneToken).toAsyncFactory(function (two) { return two - 1; }, TwoToken);
// Should fail (but doesn't at the moment :( ))
syringe_ts_1.bind(AToken).toClass(A);
// Should pass
syringe_ts_1.bind(AToken).toClass(A, OneToken);
// Should fail -- A's ctor's parameter is of type number, not string
syringe_ts_1.bind(AToken).toClass(A, StringToken);
// Should fail -- B's ctor's parameter is of type number, not string
syringe_ts_1.bind(BToken).toClass(B, StringToken);
// Should fail because B is not A
syringe_ts_1.bind(AToken).toClass(B);
var DecoratedA = (function () {
    function DecoratedA(one) {
        this.one = one;
    }
    DecoratedA = __decorate([
        syringe_ts_1.Inject(OneToken)
    ], DecoratedA);
    return DecoratedA;
})();
var DecoratedAToken = (function (_super) {
    __extends(DecoratedAToken, _super);
    function DecoratedAToken() {
        _super.apply(this, arguments);
    }
    return DecoratedAToken;
})(syringe_ts_1.Token);
// Should pass
syringe_ts_1.bind(DecoratedAToken).toClass(DecoratedA);
syringe_ts_1.bind(DecoratedAToken).toClass(DecoratedA, OneToken);
// Should fail -- DecoratedA's ctor's parameter is of type number, not string
syringe_ts_1.bind(DecoratedAToken).toClass(DecoratedA, StringToken);
// Should fail -- DecoratedA2's ctor's parameter is of type number, not string
var DecoratedA2Token = (function (_super) {
    __extends(DecoratedA2Token, _super);
    function DecoratedA2Token() {
        _super.apply(this, arguments);
    }
    return DecoratedA2Token;
})(syringe_ts_1.Token);
var DecoratedA2 = (function () {
    function DecoratedA2(one) {
        this.one = one;
    }
    DecoratedA2 = __decorate([
        syringe_ts_1.Inject(StringToken)
    ], DecoratedA2);
    return DecoratedA2;
})();
// Should fail but doesn't
var DecoratedA3Token = (function (_super) {
    __extends(DecoratedA3Token, _super);
    function DecoratedA3Token() {
        _super.apply(this, arguments);
    }
    return DecoratedA3Token;
})(syringe_ts_1.Token);
var DecoratedA3 = (function () {
    function DecoratedA3(one) {
        this.one = one;
    }
    DecoratedA3 = __decorate([
        syringe_ts_1.Inject(OneToken, StringToken)
    ], DecoratedA3);
    return DecoratedA3;
})();
