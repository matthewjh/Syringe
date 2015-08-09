# Syringe
`npm install syringe.ts --save-dev`

# Usage

````typescript
import {Injector, Token, bind} from '../src/index';

interface ILog {
  info(...msgs: string[]): void;
}

let logToken = new Token<ILog>();
	
class MyLog implements ILog {
  info(...msgs: string[]): void {
    console.log(...msgs);
  }
}		

let injector = new Injector([
  bind(logToken).toClass(MyLog)
]);

injector.get(logToken).then(log => {
  log.info('Hi!');
});
````