import {Token} from './token';

export class CyclicDependencyError extends Error { 
  public name: string = 'CyclicDependencyError';
  public message: string;
  
  constructor() {
    super();
  }
}