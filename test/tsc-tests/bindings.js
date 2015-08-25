///<reference path="../../built/src/syringe.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
// Should fail -- A's ctor's parameter is of type number, not string
syringe_ts_1.bind(BToken).toClass(B, StringToken);
// Should fail because B is not A
syringe_ts_1.bind(AToken).toClass(B);
