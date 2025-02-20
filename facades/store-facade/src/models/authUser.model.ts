import {Entity, model, property} from '@loopback/repository';
import { EntityWithIdentifier, IAuthUser } from 'loopback4-authentication';

@model({
    name: 'users',
  })
  export class User extends Entity implements IAuthUser {
    @property({
      type: 'string',
      id: true,
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
    })
    username: string;
  
    @property({
      type: 'string',
    })
    email?: string;
  
    @property({
      type: 'string',
    })
    password?: string;

    @property({
        type: 'string',
        required: true,
        jsonSchema: {
          enum: ["superAdmin", "admin", "subscriber"], // Ensures only valid enum values are accepted
        },
      })
      role: string;

     getIdentifier(): string | undefined {
         return this.id
     } 
  
    constructor(data?: Partial<User>) {
      super(data);
    }
  }