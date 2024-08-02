import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";
import { EditUser } from "../src/user/types";

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
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl("http://localhost:3333");
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    const body = {
      email: "jibin@gmail.com",
      password: "123",
    };
    describe("signup", () => {
      it("should throw error email is empty", () => {
        return pactum.spec().post("/auth/signup").withBody({ pasword: body.password }).expectStatus(400);
      });
      it("should throw error password is empty", () => {
        return pactum.spec().post("/auth/signup").withBody({ email: body.email }).expectStatus(400);
      });
      it("should throw error if body is empty", () => {
        return pactum.spec().post("/auth/signup").expectStatus(400);
      });
      it("should sign up", () => {
        return pactum.spec().post("/auth/signup").withBody(body).expectStatus(201);
      });
    });

    describe("signin", () => {
      it("should throw error email is empty", () => {
        return pactum.spec().post("/auth/signin").withBody({ pasword: body.password }).expectStatus(400);
      });
      it("should throw error password is empty", () => {
        return pactum.spec().post("/auth/signin").withBody({ email: body.email }).expectStatus(400);
      });
      it("should throw error if body is empty", () => {
        return pactum.spec().post("/auth/signin").expectStatus(400);
      });
      it("should sign in", () => {
        return pactum.spec().post("/auth/signin").withBody(body).expectStatus(200).stores("token", "access_token");
      });
    });
  });

  describe("User", () => {
    describe("get me", () => {
      it("should get current user", () => {
        return pactum.spec().get("/users/me").withBearerToken("$S{token}").expectStatus(200);
      });
    });

    describe("edit user", () => {
      it("should get current user", () => {
        const body: EditUser = {
          email: "jibin@codewithme.com",
          firstName: "Jibin",
        };
        return pactum
          .spec()
          .patch("/users")
          .withBearerToken("$S{token}")
          .withBody(body)
          .expectStatus(200)
          .expectBodyContains(body.email)
          .expectBodyContains(body.firstName);
      });
    });
  });

  describe("Bookmark", () => {
    describe("create bookmark", () => {});

    describe("get bookmarks", () => {});

    describe("get bookmark by id", () => {});

    describe("edit bookmark by id", () => {});

    describe("delete bookmark by id", () => {});
  });
});
