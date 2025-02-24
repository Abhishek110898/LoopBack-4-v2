import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import { AuthenticationComponent, AuthenticationBindings, Strategies } from 'loopback4-authentication';
import { User } from './models/authUser.model';
import { BearerTokenVerifyProvider } from './providers/auth.provider';
import { AuthorizationBindings, AuthorizationComponent } from 'loopback4-authorization';
import { RateLimiterComponent, RateLimitSecurityBindings } from 'loopback4-ratelimiter';


export {ApplicationConfig};

export class StoreFacadeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
  

    //add authentication component
    this.component(AuthenticationComponent)

    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    )

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer', '/', '/favicon.ico'],
    });
    this.component(AuthorizationComponent);

    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'redis',
      type: 'RedisStore',
      max:5
    });

    this.component(RateLimiterComponent);
    

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(AuthenticationBindings.USER_MODEL).to(User);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
