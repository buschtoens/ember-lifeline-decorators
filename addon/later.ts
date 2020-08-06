import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';

import { runTask } from 'ember-lifeline';

import hookDisposablesRunner from './hook-disposables-runner';
import { Prototype } from './utils/type-helpers';

export default decoratorWithRequiredParams(function later<
  Target extends Prototype<EmberObject>
>(
  target: Target,
  _key: keyof Target,
  desc: PropertyDescriptor,
  [timeout]: [number]
) {
  assert(
    `The '@later' decorator can only be used on methods.`,
    typeof desc.value === 'function'
  );

  hookDisposablesRunner(target.constructor);

  return {
    ...desc,
    value(this: InstanceType<typeof target.constructor>, ...args: any[]) {
      return runTask(this, desc.value.bind(this, ...args), timeout);
    }
  };
});
