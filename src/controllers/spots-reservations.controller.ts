import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  relation,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
  getFilterSchemaFor,
} from '@loopback/rest';
import {
  Spots,
  Reservations,
} from '../models';
import { SpotsRepository } from '../repositories';

export class SpotsReservationsController {
  constructor(
    @repository(SpotsRepository) protected spotsRepository: SpotsRepository,
  ) { }

  // @get('/spots/{id}/reservations', {
  //   responses: {
  //     '200': {
  //       description: 'Array of Reservations\'s belonging to Spots',
  //       content: {
  //         'application/json': {
  //           schema: { type: 'array', items: getModelSchemaRef(Reservations) },
  //         },
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.path.number('id') id: number,
  //   @param.query.object('filter') filter?: Filter<Reservations>,
  // ): Promise<Reservations[]> {
  //   return this.spotsRepository.reservations(id).find({ include: [{ relation: 'reservations' }] });
  //   // return this.spotsRepository.reservations.;
  // }



  @get('/spots/{id}/reservations', {
    responses: {
      '200': {
        description: 'Array of Reservations\'s belonging to Spots',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Spots) },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Spots)) filter?: Filter<Spots>,
  ): Promise<Spots[]> {
    return this.spotsRepository.find(filter);
  }







  @post('/spots/{id}/reservations', {
    responses: {
      '200': {
        description: 'Spots model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Reservations) } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Spots.prototype.spotId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservations, {
            title: 'NewReservationsInSpots',
            exclude: ['reservationId'],
            optional: ['spotsSpotId']
          }),
        },
      },
    }) reservations: Omit<Reservations, 'reservationId'>,
  ): Promise<Reservations> {
    return this.spotsRepository.reservation(id).create(reservations);
  }

  @patch('/spots/{id}/reservations', {
    responses: {
      '200': {
        description: 'Spots.Reservations PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservations, { partial: true }),
        },
      },
    })
    reservations: Partial<Reservations>,
    @param.query.object('where', getWhereSchemaFor(Reservations)) where?: Where<Reservations>,
  ): Promise<Count> {
    return this.spotsRepository.reservation(id).patch(reservations, where);
  }

  @del('/spots/{id}/reservations', {
    responses: {
      '200': {
        description: 'Spots.Reservations DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Reservations)) where?: Where<Reservations>,
  ): Promise<Count> {
    return this.spotsRepository.reservation(id).delete(where);
  }
}
