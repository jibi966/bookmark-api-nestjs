import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // this will white lise all properties other than defined in types
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
