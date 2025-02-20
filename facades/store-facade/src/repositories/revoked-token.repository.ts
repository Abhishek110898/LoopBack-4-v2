import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import {RedisDataSource} from '../datasources/redis.datasource';
import {RevokedToken} from '../models/revoked-token.model';

export class RevokedTokenRepository extends DefaultKeyValueRepository<
  RevokedToken
> {
  constructor(
    @inject('datasources.redis') dataSource: RedisDataSource,
  ) {
    super(RevokedToken, dataSource);
  }
}
