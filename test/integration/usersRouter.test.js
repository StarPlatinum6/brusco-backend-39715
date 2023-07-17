import chai from "chai";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { config } from "../../src/config/config.js";
import { userService, cartService } from "../../src/services/index.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Integration Test suite for Users router", function () {
  this.timeout(10000);
  this.cookie = {};
  this.userEmail = "";
  this.userId = "";
  this.cartId = "";

  before(async function () {
    this.userService = userService;
    this.cartService = cartService;
  });

  // After the test suite, will cleanup the DB from the test user & cart
  after(async function () {
    await this.userService.deleteUser(this.userId);
    await this.cartService.deleteCart(this.cartId);
  });

  it("Endpoint /api/v1/users/register (POST) registers a new user given a valid input", async function () {
    const userMock = {
      first_name: "Milanesas",
      last_name: "Delabuela",
      email: `${uuidv4()}@gmail.com`,
      age: 80,
      password: "123456",
    };
    this.userEmail = userMock.email;

    const { statusCode, ok, _body } = await requester
      .post("/api/v1/users/register")
      .send(userMock);

    expect(statusCode).to.be.ok.and.eq(201);
    expect(_body).to.have.property("message").eq("User registered");
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/users/failRegister (GET) returns an error if a user already exists upon registrarion", async function () {
    const { statusCode, ok, _body } = await requester.get(
      "/api/v1/users/failregister"
    );

    expect(statusCode).to.be.ok.and.eq(409);
    expect(_body).to.have.property("error").eq("User already exists");
    expect(ok).to.be.not.ok;
  });

  it("Endpoint /api/v1/users/login (POST) logs in the created user correctly and returns a cookie", async function () {
    const loginMock = {
      email: this.userEmail,
      password: "123456",
    };

    const { statusCode, ok, _body, headers } = await requester
      .post("/api/v1/users/login")
      .send(loginMock);

    const cookieResult = headers["set-cookie"][0];

    this.cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body).to.have.property("message").eq("Logged In");
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/users/current (GET) returns the current logged user info", async function () {
    const { statusCode, ok, _body } = await requester
      .get("/api/v1/users/current")
      .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body.payload).to.have.property("email").eq(this.userEmail);
    expect(ok).to.be.ok;
  });

  it('Endpoint /api/v1/users/premium/:uid (POST) switches user role between "user" and "premium"', async function () {
    const adminUser = {
      email: config.admin.ADMIN_EMAIL,
      password: config.admin.ADMIN_PASSWORD,
    };

    const { _id: userId, cart: cartId } = await this.userService.getUser(
      this.userEmail
    );
    this.userId = userId;
    this.cartId = cartId;

    const result = await requester.post("/api/v1/users/login").send(adminUser);
    const cookieResult = result.headers["set-cookie"][0];
    const adminCookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    const { statusCode, ok, _body } = await requester
      .post(`/api/v1/users/premium/${userId}`)
      .set("Cookie", [`${adminCookie.name}=${adminCookie.value}`]);

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body)
      .to.have.property("message")
      .eq(`Successfully changed role for user ${userId}`);
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/users/restore (POST) sends a password-recovery e-mail to the given e-mail address", async function () {
    const { statusCode, ok, _body } = await requester
      .post("/api/v1/users/restore")
      .send({ email: this.userEmail });

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body).to.have.property("message").eq("Password reset email sent");
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/users/resetPassword (PUT) receives a new password and a valid token and updates the user's existing one", async function () {
    const token = jwt.sign({ email: this.userEmail }, config.jwt.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { statusCode, ok, _body } = await requester
      .put("/api/v1/users/resetPassword")
      .send({ password: "123", token });

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body)
      .to.have.property("message")
      .eq("Successfully updated password");
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/users/logout (GET) logs out the user correctly", async function () {
    const { statusCode, ok, _body } = await requester.get(
      "/api/v1/users/logout"
    );

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body).to.have.property("message").eq("Logout successful!");
    expect(ok).to.be.ok;
  });
});
