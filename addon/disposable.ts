import { decorator, MethodDescriptor } from '@ember-decorators/utils/decorator';
import { registerDisposable } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import ANONYMOUS from './utils/anonymous-field';

export default decorator(function(desc: MethodDescriptor) {
  assert(
    `The '@disposable' decorator can only be used on methods.`,
    desc.kind === 'method'
  );

  return {
    ...desc,
    extras: [
      {
        // https://github.com/babel/babel/issues/9068
        // kind: 'initializer',
        ...ANONYMOUS,
        placement: 'own',
        initializer() {
          // `.bind` is required because ember-lifeline does not set the correct context
          registerDisposable(this, desc.descriptor.value.bind(this));
        }
      }
    ],
    finisher: hookDisposablesRunner
  };
});
