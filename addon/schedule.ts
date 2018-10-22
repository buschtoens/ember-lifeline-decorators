import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { scheduleTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';

type RunLoopQueue = Exclude<EmberRunQueues, 'afterRender'>;

export default decoratorWithRequiredParams(function(
  target: EmberObject,
  _key: string,
  desc: PropertyDescriptor,
  [queue]: [RunLoopQueue]
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject, ...args: any[]) {
      return scheduleTask(this, queue, originalMethod, ...args);
    };
  }
  return desc;
});
