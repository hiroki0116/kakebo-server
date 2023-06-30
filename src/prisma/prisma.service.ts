import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    const models = Reflect.ownKeys(this).filter(
      (key) =>
        typeof key === 'string' &&
        key[0] !== '_' &&
        key[0] !== '$' &&
        !key.toString().includes('Symbol('),
    ) as string[];

    await Promise.all(
      models.map(async (modelKey) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await this[modelKey]?.deleteMany?.();
      }),
    );
  }
}
