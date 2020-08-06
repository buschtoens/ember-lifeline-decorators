import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';

import { debounceTask } from 'ember-lifeline';

import privateAlias from './utils/private-alias';
import { Prototype } from './utils/type-helpers';

export default decoratorWithRequiredParams(function debounce<
  Target extends Prototype<EmberObject>
>(
  target: Target,
  key: keyof Target,
  desc: PropertyDescriptor,
  [wait, immediate = false]: [number, boolean?]
) {
  assert(
    `The '@debounce' decorator can only be used on methods.`,
    typeof desc.value === 'function'
  );

  return privateAlias(
    target,
    key,
    desc,
    alias =>
      function (this: InstanceType<typeof target.constructor>, ...args: any[]) {
        return debounceTask(this, alias, ...args, wait, immediate);
      }
  );
});
