import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('start-up api')
    .setDescription('Api Documentation for start up')
    .setVersion('1.0')
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    'docs',
    app,
    document
    //  {
    //   swaggerOptions: {
    //     persistAuthorization: true
    //   }
    // }
  );
}
