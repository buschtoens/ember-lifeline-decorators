import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';

import { addEventListener } from 'ember-lifeline';

import { afterMethod } from 'patch-method';

import { Prototype, Constructor } from './utils/type-helpers';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-empty-function
function NOOP(): void {}

function collapseProto(target: Prototype<EmberObject>) {
  // We must collapse the superclass prototype to make sure that the `actions`
  // object will exist. Since collapsing doesn't generally happen until a class is
  // instantiated, we have to do it manually.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof target.constructor.proto === 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    object?
  ]
): PropertyDescriptor {
  assert(
    `The '@eventListener' decorator can only be used on methods.`,
    typeof desc.value === 'function'
  );

  collapseProto(target);

  afterMethod(
    target.constructor as Constructor<Component>,
    typeof target.constructor.prototype.didInsertElement === 'function'
      ? 'didInsertElement'
      : 'init',
    function () {
      addEventListener(
        this,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
