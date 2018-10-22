import EmberObject from '@ember/object';
import { registerDisposable } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';

export default function(
  target: EmberObject,
  _key: string,
  desc: PropertyDescriptor
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject) {
      return registerDisposable(this, originalMethod);
    };
  }
  return desc;
}
