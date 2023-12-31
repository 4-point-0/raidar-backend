import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const bearer = request.headers['authorization'];

    if (!bearer) return false;

    let token = bearer.split(' ')[1];

    if (token && token.includes(',')) {
      token = token.replace(',', '');
      request.headers['authorization'] = `Bearer ${token}`;
    }

    return super.canActivate(context);
  }
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
