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
import { Spots, Reservations } from '../models';
import { SpotsRepository } from '../repositories';

export class SpotsController {
  constructor(
    @repository(SpotsRepository)
    public spotsRepository: SpotsRepository,
  ) { }

  @post('/spots', {
    responses: {
      '200': {
        description: 'Spots model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Spots) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Spots, {
            title: 'NewSpots',
            exclude: ['spotId'],
          }),
        },
      },
    })
    spots: Omit<Spots, 'spotId'>,
  ): Promise<Spots> {
    return this.spotsRepository.create(spots);
  }

  @get('/spots/count', {
    responses: {
      '200': {
        description: 'Spots model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Spots)) where?: Where<Spots>,
  ): Promise<Count> {
    return this.spotsRepository.count(where);
  }

  @get('/spots', {
    responses: {
      '200': {
        description: 'Array of Spots model instances',
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

  @patch('/spots', {
    responses: {
      '200': {
        description: 'Spots PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Spots, { partial: true }),
        },
      },
    })
    spots: Spots,
    @param.query.object('where', getWhereSchemaFor(Spots)) where?: Where<Spots>,
  ): Promise<Count> {
    return this.spotsRepository.updateAll(spots, where);
  }
  //example with filter GET http://[::1]/spots/2?filter[include][][relation]=reservation
  //we can use 'user' or 'reservation' relation
  @get('/spots/{id}', {
    responses: {
      '200': {
        description: 'Spots model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Spots) } },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Reservations>,
  ): Promise<Spots> {
    return this.spotsRepository.findById(id, filter);
  }

  @patch('/spots/{id}', {
    responses: {
      '204': {
        description: 'Spots PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Spots, { partial: true }),
        },
      },
    })
    spots: Spots,
  ): Promise<void> {
    await this.spotsRepository.updateById(id, spots);
  }

  @put('/spots/{id}', {
    responses: {
      '204': {
        description: 'Spots PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() spots: Spots,
  ): Promise<void> {
    await this.spotsRepository.replaceById(id, spots);
  }

  @del('/spots/{id}', {
    responses: {
      '204': {
        description: 'Spots DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.spotsRepository.deleteById(id);
  }
}
