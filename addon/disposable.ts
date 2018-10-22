import EmberObject from '@ember/object';
import { registerDisposable } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { PropertiesOfType } from './utils/type-helpers';

export default function disposable<
  O extends EmberObject,
  K extends PropertiesOfType<O, () => any>,
  OriginalMethod extends Extract<O[K], () => any>
>(target: O, _key: K, desc: PropertyDescriptor) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod: OriginalMethod = desc.value;
    desc.value = function(this: EmberObject) {
      return registerDisposable(this, originalMethod);
    };
  }
  return desc;
}
