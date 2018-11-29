import EmberObject from '@ember/object';
import { Constructor } from 'ts-std';

type FieldDecorator = PropertyDecorator;

export enum Placement {
  Static = 'static',
  Prototype = 'prototype',
  Own = 'own'
}

export enum Kind {
  Field = 'field',
  Method = 'method',
  Class = 'class'
}

export type Descriptor<K extends Kind = any> = K extends Kind.Field
  ? FieldDescriptor
  : K extends Kind.Method
  ? MethodDescriptor
  : K extends Kind.Class
  ? ClassDescriptor
  : unknown;
export type KindOfDescriptor<D extends Descriptor> = D extends Descriptor<
  infer K
>
  ? K
  : unknown;

export type Decorator<K extends Kind = any> = K extends Kind.Field
  ? FieldDecorator
  : K extends Kind.Method
  ? MethodDecorator
  : K extends Kind.Class
  ? ClassDecorator
  : unknown;
export type KindOfDecorator<D extends Decorator> = D extends Decorator<infer K>
  ? K
  : unknown;

export type DecoratorReturnValue<K extends Kind = any> = K extends Kind.Field
  ? FieldDecoratorReturnValue
  : K extends Kind.Method
  ? MethodDecoratorReturnValue
  : K extends Kind.Class
  ? ClassDecoratorReturnValue
  : unknown;
export type KindOfDecoratorReturnValue<
  D extends DecoratorReturnValue
> = D extends DecoratorReturnValue<infer K> ? K : unknown;

// export function decorator<K extends Kind>(
//   decorator: (desc: Descriptor<K>) => DecoratorReturnValue<K>
// ): Decorator<K>;

export function decorator<K extends Kind.Field>(
  decorator: (desc: Descriptor<K>) => DecoratorReturnValue<K>
): Decorator<K>;
export function decorator<K extends Kind.Method>(
  decorator: (desc: Descriptor<K>) => DecoratorReturnValue<K>
): Decorator<K>;
export function decorator<K extends Kind.Class>(
  decorator: (desc: Descriptor<K>) => DecoratorReturnValue<K>
): Decorator<K>;

// export function decoratorWithRequiredParams<K extends Kind, Args extends any[]>(
//   decorator: (desc: Descriptor<K>, args: Args) => DecoratorReturnValue<K>
// ): (...args: Args) => Decorator<K>;

export function decoratorWithRequiredParams<
  K extends Kind.Field,
  Args extends any[]
>(
  decorator: (desc: Descriptor<K>, args: Args) => DecoratorReturnValue<K>
): (...args: Args) => Decorator<K>;
export function decoratorWithRequiredParams<
  K extends Kind.Method,
  Args extends any[]
>(
  decorator: (desc: Descriptor<K>, args: Args) => DecoratorReturnValue<K>
): (...args: Args) => Decorator<K>;
export function decoratorWithRequiredParams<
  K extends Kind.Class,
  Args extends any[]
>(
  decorator: (desc: Descriptor<K>, args: Args) => DecoratorReturnValue<K>
): (...args: Args) => Decorator<K>;

// export function decoratorWithParams<K extends Kind, Args extends any[]>(
//   decorator: (desc: Descriptor<K>, args: Args) => FieldDecoratorReturnValue
// ): (...args: Args) => Decorator<K> | Decorator<K>;

export function decoratorWithParams<K extends Kind.Field, Args extends any[]>(
  decorator: (desc: Descriptor<K>, args: Args) => FieldDecoratorReturnValue
): (...args: Args) => Decorator<K> | Decorator<K>;
export function decoratorWithParams<K extends Kind.Method, Args extends any[]>(
  decorator: (desc: Descriptor<K>, args: Args) => FieldDecoratorReturnValue
): (...args: Args) => Decorator<K> | Decorator<K>;
export function decoratorWithParams<K extends Kind.Class, Args extends any[]>(
  decorator: (desc: Descriptor<K>, args: Args) => FieldDecoratorReturnValue
): (...args: Args) => Decorator<K> | Decorator<K>;

interface FieldDescriptor {
  kind: Kind.Field;
  key: string | Symbol;
  placement: Placement;
  descriptor: PropertyDescriptor;
  initializer(): unknown;
}

interface FieldDecoratorReturnValue extends FieldDescriptor {
  extras?: (Descriptor | Initializer)[];
  finisher?(klass: Constructor<any>): void;
}

interface MethodDescriptor {
  kind: Kind.Method;
  key: string | Symbol;
  placement: Placement;
  descriptor: PropertyDescriptor;
}

interface MethodDecoratorReturnValue extends MethodDescriptor {
  extras?: (Descriptor | Initializer)[];
  finisher?(klass: Constructor<any>): void;
}

interface ClassDescriptor {
  kind: Kind.Class;
  elements: any[];
}

interface ClassDecoratorReturnValue extends ClassDescriptor {
  finisher?(klass: Constructor<any>): void;
}

interface Initializer {
  kind: 'initializer';
  placement: Placement;
  initializer(): unknown;
}
