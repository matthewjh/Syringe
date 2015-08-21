import 'es6-promise';
import {Injector, Inject, Token, Lazy, ILazy, bind} from '../src/index';

class OneToken extends Token<number> {}
class TwoToken extends Token<number> {}
class ThreeToken extends Token<number> {}
class ClassToken extends Token<ClassWithLazyDependency> {}
 
@Inject(Lazy(OneToken), Lazy(TwoToken))
class ClassWithLazyDependency {
  constructor(private _one: ILazy<number>,
              private _two: ILazy<number>) {}
  
  get three(): Promise<number> {
    return Promise.all([
      this._one.get(),
      this._two.get()
    ]).then(([one, two]) => one + two);
  }
}

describe('injector with lazy dependencies', () => {
  it('should correctly handle lazy dependencies', (done) => {
    let oneFactoryCallCount = 0;
    let bindings = [
      bind(OneToken).toFactory(() => {
        oneFactoryCallCount++;
        return 1;
      }),
      bind(TwoToken).toValue(2),
      bind(ClassToken).toClass(ClassWithLazyDependency)
    ];
    
    let injector = new Injector(bindings);
    
    injector.get(ClassToken).then(clazz => {
      expect(oneFactoryCallCount).toBe(0);
      
      return clazz.three;
    }).then((threeValue) => {
      expect(oneFactoryCallCount).toBe(1);
      expect(threeValue).toBe(3);
      
      return injector.get(ClassToken)
    }).then(clazz => {
      return clazz.three;
    }).then((threeValue) => {
      // Check that the factory has still been called only once
      expect(oneFactoryCallCount).toBe(1);
      expect(threeValue).toBe(3);
      
      done();
    }).catch(e => {
      console.error(e);
    });
  });
});