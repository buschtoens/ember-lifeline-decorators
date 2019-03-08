import { FieldDescriptor, Kind } from '@ember-decorators/utils/decorator';

// https://github.com/babel/babel/issues/9068

const ANONYMOUS: Pick<FieldDescriptor, 'kind' | 'key' | 'descriptor'> = {
  kind: 'field' as Kind.Field,
  key: Symbol('anonymous'),
  descriptor: {
    configurable: false,
    enumerable: false,
    writable: false,
    value: undefined
  }
};

export default ANONYMOUS;
