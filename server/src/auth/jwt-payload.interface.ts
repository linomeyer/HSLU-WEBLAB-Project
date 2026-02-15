export interface JwtPayload {
  'https://technology-radar.com/roles'?: string[];
  sub?: string;
  iat?: number;
  exp?: number;
  aud?: string | string[];
  iss?: string;
}
