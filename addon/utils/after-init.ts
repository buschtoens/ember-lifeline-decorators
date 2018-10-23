import EmberObject from '@ember/object';

export default function afterInit<C extends EmberObject>(
  Class: C,
  hook: (this: C) => void
): void {
  const originalInit = Class.init;
  Class.init = function() {
    const returnValue = originalInit.apply(this, arguments);
    hook.apply(this, arguments);
    return returnValue;
  };
}
