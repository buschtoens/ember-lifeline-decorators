import {
  decoratorWithRequiredParams,
  MethodDescriptor
} from '@ember-decorators/utils/decorator';
import { addEventListener } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import ANONYMOUS from './utils/anonymous-field';

export default decoratorWithRequiredParams(function(
  desc: MethodDescriptor,
  [eventTarget, eventName, options]: [EventTarget, string, object?]
) {
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
          addEventListener(
            this,
            // @ts-ignore https://github.com/ember-lifeline/ember-lifeline/pull/249
            eventTarget,
            eventName,
            desc.descriptor.value,
            options
          );
        }
      }
    ],
    finisher: hookDisposablesRunner
  };
});
