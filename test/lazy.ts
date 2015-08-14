// /// <reference path="../definitions/definitions.d.ts"/>
// /// <reference path="../definitions/api.d.ts"/>

// import 'es6-promise';
// import {Injector, Inject, Token, bind} from '../src/index';

// let OneToken = new Token<number>();
// let TwoToken = new Token<number>();
// let ThreeToken = new Token<number>();
// let classToken = new Token<ClassWithLazyDependency>();

// @Inject(OneToken.asLazy)
// class ClassWithLazyDependency {
//   constructor(private _one: Syringe.ILazy<number>) {}
  
//   get one(): Promise<number> {
//     return this._one.get();
//   }
// }

// describe('injector with lazy dependencies', () => {
//   it('should correctly handle lazy dependencies', (done) => {
//     let oneFactoryCallCount = 0;
//     let bindings = [
//       bind(OneToken).toFactory(() => {
//         oneFactoryCallCount++;
//         return 1;
//       }),
//       bind(classToken).toClass(ClassWithLazyDependency)
//     ];
    
//     let injector = new Injector(bindings);
    
//     injector.get(classToken).then(clazz => {
//       expect(oneFactoryCallCount).toBe(0);
      
//       return clazz.one;
//     }).then((oneValue) => {
//       expect(oneFactoryCallCount).toBe(1);
//       expect(oneValue).toBe(1);
      
//       return injector.get(classToken)
//     }).then(clazz => {
//       return clazz.one;
//     }).then((oneValue) => {
//       // Check that the factory has still been called only once
//       expect(oneFactoryCallCount).toBe(1);
//       expect(oneValue).toBe(1);
      
//       done();
//     });
//   });
// });