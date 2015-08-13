import {Token} from './token';

export class CyclicDependencyError extends Error { 
  public name = 'CyclicDependencyError';
  public message: string;
}

export class NoBoundTokenError extends Error { 
  public name = 'NoBoundTokenError';
  public message = 'No bound token found during a token lookup. Check that all of your dependencies are bound';
}

export class MissingBindingError extends Error { 
  public name = 'MissingBindingError';
  public bindingIndex: number;
  public message: string;
  
  constructor(bindingIndex: number) {
    super();
    
    this.bindingIndex = bindingIndex;
    this.message = `Injector created with missing dependency for binding at index ${bindingIndex} of passed bindings array. Check the binding at this index an ensure that it's dependencies are bound within the injector hierachy`;
  }
}