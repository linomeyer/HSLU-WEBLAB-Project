import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwksUri = configService.get<string>('AUTH0_JWKS_URI');
    const audience = configService.get<string>('AUTH0_AUDIENCE');
    const issuer = configService.get<string>('AUTH0_ISSUER');

    if (!jwksUri || !audience || !issuer) {
      throw new Error(
        'Missing required Auth0 configuration. Please check your .env file.',
      );
    }

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwksUri,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: audience,
      issuer: issuer,
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
