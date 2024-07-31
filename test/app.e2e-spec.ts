import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    describe("signup", () => {
      it.todo("should sign up");
    });

    describe("signin", () => {});
  });

  describe("User", () => {
    describe("get me", () => {});

    describe("create user", () => {});

    describe("edit user", () => {});
  });

  describe("Bookmark", () => {
    describe("create bookmark", () => {});

    describe("get bookmarks", () => {});

    describe("get bookmark by id", () => {});

    describe("edit bookmark", () => {});

    describe("delete bookmark", () => {});
  });
});
