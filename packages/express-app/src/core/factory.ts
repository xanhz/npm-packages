import { ExpressApplication } from './application';
import { IExpressApplication } from './interfaces';

export class ApplicationFactory {
  public static create(): IExpressApplication {
    return new ExpressApplication();
  }
}
