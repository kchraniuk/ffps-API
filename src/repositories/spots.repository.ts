import { DefaultCrudRepository, repository, HasOneRepositoryFactory } from '@loopback/repository';
import { Spots, SpotsRelations, Reservations, Users } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ReservationsRepository } from './reservations.repository';
import { UsersRepository } from './users.repository';

export class SpotsRepository extends DefaultCrudRepository<
  Spots,
  typeof Spots.prototype.spotId,
  SpotsRelations
  > {

  public readonly reservation: HasOneRepositoryFactory<
    Reservations,
    typeof Spots.prototype.spotId
  >;

  public readonly user: HasOneRepositoryFactory<
    Users,
    typeof Spots.prototype.spotId
  >;

  constructor(
    @inject('datasources.db')
    dataSource: DbDataSource,

    @repository.getter('ReservationsRepository')
    protected reservationsRepositoryGetter: Getter<ReservationsRepository>,

    @repository.getter('UsersRepository')
    protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Spots, dataSource);

    this.reservation = this.createHasOneRepositoryFactoryFor(
      'reservation',
      reservationsRepositoryGetter,
    );

    this.registerInclusionResolver(
      'reservation',
      this.reservation.inclusionResolver
    );

    this.user = this.createHasOneRepositoryFactoryFor(
      'user',
      usersRepositoryGetter,
    );

    this.registerInclusionResolver(
      'user',
      this.user.inclusionResolver
    );
  }
}
