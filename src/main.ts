import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/error.filter';
import { TransformInterceptor } from './interceptors/transform.intrerceptor';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  // setup config service
  const configService = app.get(ConfigService);

  app.use(helmet());

  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/']
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Starts listening for shutdown hooks
  if (configService.get('app.envName') !== 'development') {
    app.enableShutdownHooks();
  }

  // setup the api documentation
  setupSwagger(app);

  // listen to app
  await app.listen(configService.get('app.port'));
  console.log(
    `Application server listening on port ${configService.get('app.port')}`
  );
}
bootstrap();
