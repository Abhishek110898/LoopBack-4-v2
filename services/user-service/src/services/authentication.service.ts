import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import {UserRepository} from '../repositories/user.repository';
import {User} from '../models';

export class AuthService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async login(email: string, password: string): Promise<{token: string}> {
    // Find user by email
    const user = await this.userRepository.findOne({where: {email}});

    if (!user || !user.password) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {expiresIn: '1h'}
    );

    return {token};
  }
}
