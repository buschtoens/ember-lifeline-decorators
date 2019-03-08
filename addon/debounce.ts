import {
  decoratorWithRequiredParams,
  MethodDescriptor
} from '@ember-decorators/utils/decorator';
import { debounceTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';
import privateAlias from './utils/private-alias';

export default decoratorWithRequiredParams(function(
  desc: MethodDescriptor,
  [wait, immediate = false]: [number, boolean?]
) {
  assert(
    `The '@debounce' decorator may only be used on methods.`,
    desc.kind === 'method'
  );

  return {
    ...privateAlias(
      desc,
      alias =>
        function(this: EmberObject, ...args: any[]) {
          return debounceTask(this, alias, ...args, wait, immediate);
        }
    ),
    finisher: hookDisposablesRunner
  };
});
