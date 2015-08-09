import {Token} from './token';

export class CyclicDependencyError extends Error { 
  public name = 'CyclicDependencyError';
  public message: string;
  
  constructor() {
    super();
  }
}

export class NoBoundTokenError extends Error { 
  public name = 'NoBoundTokenError';
  public message = 'No bound token found during a token lookup. Check that all of your dependencies are bound';
  
  constructor() {
    super();
  }
}