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
  public message = 'Injector created with missing binding. Check factory binding dependencies to ensure that they are all present within the injector hierachy';
}