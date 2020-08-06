import { decoratorWithParams } from '@ember-decorators/utils/decorator';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';

import { registerDisposable } from 'ember-lifeline';

import { afterMethod } from 'patch-method';

import { Prototype } from './utils/type-helpers';

export default decoratorWithParams(function disposable<
  Target extends Prototype<EmberObject>
>(
  target: Target,
  _key: keyof Target,
  desc: PropertyDescriptor
): PropertyDescriptor {
  assert(
    `The '@disposable' decorator can only be used on methods.`,
    typeof desc.value === 'function'
  );

  afterMethod(target.constructor, 'init', function () {
    // `.bind` is required because ember-lifeline does not set the correct context
    registerDisposable(this, desc.value.bind(this));
  });

  return desc;
});
