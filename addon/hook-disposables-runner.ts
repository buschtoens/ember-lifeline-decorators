import EmberObject from '@ember/object';
import { runDisposables } from 'ember-lifeline';

const hookedWithDisposables = new WeakSet<EmberObject>();

export default function hookDisposablesRunner(klass: EmberObject): void {
  if (hookedWithDisposables.has(klass)) return;
  hookedWithDisposables.add(klass);

  const { prototype } = klass;

  const originalMethod = Object.getOwnPropertyDescriptor(
    prototype,
    'willDestroy'
  );
  prototype.willDestroy = function() {
    runDisposables(this);
    if (originalMethod) {
      return originalMethod.value.apply(this, arguments);
    }
  };
}
