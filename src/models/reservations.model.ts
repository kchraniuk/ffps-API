import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Spots, SpotsWithRelations } from './spots.model';

@model()
export class Reservations extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  reservationId?: number;

  @property({
    type: 'number',
  })
  reservationUserId?: number;

  @property({
    type: 'date',
  })
  reservationDateFrom?: string;

  @property({
    type: 'date',
  })
  reservationDateTo?: string;

  @property({
    type: 'date',
  })
  reservationDate?: string;

  @property({
    type: 'number',
  })
  reservationStatus?: number;

  @belongsTo(() => Spots)
  spotsSpotId: number;

  constructor(data?: Partial<Reservations>) {
    super(data);
  }
}

export interface ReservationsRelations {
  // describe navigational properties here
  spots?: SpotsWithRelations;
}

export type ReservationsWithRelations = Reservations & ReservationsRelations;
