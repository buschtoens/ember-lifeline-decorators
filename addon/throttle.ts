import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { throttleTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { PropertiesOfType } from './utils/type-helpers';

export default decoratorWithRequiredParams(function<
  O extends EmberObject,
  K extends PropertiesOfType<O, (...args: any[]) => any>,
  OriginalMethod extends Extract<O[K], (...args: any[]) => any>
>(
  target: O,
  _key: K,
  desc: PropertyDescriptor,
  [spacing, immediate = true]: [number, boolean?]
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod: OriginalMethod = desc.value;
    desc.value = function(this: O, ...args: Parameters<O>) {
      return throttleTask(this, originalMethod.bind(this, ...args), spacing, immediate);
    };
  }
  return desc;
});
