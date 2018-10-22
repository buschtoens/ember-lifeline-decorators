import EmberObject from '@ember/object';

export function decoratorWithRequiredParams<Args extends any[]>(
  fn: (
    target: EmberObject,
    key: string,
    desc: PropertyDescriptor,
    ...args: Args
  ) => PropertyDescriptor
): (...args: Args) => MethodDecorator;
