import {Token} from './token';

export class CyclicDependencyError extends Error { 
  public name = 'CyclicDependencyError';
  public message: string;
  
  constructor(tokenChain: Syringe.IToken<any>[]) {
    super();
    this.message = tokenChain.map(t => t.getDebugName()).join(' -> ');
  }
}

export class NoBoundTokenError extends Error { 
  public name = 'NoBoundTokenError';
  
  constructor(token: Syringe.IToken<any>) {
    super();
    this.message = `Tried to get ${token.getDebugName()} from an injector, but it's not bound.`;
  }
}