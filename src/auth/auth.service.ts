import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { createUserInFirebase } from '../lib/firebaseAdmin';
import { Msg } from './interfaces/auth.interface';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: AuthDto): Promise<Msg> {
    let firebaseUser: UserRecord;
    try {
      await this.prisma.$transaction(async (tx) => {
        if (!dto.firebaseUid) {
          const firebaseRes = await createUserInFirebase(dto);
          if (!firebaseRes.success) {
            return { message: firebaseRes.message };
          }
          firebaseUser = firebaseRes.firebaseUser as UserRecord;
        }

        await tx.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            firebaseUid: firebaseUser?.uid || dto.firebaseUid,
          },
        });
      });
      return { message: 'ok' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }
}
