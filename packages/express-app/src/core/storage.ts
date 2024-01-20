import { AsyncLocalStorage } from 'async_hooks';
import { RequestContext } from './interfaces';

interface LocalStorage<T = any> extends AsyncLocalStorage<T> {
  getStore(): T;
}

export const Storage = new AsyncLocalStorage<RequestContext>() as LocalStorage<RequestContext>;
