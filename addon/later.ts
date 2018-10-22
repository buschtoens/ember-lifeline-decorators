import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { runTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';

export default decoratorWithRequiredParams(function(
  target: EmberObject,
  _key: string,
  desc: PropertyDescriptor,
  [timeout]: [number]
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject) {
      return runTask(this, originalMethod, timeout);
    };
  }
  return desc;
});
