import {
  MethodDescriptor,
  MethodDecoratorReturnValue
} from '@ember-decorators/utils/decorator';

export default function privateAlias(
  desc: MethodDescriptor,
  makeValue: (alias: string) => any
): MethodDecoratorReturnValue {
  const privateKey = `__${String(desc.key)}-${Math.random()
    .toString(36)
    .slice(2)}`;

  return {
    ...desc,
    descriptor: {
      ...desc.descriptor,
      value: makeValue(privateKey)
    },
    extras: [
      {
        ...desc,
        key: privateKey,
        descriptor: {
          ...desc.descriptor,
          configurable: false,
          enumerable: false,
          writable: false
        }
      }
    ]
  };
}
