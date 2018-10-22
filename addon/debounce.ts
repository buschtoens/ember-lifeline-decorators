import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { debounceTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';

export default decoratorWithRequiredParams(function(
  target: EmberObject,
  _key: string,
  desc: PropertyDescriptor,
  [wait, immediate]: [number, boolean]
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject, ...args: any[]) {
      return debounceTask(this, originalMethod, ...args, wait, immediate);
    };
  }
  return desc;
});
