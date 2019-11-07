import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { Reservations, ReservationsRelations, Spots } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { SpotsRepository } from './spots.repository';

export class ReservationsRepository extends DefaultCrudRepository<
  Reservations,
  typeof Reservations.prototype.reservationId,
  ReservationsRelations
  > {

  public readonly spots: BelongsToAccessor<
    Spots,
    typeof Reservations.prototype.reservationId
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('SpotsRepository')
    protected spotsRepositoryGetter: Getter<SpotsRepository>,
  ) {
    super(Reservations, dataSource);

    this.spots = this.createBelongsToAccessorFor(
      'spotsSpot',
      spotsRepositoryGetter,
    );

    this.registerInclusionResolver(
      'spots',
      this.spots.inclusionResolver
    );
  }
}
