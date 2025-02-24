import {  FindRoute, InvokeMethod,  ParseParams, Reject, RequestContext, Send, SequenceHandler, MiddlewareSequence, SequenceActions, HttpErrors } from '@loopback/rest';
import { AuthenticateFn, AuthenticationBindings } from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
  UserPermissionsFn,
  AuthorizationMetadata,
} from 'loopback4-authorization';
import {Getter, inject} from '@loopback/core';
import { User } from './models/authUser.model';

export class MySequence implements SequenceHandler {
    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject,
        @inject(AuthenticationBindings.USER_AUTH_ACTION)
        protected authenticateRequest: AuthenticateFn<User>,
        @inject(AuthorizationBindings.AUTHORIZE_ACTION)
        protected checkAuthorisation: AuthorizeFn,
      ) {}
    
      async handle(context: RequestContext) {
        try {
          const {request, response} = context;
    
          const route = this.findRoute(request);
          const args = await this.parseParams(request, route);
          request.body = args[args.length - 1];
          const authUser: User = await this.authenticateRequest(request);
          const isAccessAllowed: boolean = await this.checkAuthorisation(
            [authUser?.role], // do authUser.permissions if using method #1
            request,
          );
          // Checking access to route here
          if (!isAccessAllowed) {
            throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
          }
          const result = await this.invoke(route, args);
          this.send(response, result);
        } catch (err) {
          this.reject(context, err);
        }
      }

}
