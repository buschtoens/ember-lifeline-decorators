import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { addEventListener } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';

export default decoratorWithRequiredParams(function(
  target: EmberObject,
  _key: string,
  desc: PropertyDescriptor,
  [element, eventName, options]: [EventTarget, string, object?]
) {
  hookDisposablesRunner(target);
  // @ts-ignore typing is incorrect upstream
  addEventListener(target, element, eventName, desc.value, options);
  return desc;
});
