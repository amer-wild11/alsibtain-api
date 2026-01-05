import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const fieldErrors: Record<string, string[]> = {};

        const mapErrors = (errs: any[], parentPath = '') => {
          errs.forEach((error) => {
            const propertyPath = parentPath
              ? `${parentPath}.${error.property}`
              : error.property;

            if (error.constraints) {
              fieldErrors[propertyPath] = Object.values(error.constraints);
            }

            if (error.children && error.children.length > 0) {
              mapErrors(error.children, propertyPath);
            }
          });
        };

        mapErrors(errors);

        return new BadRequestException({
          message: 'Validation failed',
          fieldErrors,
        });
      },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

bootstrap();
