/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */

import { Chance } from 'chance';
import { Connection } from 'typeorm';
import { ClassType } from './interfaces';

class Registery {
  private chanceInstance: Chance.Chance;

  private connection!: Connection;

  constructor(private container: { [x: string]: FactoryFN<unknown> } = {}) {
    this.chanceInstance = new Chance(Math.random);
  }

  private _builder<U>(model: ClassType<U>): FactoryFN<U> {
    return this.container[model.prototype.constructor.name] as FactoryFN<U>;
  }

  public setConnection(c: Connection): void {
    this.connection = c;
  }

  public register<U>(model: ClassType<U>, factory: FactoryFN<U>): void {
    this.container[model.prototype.constructor.name] = factory;
  }

  public make<U>(model: ClassType<U>, override?: Partial<U>): U {
    const builder = this._builder(model);
    return builder({ ch: this.chanceInstance, override: override });
  }
}

export const factoryRegistery = new Registery();
export declare type FactoryRegistery = typeof factoryRegistery;
export declare type FactoryFN<U> = ({ ch, override }: { ch: Chance.Chance; override?: Partial<U> }) => U;
