// eslint-disable-next-line @typescript-eslint/ban-types
export default function privateAlias<Target extends object>(
  target: Target,
  key: keyof Target,
  desc: PropertyDescriptor,
  makeValue: (alias: string) => any
): PropertyDescriptor {
  const privateKey = `__${String(key)}-${Math.random().toString(36).slice(2)}`;

  Object.defineProperty(target, privateKey, {
    ...desc,
    configurable: false,
    enumerable: false,
    writable: false
  });

  return {
    ...desc,
    value: makeValue(privateKey)
  };
}
