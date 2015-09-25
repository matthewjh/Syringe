import {IToken} from './token';
import {ILazy} from './lazy';

// For envs that lack Function#name
const FALLBACK_TOKEN_DEBUG_NAME = 'Token';

export interface IToken<T> {
	new(): Token<T>;
	getDebugName(): string;
}

/**
 * A token is an abstract representation of a dependency of a given type.
 */
export class Token<T> {
	surrogate: T;
	
	constructor() {
		throw new Error(`Do not instantiate Token directly. Instead create tokens by subclassing or by using Token.create`);
	}
	
	/**
	 * Get a human-readable name for the token for debugging purposes.
	 */
	static getDebugName(): string {		
		return this.name || FALLBACK_TOKEN_DEBUG_NAME;
	}
	
	/**
	 * Create a token.
	 * @param {string} [debugName] A human-readable name for the token for debugging purposes.
	 */
	static create<T>(debugName = FALLBACK_TOKEN_DEBUG_NAME): IToken<T> {
		return createInlineToken<T>(debugName);
	}
}

/**
 * Create an inline token with a given debug name.
 * @param {string} debugName A human-readable name for the token for debugging purposes.
 */
function createInlineToken<T>(debugName: string): IToken<T> {
  return class InlineToken extends Token<T> {
    static getDebugName(): string {
      return debugName; 
    }
  }
}
