import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Spots, SpotsWithRelations } from './spots.model';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class Users extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  userId: number;

  @property({
    type: 'number',
  })
  userGroup?: number;

  @property({
    type: 'string',
  })
  userPassword: string;

  @property({
    type: 'string',
  })
  userFirstName?: string;

  @property({
    type: 'string',
  })
  userLastName?: string;

  @property({
    type: 'string',
  })
  userEmail: string;

  @property({
    type: 'string',
  })
  userDescription?: string;

  @property({
    type: 'number',
  })
  userStatus?: number;

  @belongsTo(() => Spots)
  userSpotId: number;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
  spots?: SpotsWithRelations;
}

export type UsersWithRelations = Users & UsersRelations;
