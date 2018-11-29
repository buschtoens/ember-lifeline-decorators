import {
  decoratorWithRequiredParams,
  MethodDescriptor
} from '@ember-decorators/utils/decorator';
import { runTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';

export default decoratorWithRequiredParams(function(
  desc: MethodDescriptor,
  [timeout]: [number]
) {
  assert(
    `The '@later' decorator can only be used on methods.`,
    desc.kind === 'method'
  );

  return {
    ...desc,
    descriptor: {
      ...desc.descriptor,
      value: function(this: EmberObject, ...args: any[]) {
        return runTask(
          this,
          desc.descriptor.value.bind(this, ...args),
          timeout
        );
      }
    },
    finisher: hookDisposablesRunner
  };
});
