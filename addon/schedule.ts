import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';

import { scheduleTask } from 'ember-lifeline';

import hookDisposablesRunner from './hook-disposables-runner';
import { Prototype } from './utils/type-helpers';

/**
 * Scheduling in the `afterRender` queue is bad for performance.
 *
 * @see https://github.com/ember-lifeline/ember-lifeline/blob/9842853ae600c0652531962f679a0900ba289eec/addon/run-task.ts#L128-L131
 */
type RunLoopQueue = Exclude<EmberRunQueues, 'afterRender'>;

export default decoratorWithRequiredParams(function schedule<
  Target extends Prototype<EmberObject>
>(
  target: Target,
  _key: keyof Target,
  desc: PropertyDescriptor,
  [queue]: [RunLoopQueue]
) {
  assert(
    `The '@schedule' decorator can only be used on methods.`,
    typeof desc.value === 'function'
  );

  hookDisposablesRunner(target.constructor);

  return {
    ...desc,
    value(this: InstanceType<typeof target.constructor>, ...args: any[]) {
      return scheduleTask(this, queue, desc.value.bind(this, ...args), ...args);
    }
  };
});
