import EmberObject from '@ember/object';
import { runDisposables } from 'ember-lifeline';

const hookedWithDisposables = new WeakSet<EmberObject>();

export default function hookDisposablesRunner(target: EmberObject) {
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
