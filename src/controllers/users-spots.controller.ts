import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Users,
  Spots,
} from '../models';
import {UsersRepository} from '../repositories';

export class UsersSpotsController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) { }

  @get('/users/{id}/spots', {
    responses: {
      '200': {
        description: 'Spots belonging to Users',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Spots)},
          },
        },
      },
    },
  })
  async getSpots(
    @param.path.number('id') id: typeof Users.prototype.userId,
  ): Promise<Spots> {
    return this.usersRepository.spots(id);
  }
}
