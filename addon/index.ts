import EmberObject from '@ember/object';
import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import {
  addEventListener,
  runTask,
  scheduleTask,
  debounceTask,
  throttleTask,
  registerDisposable,
  runDisposables
} from 'ember-lifeline';

type RunLoopQueue = 'actions' | 'routerTransitions' | 'render' | 'destroy';

const hookedWithDisposables = new WeakSet<EmberObject>();

function hookDisposablesRunner(target: EmberObject) {
  if (hookedWithDisposables.has(target)) return;
  hookedWithDisposables.add(target);

  const originalMethod = target.willDestroy;
  target.willDestroy = function() {
    runDisposables(this);
    if (originalMethod) {
      return originalMethod.apply(this, arguments);
    }
  };
}

export const later = decoratorWithRequiredParams(function(
  target: EmberObject,
  key: string,
  desc: PropertyDescriptor,
  [timeout]: [number]
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject) {
      return runTask(this, originalMethod, timeout);
    };
  }
  return desc;
});

export const schedule = decoratorWithRequiredParams(function(
  target: EmberObject,
  key: string,
  desc: PropertyDescriptor,
  [queue]: [RunLoopQueue]
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject, ...args: any[]) {
      return scheduleTask(this, queue, originalMethod, ...args);
    };
  }
  return desc;
});

export const debounce = decoratorWithRequiredParams(function(
  target: EmberObject,
  key: string,
  desc: PropertyDescriptor,
  [wait, immediate]: [number, boolean]
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject, ...args: any[]) {
      return debounceTask(this, originalMethod, ...args, wait, immediate);
    };
  }
  return desc;
});

export const throttle = decoratorWithRequiredParams(function(
  target: EmberObject,
  key: string,
  desc: PropertyDescriptor,
  [spacing, immediate]: [number, boolean]
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject, ...args: any[]) {
      return throttleTask(this, originalMethod, ...args, spacing, immediate);
    };
  }
  return desc;
});

export const eventListener = decoratorWithRequiredParams(function(
  target: EmberObject,
  key: string,
  desc: PropertyDescriptor,
  [element, eventName, options]: [HTMLElement, string, object?]
) {
  hookDisposablesRunner(target);
  addEventListener(target, element, eventName, desc.value, options);
  return desc;
});

export const disposable = function(
  target: EmberObject,
  key: string,
  desc: PropertyDescriptor
) {
  hookDisposablesRunner(target);

  if (desc) {
    const originalMethod = desc.value;
    desc.value = function(this: EmberObject) {
      return registerDisposable(this, originalMethod);
    };
  }
  return desc;
};
