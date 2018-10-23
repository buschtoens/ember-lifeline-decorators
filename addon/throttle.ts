import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { throttleTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { PropertiesOfType } from './utils/type-helpers';
import afterInit from './utils/after-init';

export default decoratorWithRequiredParams(function<
  O extends EmberObject,
  K extends PropertiesOfType<O, (...args: any[]) => any>,
  OriginalMethod extends Extract<O[K], (...args: any[]) => any>
>(
  target: O,
  _key: K,
  desc: PropertyDescriptor,
  [spacing, _immediate = true]: [number, boolean?]
): PropertyDescriptor {
  if (desc) {
    const originalMethod: OriginalMethod = desc.value;
    desc.value = function(this: O, ...args: Parameters<OriginalMethod>) {
      return throttleTask(
        this,
        originalMethod.bind(this, ...args),
        spacing
        // @TODO: https://github.com/ember-lifeline/ember-lifeline/issues/133
        // immediate
      );
    };
    afterInit(target, function() {
      hookDisposablesRunner(this);
    });
  }
  return desc;
});
