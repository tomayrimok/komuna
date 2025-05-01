import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/AuthGuard';

export function UseAuth() {
  return applyDecorators(UseGuards(AuthGuard));
}
