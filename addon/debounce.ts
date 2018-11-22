import {
  decoratorWithRequiredParams,
  MethodDescriptor,
  MethodDescriptorReturnValue
} from '@ember-decorators/utils/decorator';
import { debounceTask } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';

export default decoratorWithRequiredParams(function(
  desc: MethodDescriptor,
  [wait, immediate = false]: [number, boolean?]
): MethodDescriptorReturnValue {
  assert(
    `The '@debounce' decorator may only be used on methods.`,
    desc.kind === 'method'
  );

  return {
    ...desc,
    descriptor: {
      ...desc.descriptor,
      value: function(this: O, ...args: Parameters<OriginalMethod>) {
        return debounceTask(
          this,
          desc.descriptor.value,
          ...args,
          wait,
          immediate
        );
      }
    },
    finisher: hookDisposablesRunner
  };
});
