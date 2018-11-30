import EmberObject from '@ember/object';
import { runDisposables } from 'ember-lifeline';
import { Constructor } from './utils/type-helpers';

const hookedWithDisposables = new WeakSet<Constructor<EmberObject>>();

export default function hookDisposablesRunner(
  klass: Constructor<EmberObject>
): void {
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
