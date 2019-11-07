// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import { HttpErrors } from '@loopback/rest';
import { Credentials, UsersRepository } from '../repositories/users.repository';
import { Users } from '../models/users.model';
import { UserService } from '@loopback/authentication';
import { UserProfile, securityId } from '@loopback/security';
import { repository } from '@loopback/repository';
import { PasswordHasher } from './hash.password.bcryptjs';
import { PasswordHasherBindings } from '../keys';
import { inject } from '@loopback/context';

export class MyUserService implements UserService<Users, Credentials> {
  constructor(
    @repository(UsersRepository) public userRepository: UsersRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<Users> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: { userEmail: credentials.userEmail },
    });
    console.log('credentials', credentials);
    console.log('foundUser -> ', foundUser);


    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    console.log(credentials.userPassword + ' <-> ' + foundUser.userPassword);


    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.userPassword,
      foundUser.userPassword,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: Users): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    let userName = '';

    if (user.userFirstName)
      userName = `${user.userFirstName}`;

    if (user.userLastName)
      userName = user.userFirstName
        ? `${userName} ${user.userLastName}`
        : `${user.userLastName}`;

    return { [securityId]: user.userId.toString(), name: userName };
  }
}
