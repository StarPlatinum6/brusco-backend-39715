import chai from "chai";
import supertest from "supertest";
// import { v4 as uuidv4 } from 'uuid'
import { config } from "../../src/config/config.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Integration Test suite for Carts router", function () {
  this.timeout(10000);
  this.productId = "";
  this.cartId = "";
  this.adminCookie = {};
  this.premiumCookie = {};

  before(async function () {
    this.productId = "642c8adb6dbaaa8e907e0140";
    // Login admin user
    const adminUser = {
      email: config.admin.ADMIN_EMAIL,
      password: config.admin.ADMIN_PASSWORD,
    };

    const result = await requester.post("/api/v1/users/login").send(adminUser);
    const cookieResult = result.headers["set-cookie"][0];

    this.adminCookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    // Login premium user
    const premiumUser = {
      email: "premiumtest@domain.com",
      password: "172839",
    };
    const resultPremium = await requester
      .post("/api/v1/users/login")
      .send(premiumUser);
    const cookieResultPremium = resultPremium.headers["set-cookie"][0];

    // console.log(resultPremium._body)

    this.premiumCookie = {
      name: cookieResultPremium.split("=")[0],
      value: cookieResultPremium.split("=")[1],
    };
  });

  it("Endpoint /api/v1/carts (POST) creates new cart with ID", async function () {
    const { statusCode, ok, _body } = await requester
      .post("/api/v1/carts")
      .set("Cookie", [`${this.adminCookie.name}=${this.adminCookie.value}`]);

    this.cartId = _body.payload._id.toString();
    // console.log("Test 1", statusCode, ok, _body)

    expect(statusCode).to.be.ok.and.eq(201);
    expect(_body.payload).to.have.property("_id");
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/carts/:cid (GET) returns expected cart with valid cart ID input", async function () {
    const { statusCode, ok, _body } = await requester.get(
      `/api/v1/carts/${this.cartId}`
    );

    // console.log("Test 2", statusCode, ok, _body)

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body.payload._id).to.be.eq(this.cartId);
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/carts/:cid/product/:pid (POST) adds a new product to the cart when given a valid cart ID and product ID, quantity optional", async function () {
    const quantity = 5;
    const { statusCode, ok, _body } = await requester
      .post(`/api/v1/carts/${this.cartId}/product/${this.productId}`)
      .set("Cookie", [`${this.premiumCookie.name}=${this.premiumCookie.value}`])
      .send({ quantity });

    expect(statusCode).to.be.ok.and.eq(201);
    expect(_body.payload.products[0].productId._id).to.deep.eq(this.productId);
    expect(_body.payload.products[0].quantity).to.eq(quantity);
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/carts/:cid (PUT) updates the products array of a cart when given a valid cart ID and products array", async function () {
    const products = [
      {
        productId: this.productId,
        quantity: 14,
      },
    ];

    const { statusCode, ok, _body } = await requester
      .put(`/api/v1/carts/${this.cartId}`)
      .send(products);

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body.payload).to.have.property("modifiedCount").eq(1);
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/carts/:cid/product/:pid (PUT) updates the quantity of a product to 0 when given that quantity", async function () {
    const quantity = 0;

    const { statusCode, ok, _body } = await requester
      .put(`/api/v1/carts/${this.cartId}/product/${this.productId}`)
      .send(quantity);

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body.payload).to.have.property("modifiedCount").eq(1);
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/carts/:cid/product/:pid (DELETE) deletes a product from the cart when given a valid cart ID and product ID input", async function () {
    const { statusCode, ok, _body } = await requester.delete(
      `/api/v1/carts/${this.cartId}/product/${this.productId}`
    );

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body.payload).to.have.property("modifiedCount").eq(1);
    expect(ok).to.be.ok;
  });

  it("Endpoint /api/v1/carts/:cid (DELETE) deletes a cart with a valid cart ID input", async function () {
    const { statusCode, ok, _body } = await requester
      .delete(`/api/v1/carts/${this.cartId}`)
      .set("Cookie", [`${this.adminCookie.name}=${this.adminCookie.value}`]);

    expect(statusCode).to.be.ok.and.eq(200);
    expect(_body.payload).to.have.property("deletedCount").eq(1);
    expect(ok).to.be.ok;
  });
});

// console.log(statusCode, ok, _body);
