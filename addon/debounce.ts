import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { debounceTask } from 'ember-lifeline';
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
  [wait, immediate = false]: [number, boolean?]
): PropertyDescriptor {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod: OriginalMethod = desc.value;
    desc.value = function(this: O, ...args: Parameters<OriginalMethod>) {
      return debounceTask(
        this,
        // @ts-ignore https://github.com/ember-lifeline/ember-lifeline/pull/248
        originalMethod,
        ...args,
        wait,
        immediate
      );
    };
  }
  return desc;
});
