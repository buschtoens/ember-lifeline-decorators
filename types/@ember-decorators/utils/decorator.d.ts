import EmberObject from '@ember/object';
import { Constructor } from 'ember-lifeline-decorators/utils/type-helpers';

export function decorator(
  decorator: (desc: FieldDescriptor) => FieldDescriptorReturnValue
): FieldDescriptorReturnValue;

export function decorator(
  decorator: (desc: MethodDescriptor) => MethodDescriptorReturnValue
): MethodDescriptorReturnValue;

export function decorator(
  decorator: (desc: ClassDescriptor) => ClassDescriptorReturnValue
): ClassDescriptorReturnValue;

export function decoratorWithRequiredParams<Args extends any[]>(
  decorator: (desc: FieldDescriptor, args: Args) => FieldDescriptorReturnValue
): FieldDescriptorReturnValue;

export function decoratorWithRequiredParams<Args extends any[]>(
  decorator: (desc: MethodDescriptor, args: Args) => MethodDescriptorReturnValue
): MethodDescriptorReturnValue;

export function decoratorWithRequiredParams<Args extends any[]>(
  decorator: (desc: ClassDescriptor, args: Args) => ClassDescriptorReturnValue
): ClassDescriptorReturnValue;

type Descriptor = FieldDescriptor | MethodDescriptor | ClassDescriptor;

interface FieldDescriptor {
  kind: 'field';
  key: string | Symbol;
  placement: 'static' | 'prototype' | 'own';
  descriptor: PropertyDescriptor;
  initializer(): unknown;
}

interface FieldDescriptorReturnValue extends FieldDescriptor {
  extras?: (Descriptor | Initializer)[];
  finisher?(klass: Constructor<any>): void;
}

interface MethodDescriptor {
  kind: 'method';
  key: string | Symbol;
  placement: 'static' | 'prototype' | 'own';
  descriptor: PropertyDescriptor;
}

interface MethodDescriptorReturnValue extends MethodDescriptor {
  extras?: (Descriptor | Initializer)[];
  finisher?(klass: Constructor<any>): void;
}

interface ClassDescriptor {
  kind: 'class';
  elements: any[];
}

interface ClassDescriptorReturnValue extends ClassDescriptor {
  finisher?(klass: Constructor<any>): void;
}

interface Initializer {
  kind: 'initializer';
  placement: 'static' | 'prototype' | 'own';
  initializer(): unknown;
}
