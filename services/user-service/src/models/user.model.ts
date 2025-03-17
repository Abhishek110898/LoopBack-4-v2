import {Entity, model, property} from '@loopback/repository';

function formattedDate() {
  return function (target: any, key: string) {
    let value: string | undefined;

    const getter = function () {
      return value ? new Date(value).toISOString() : value;
    };

    const setter = function (newVal: string | Date) {
      value = new Date(newVal).toISOString();
    };

    Object.defineProperty(target, key, {
      get: getter, // Calls `getter()` when the property is accessed
      set: setter, // Calls `setter()` when the property is modified
      enumerable: true,
      configurable: true,
    });
  };
}

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ["SuperAdmin", "Admin", "Subscriber"], // Ensures only valid enum values are accepted
    },
  })
  role: string;

  @property({
    type: 'string',
    required: true,
    unique: true
  })
  email?: string;

  @property({
    type: 'string',
    required: true
  })
  password?: string;

  @property({
    type: 'string',
    default: () => new Date().toISOString(),
    required: false
  })
  @formattedDate()
  createdOn: string;

  @property({
    type: 'string',
    default: () => new Date().toISOString(),
    required: false
  })
  @formattedDate()
  modifiedOn: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
