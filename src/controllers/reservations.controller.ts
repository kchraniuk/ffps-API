import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Reservations} from '../models';
import {ReservationsRepository} from '../repositories';

export class ReservationsController {
  constructor(
    @repository(ReservationsRepository)
    public reservationsRepository : ReservationsRepository,
  ) {}

  @post('/reservations', {
    responses: {
      '200': {
        description: 'Reservations model instance',
        content: {'application/json': {schema: getModelSchemaRef(Reservations)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservations, {
            title: 'NewReservations',
            exclude: ['reservationId'],
          }),
        },
      },
    })
    reservations: Omit<Reservations, 'reservationId'>,
  ): Promise<Reservations> {
    return this.reservationsRepository.create(reservations);
  }

  @get('/reservations/count', {
    responses: {
      '200': {
        description: 'Reservations model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Reservations)) where?: Where<Reservations>,
  ): Promise<Count> {
    return this.reservationsRepository.count(where);
  }

  @get('/reservations', {
    responses: {
      '200': {
        description: 'Array of Reservations model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Reservations)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Reservations)) filter?: Filter<Reservations>,
  ): Promise<Reservations[]> {
    return this.reservationsRepository.find(filter);
  }

  @patch('/reservations', {
    responses: {
      '200': {
        description: 'Reservations PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservations, {partial: true}),
        },
      },
    })
    reservations: Reservations,
    @param.query.object('where', getWhereSchemaFor(Reservations)) where?: Where<Reservations>,
  ): Promise<Count> {
    return this.reservationsRepository.updateAll(reservations, where);
  }

  @get('/reservations/{id}', {
    responses: {
      '200': {
        description: 'Reservations model instance',
        content: {'application/json': {schema: getModelSchemaRef(Reservations)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Reservations> {
    return this.reservationsRepository.findById(id);
  }

  @patch('/reservations/{id}', {
    responses: {
      '204': {
        description: 'Reservations PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reservations, {partial: true}),
        },
      },
    })
    reservations: Reservations,
  ): Promise<void> {
    await this.reservationsRepository.updateById(id, reservations);
  }

  @put('/reservations/{id}', {
    responses: {
      '204': {
        description: 'Reservations PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() reservations: Reservations,
  ): Promise<void> {
    await this.reservationsRepository.replaceById(id, reservations);
  }

  @del('/reservations/{id}', {
    responses: {
      '204': {
        description: 'Reservations DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.reservationsRepository.deleteById(id);
  }
}
