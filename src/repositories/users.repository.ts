import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { Users, UsersRelations, Spots } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { SpotsRepository } from './spots.repository';

export type Credentials = {
  userEmail: string,
  userPassword: string
};

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.userId,
  UsersRelations
  > {

  public readonly spots: BelongsToAccessor<
    Spots,
    typeof Users.prototype.userId
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('SpotsRepository')
    protected spotsRepositoryGetter: Getter<SpotsRepository>,
  ) {
    super(Users, dataSource);

    this.spots = this.createBelongsToAccessorFor(
      'userSpot',
      spotsRepositoryGetter,
    );

    this.registerInclusionResolver(
      'spots',
      this.spots.inclusionResolver
    );
  }
}
