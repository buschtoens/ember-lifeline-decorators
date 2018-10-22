import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { scheduleTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { PropertiesOfType } from './utils/type-helpers';

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
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod: OriginalMethod = desc.value;
    desc.value = function(this: O, ...args: Parameters<OriginalMethod>) {
      return scheduleTask(this, queue, originalMethod, ...args);
    };
  }
  return desc;
});
