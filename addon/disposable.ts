import { registerDisposable } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import { afterMethod } from 'patch-method';
import EmberObject from '@ember/object';
import { Prototype } from './utils/type-helpers';
import { decoratorWithParams } from '@ember-decorators/utils/decorator';

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

  hookDisposablesRunner(target.constructor);

  afterMethod(target.constructor, 'init', function() {
    // `.bind` is required because ember-lifeline does not set the correct context
    registerDisposable(this, desc.value.bind(this));
  });

  return desc;
});
