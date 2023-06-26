import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import admin from 'firebase-admin';

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers['x-auth-token'];
    if (token != null && token != '') {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { email } = decodedToken;
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      req.user = user;
    }
    next();
  }
}
