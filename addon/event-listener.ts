import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import EmberObject from '@ember/object';
import { addEventListener } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { PropertiesOfType } from './utils/type-helpers';

export default decoratorWithRequiredParams(function<
  O extends EmberObject,
  K extends PropertiesOfType<O, (event: Event) => any>,
  OriginalMethod extends Extract<O[K], (event: Event) => any>
>(
  target: O,
  _key: K,
  desc: PropertyDescriptor,
  [eventTarget, eventName, options]: [EventTarget, string, object?]
) {
  hookDisposablesRunner(target);
  addEventListener(
    target,
    // @ts-ignore https://github.com/ember-lifeline/ember-lifeline/pull/249
    eventTarget,
    eventName,
    desc.value as OriginalMethod,
    options
  );
  return desc;
});
