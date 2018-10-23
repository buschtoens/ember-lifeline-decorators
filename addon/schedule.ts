import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { scheduleTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { PropertiesOfType } from './utils/type-helpers';
import afterInit from './utils/after-init';

/**
 * Scheduling in the `afterRender` queue is bad for performance.
 *
 * @see https://github.com/ember-lifeline/ember-lifeline/blob/9842853ae600c0652531962f679a0900ba289eec/addon/run-task.ts#L128-L131
 */
type RunLoopQueue = Exclude<EmberRunQueues, 'afterRender'>;

export default decoratorWithRequiredParams(function<
  O extends EmberObject,
  K extends PropertiesOfType<O, (...args: any[]) => any>,
  OriginalMethod extends Extract<O[K], (...args: any[]) => any>
>(
  target: O,
  _key: K,
  desc: PropertyDescriptor,
  [queue]: [RunLoopQueue]
) {
  if (desc) {
    const originalMethod: OriginalMethod = desc.value;
    desc.value = function(this: O, ...args: Parameters<OriginalMethod>) {
      return scheduleTask(this, queue, originalMethod, ...args);
    };
    afterInit(target, function() {
      hookDisposablesRunner(this);
    });
  }
  return desc;
});
