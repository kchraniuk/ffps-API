import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {
  TokenServiceBindings,
  UserServiceBindings,
  TokenServiceConstants,
} from './keys';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MyAuthenticationSequence } from './sequence';
import { AuthenticationComponent } from '@loopback/authentication';
import { PasswordHasherBindings } from './keys';
import { BcryptHasher } from './services/hash.password.bcryptjs';
import { registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTAuthenticationStrategy } from './authentication-strategies/jwt-strategy';
import { JWTService } from './services/jwt-service';
import { MyUserService } from './services/user-service';
import { SECURITY_SCHEME_SPEC, SECURITY_SPEC } from './utils/security-spec';

import { HttpServer } from '@loopback/http-server';
import * as express from 'express';
import { WebSocketController } from './controllers/websocket.controller';
import { WebSocketServer } from './websocket.server';

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

const pkg: PackageInfo = require('../package.json');

export class FpsApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {

  readonly httpServer: HttpServer;
  readonly wsServer: WebSocketServer;

  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.api({
      openapi: '3.0.0',
      info: { title: pkg.name, version: pkg.version },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/' }],
      security: SECURITY_SPEC
    });

    this.setUpBindings();

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });

    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    // Set up the custom sequence
    this.sequence(MyAuthenticationSequence);

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


    //   /** begining of websocket server implementation */

    //   /**
    //    * Create an Express app to serve the home page
    //    */
    //   const expressApp = express();
    //   const root = path.resolve(__dirname, '../../public');
    //   expressApp.use('/', express.static(root));

    //   // Create an http server backed by the Express app
    //   this.httpServer = new HttpServer(expressApp, options.websocket);

    //   // Create ws server from the http server
    //   const wsServer = new WebSocketServer(this.httpServer);
    //   this.bind('servers.websocket.server1').to(wsServer);
    //   wsServer.use((socket, next) => {
    //     console.log('Global middleware - socket:', socket.id);
    //     next();
    //   });

    //   // Add a route
    //   const ns = wsServer.route(WebSocketController, /^\/spots\/\d+$/);
    //   ns.use((socket, next) => {
    //     console.log(
    //       'Middleware for namespace %s - socket: %s',
    //       socket.nsp.name,
    //       socket.id,
    //     );
    //     next();
    //   });
    //   this.wsServer = wsServer;
  }

  // start() {
  //   return this.wsServer.start();
  // }

  // stop() {
  //   return this.wsServer.stop();
  // }

  setUpBindings(): void {

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // Bind bcrypt hash services - utilized by 'UserController' and 'MyUserService'
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }
}
