import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';

import { throttleTask } from 'ember-lifeline';

import hookDisposablesRunner from './hook-disposables-runner';
import privateAlias from './utils/private-alias';
import { Prototype } from './utils/type-helpers';

export default decoratorWithRequiredParams(function throttle<
  Target extends Prototype<EmberObject>
>(
  target: Target,
  key: keyof Target,
  desc: PropertyDescriptor,
  [spacing, immediate = true]: [number, boolean?]
) {
  assert(
    `The '@throttle' decorator can only be used on methods.`,
    typeof desc.value === 'function'
  );

  hookDisposablesRunner(target.constructor);

  return privateAlias(
    target,
    key,
    desc,
    alias =>
      function (this: InstanceType<typeof target.constructor>, ...args: any[]) {
        return throttleTask(this, alias, ...args, spacing, immediate);
      }
  );
});
