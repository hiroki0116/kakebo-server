import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as admin from 'firebase-admin';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('FIREBASE_PRIVATE_KEY'),
    });
  }

  async validate(payload: admin.auth.DecodedIdToken): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        firebaseUid: payload.uid,
      },
    });
    return user;
  }
}
