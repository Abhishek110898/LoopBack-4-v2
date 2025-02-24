import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {User} from '../models/authUser.model';
import { RevokedTokenRepository } from '../repositories';
import { HttpErrors } from '@loopback/rest';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async token => {
        if (!token){
            throw new HttpErrors.Unauthorized('Unauthorized');
        }

      if (token && (await this.revokedTokenRepository.get(token))) {
        throw new HttpErrors.Unauthorized('Token Revoked');
      }
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as User;
      return user;
    };
  }
}