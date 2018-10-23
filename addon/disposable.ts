import EmberObject from '@ember/object';
import { registerDisposable } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { PropertiesOfType } from './utils/type-helpers';
import afterInit from './utils/after-init';

export default function disposable<
  O extends EmberObject,
  K extends PropertiesOfType<O, () => any>,
  OriginalMethod extends Extract<O[K], () => any>
>(target: O, _key: K, desc: PropertyDescriptor): PropertyDescriptor {
  if (desc) {
    const originalMethod: OriginalMethod = desc.value;
    afterInit(target, function() {
      hookDisposablesRunner(this);

      // `.bind` is required because ember-lifeline does not set the correct context
      registerDisposable(this, originalMethod.bind(this));
    });
  }
  return desc;
}
