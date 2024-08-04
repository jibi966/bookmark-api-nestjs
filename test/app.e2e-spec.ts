import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";
import { EditUser } from "../src/user/types";
import { CreateBookmark, EditBookmark } from "../src/bookmark/types";

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
      it("should edit current user", () => {
        const body: EditUser = {
          lastName: "LastName",
          firstName: "Jibin",
        };
        return pactum
          .spec()
          .patch("/users")
          .withBearerToken("$S{token}") // $S{token} can access in pactum
          .withBody(body)
          .expectStatus(200)
          .expectBodyContains(body.lastName)
          .expectBodyContains(body.firstName);
      });
    });
  });

  describe("Bookmark", () => {
    describe("get empty bookmark", () => {
      it("should return empty bookmark", () => {
        return pactum.spec().get("/bookmarks").withBearerToken("$S{token}").expectStatus(200).expectBody([]);
      });
    });

    describe("create bookmark", () => {
      const body: CreateBookmark = {
        title: "Bookmark 1",
        description: "Bookmark description 1",
        link: "http://github.com",
      };
      it("should create bookmark", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withBearerToken("$S{token}")
          .withBody(body)
          .expectStatus(201)
          .stores("bookmarkId", "id");
      });
    });

    describe("get bookmarks", () => {
      it("should return bookmarks", () => {
        return pactum.spec().get("/bookmarks").withBearerToken("$S{token}").expectStatus(200).expectJsonLength(1);
      });
    });

    describe("get bookmark by id", () => {
      it("should return bookmarks by id", () => {
        return pactum
          .spec()
          .get("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withBearerToken("$S{token}")
          .expectStatus(200)
          .expectBodyContains("$S{bookmarkId}");
      });
    });

    describe("edit bookmark by id", () => {
      const dto: EditBookmark = {
        title: "Bookmark Edit title",
        description: "new Description",
      };
      it("should edit bookmarks by id", () => {
        return pactum
          .spec()
          .patch("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withBearerToken("$S{token}")
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe("delete bookmark by id", () => {
      it("should delete bookmarks by id", () => {
        return pactum
          .spec()
          .delete("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withBearerToken("$S{token}")
          .expectStatus(204);
      });

      it("should return empty bookmark", () => {
        return pactum.spec().get("/bookmarks").withBearerToken("$S{token}").expectStatus(200).expectBody([]);
      });
    });
  });
});
