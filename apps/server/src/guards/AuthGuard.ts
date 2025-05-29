import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserJwtPayload } from '../user/dto/jwt-user.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // canActivate will be executed whenever a protected route is hit
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from cookies (Authentication is the cookie name, change as needed)
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      // Verify the token (you can also add a secret here or get from config)
      const payload: UserJwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload;

      return true;
    } catch (error) {
      Logger.error('Error in AuthGuard:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Helper function to extract token from the cookies
  private extractTokenFromCookie(request: Request): string | undefined {
    // Change 'Authentication' to whatever your cookie name is
    const token = request.cookies?.['Authentication'];
    return token;
  }
}
