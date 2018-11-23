import {
  decoratorWithRequiredParams,
  MethodDescriptor
} from '@ember-decorators/utils/decorator';
import { scheduleTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';

/**
 * Scheduling in the `afterRender` queue is bad for performance.
 *
 * @see https://github.com/ember-lifeline/ember-lifeline/blob/9842853ae600c0652531962f679a0900ba289eec/addon/run-task.ts#L128-L131
 */
type RunLoopQueue = Exclude<EmberRunQueues, 'afterRender'>;

export default decoratorWithRequiredParams(function(
  desc: MethodDescriptor,
  [queue]: [RunLoopQueue]
) {
  assert(
    `The '@schedule' decorator can only be used on methods.`,
    desc.kind === 'method'
  );

  return {
    ...desc,
    descriptor: {
      ...desc.descriptor,
      value: function(this: O, ...args: Parameters<OriginalMethod>) {
        return scheduleTask(
          this,
          queue,
          desc.descriptor.value.bind(this, ...args),
          ...args
        );
      }
    },
    finisher: hookDisposablesRunner
  };
});
