import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';

export const User = createParamDecorator<undefined, ExecutionContext, UserJwtPayload>((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
