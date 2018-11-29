import {
  decoratorWithRequiredParams,
  MethodDescriptor
} from '@ember-decorators/utils/decorator';
import { throttleTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';

export default decoratorWithRequiredParams(function(
  desc: MethodDescriptor,
  [spacing]: [number]
) {
  assert(
    `The '@throttle' decorator can only be used on methods.`,
    desc.kind === 'method'
  );

  return {
    ...desc,
    descriptor: {
      ...desc.descriptor,
      value: function(this: EmberObject, ...args: any[]) {
        return throttleTask(
          this,
          desc.descriptor.value.bind(this, ...args),
          spacing
          // @TODO: https://github.com/ember-lifeline/ember-lifeline/issues/133
          // immediate
        );
      }
    },
    finisher: hookDisposablesRunner
  };
});
