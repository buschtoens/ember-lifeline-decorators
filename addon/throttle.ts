import {
  decoratorWithRequiredParams,
  MethodDescriptor
} from '@ember-decorators/utils/decorator';
import { throttleTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';
import privateAlias from './utils/private-alias';

export default decoratorWithRequiredParams(function(
  desc: MethodDescriptor,
  [spacing, immediate = true]: [number, boolean?]
) {
  assert(
    `The '@throttle' decorator can only be used on methods.`,
    desc.kind === 'method'
  );

  return {
    ...privateAlias(
      desc,
      alias =>
        function(this: EmberObject, ...args: any[]) {
          return throttleTask(this, alias, ...args, spacing, immediate);
        }
    ),
    finisher: hookDisposablesRunner
  };
});
