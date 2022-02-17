import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Rent-a-car')
    .setDescription('The Rent-a-car API description')
    .setVersion('1.0')
    .build();
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'API Rent-a-car',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, customOptions);

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000, () => {
    console.log(`Server is up and listening on port 3000`);
    
  });
};
bootstrap();
