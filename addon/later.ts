import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { runTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { PropertiesOfType } from './utils/type-helpers';
import afterInit from './utils/after-init';

export default decoratorWithRequiredParams(function<
  O extends EmberObject,
  K extends PropertiesOfType<O, (...args: any[]) => any>,
  OriginalMethod extends Extract<O[K], (...args: any[]) => any>
>(target: O, _key: K, desc: PropertyDescriptor, [timeout]: [number]) {
  if (desc) {
    const originalMethod: OriginalMethod = desc.value;
    desc.value = function(this: O, ...args: Parameters<OriginalMethod>) {
      return runTask(this, originalMethod.bind(this, ...args), timeout);
    };
    afterInit(target, function() {
      hookDisposablesRunner(this);
    });
  }
  return desc;
});
