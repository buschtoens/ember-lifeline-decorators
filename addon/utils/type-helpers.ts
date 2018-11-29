/**
 * All values on the object `Obj`.
 */
export type Values<Obj> = Obj[keyof Obj];

/**
 * All keys of `Obj` that have a value of type `T`.
 */
export type PropertiesOfType<Obj, T> = Values<
  { [K in keyof Obj]: Obj[K] extends T ? K : never }
>;
