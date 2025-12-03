import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  const corsOptions = {
    credentials: true,
    origin: true, // Consider specifying the exact origins instead of true for security in production
    optionsSuccessStatus: 200,
  };

  app.setGlobalPrefix(globalPrefix);
  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (error) =>
            `${error.property} has failed constraints: ${Object.values(
              errors,
            ).join(', ')}`,
        );
        return new BadRequestException(messages);
      },
    }),
  );

  const port = 8000;
  await app.listen(port);
  Logger.log(
    ` Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
