import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Reservations,
  Spots,
} from '../models';
import {ReservationsRepository} from '../repositories';

export class ReservationsSpotsController {
  constructor(
    @repository(ReservationsRepository)
    public reservationsRepository: ReservationsRepository,
  ) { }

  @get('/reservations/{id}/spots', {
    responses: {
      '200': {
        description: 'Spots belonging to Reservations',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Spots)},
          },
        },
      },
    },
  })
  async getSpots(
    @param.path.number('id') id: typeof Reservations.prototype.reservationId,
  ): Promise<Spots> {
    return this.reservationsRepository.spots(id);
  }
}
