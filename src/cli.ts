import 'dotenv/config';
import { CommandFactory } from 'nest-commander';
import { CliModule } from '@/infrastructure/frameworks/nestjs/cli/cli.module';

async function bootstrap() {
  await CommandFactory.run(CliModule, {
    logger: ['log', 'warn', 'error'],
  });
}

void bootstrap();
