import {
  decoratorWithRequiredParams,
  MethodDescriptor
} from '@ember-decorators/utils/decorator';
import { addEventListener } from 'ember-lifeline';
import hookDisposablesRunner from './hook-disposables-runner';
import { assert } from '@ember/debug';
import ANONYMOUS from './utils/anonymous-field';
import EmberObject from '@ember/object';
import { beforeMethod } from 'patch-method';
import Component from '@ember/component';
import { Constructor } from 'ts-std';

function NOOP() {}

export default decoratorWithRequiredParams(function(
  desc: MethodDescriptor,
  [eventTarget, eventName, options]: [
    EventTarget | ((this: Component, obj: Component) => EventTarget),
    string,
    object?
  ]
) {
  assert(
    `The '@eventListener' decorator can only be used on methods.`,
    desc.kind === 'method'
  );

  if (typeof eventTarget === 'function') {
    return {
      ...desc,
      finisher(Class: Constructor<EmberObject>) {
        beforeMethod(
          Class as Constructor<Component>,
          Class.prototype instanceof Component ? 'didInsertElement' : 'init',
          function() {
            addEventListener(
              this,
              // @ts-ignore https://github.com/ember-lifeline/ember-lifeline/pull/249
              eventTarget.call(this, this),
              eventName,
              desc.descriptor.value,
              options
            );
          },
          NOOP
        );
        hookDisposablesRunner(Class);
      }
    };
  }

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
    ]
  };
});
