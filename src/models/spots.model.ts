import { Entity, model, property, hasOne } from '@loopback/repository';
import { Reservations, ReservationsWithRelations } from './reservations.model';
import { UsersWithRelations, Users } from './users.model';

@model()
export class Spots extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  spotId?: number;

  @property({
    type: 'number',
  })
  spotGroup?: number;

  @property({
    type: 'string',
  })
  spotName?: string;

  @property({
    type: 'number',
  })
  spotStatus?: number;

  @hasOne(() => Users, { keyTo: 'userSpotId' })
  user?: Users;


  @hasOne(() => Reservations, { keyTo: 'spotsSpotId' })
  reservation?: Reservations;

  constructor(data?: Partial<Spots>) {
    super(data);
  }
}

export interface SpotsRelations {
  // describe navigational properties here
  user?: UsersWithRelations;
  reservation?: ReservationsWithRelations;
}

export type SpotsWithRelations = Spots & SpotsRelations;
