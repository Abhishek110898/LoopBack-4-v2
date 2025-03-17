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

import {
  NotificationsComponent,
  NotificationBindings,
} from 'loopback4-notifications';
import {
  NodemailerProvider,
  NodemailerBindings,
} from 'loopback4-notifications/nodemailer';


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
      max:15
    });

    this.component(RateLimiterComponent);
    

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(AuthenticationBindings.USER_MODEL).to(User);

    this.component(NotificationsComponent);

    this.bind(NotificationBindings.Config).to({
      sendToMultipleReceivers: false,
      senderEmail: 'support@myapp.com',
    });

    this.bind(NodemailerBindings.Config).to({
      pool: true,
      maxConnections: 100,
      url: '',
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'alf51@ethereal.email',
        pass: 'mmQr8TzT2Fa3VyN52v',
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    this.bind(NotificationBindings.EmailProvider).toProvider(
      NodemailerProvider,
    );

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
