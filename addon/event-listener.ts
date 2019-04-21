import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import { addEventListener } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';
import { afterMethod } from 'patch-method';
import Component from '@ember/component';
import { Prototype, Constructor } from './utils/type-helpers';

function NOOP(): void {}

function collapseProto(target: Prototype<EmberObject>) {
  // We must collapse the superclass prototype to make sure that the `actions`
  // object will exist. Since collapsing doesn't generally happen until a class is
  // instantiated, we have to do it manually.
  // @ts-ignore
  if (typeof target.constructor.proto === 'function') {
    // @ts-ignore
    target.constructor.proto();
  }
}

export default decoratorWithRequiredParams(function eventListener<
  Target extends Prototype<EmberObject | Component>
>(
  target: Target,
  _key: keyof Target,
  desc: PropertyDescriptor,
  [eventTarget, eventName, options]: [
    EventTarget | ((this: Component, obj: Component) => EventTarget),
    string,
    object?
  ]
): PropertyDescriptor {
  assert(
    `The '@eventListener' decorator can only be used on methods.`,
    typeof desc.value === 'function'
  );

  collapseProto(target);
  hookDisposablesRunner(target.constructor);

  afterMethod(
    target.constructor as Constructor<Component>,
    typeof target.constructor.prototype.didInsertElement === 'function'
      ? 'didInsertElement'
      : 'init',
    function() {
      addEventListener(
        this,
        // @ts-ignore https://github.com/ember-lifeline/ember-lifeline/pull/249
        typeof eventTarget === 'function'
          ? eventTarget.call(this, this)
          : eventTarget,
        eventName,
        desc.value,
        options
      );
    },
    NOOP
  );

  return desc;
});
