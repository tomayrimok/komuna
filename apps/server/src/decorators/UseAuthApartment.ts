import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/AuthGuard';
import { ApartmentAccessGuard } from '../guards/ApartmentGuard';

/**
 * Decorator to apply authentication and apartment access guards.
 * This is used for routes that require both authentication and apartment access.
 */
export function UseAuthApartment() {
  return applyDecorators(UseGuards(AuthGuard, ApartmentAccessGuard));
}
