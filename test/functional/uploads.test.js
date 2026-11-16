
import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";

import { readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import OrderModel from "../../src/models/order.model.js";

import { UPLOAD_DIRECTORIES } from "../../src/config/multer.js";

import {
  connectTestDatabase,
  clearTestDatabase,
  disconnectTestDatabase
} from "./helpers/testDatabase.js";

const PDF_BUFFER = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF\n"
);

const INVALID_BUFFER = Buffer.from(
  "Este archivo no es un PDF real"
);

const createUser = async () => {
  return UserModel.create({
    firstName: "Usuario",
    lastName: "Testing",
    email: "uploads@shipnow.test",
    password: "password-hasheada-para-test",
    role: "customer"
  });
};

const createOrder = async (userId) => {
  const storeId = new mongoose.Types.ObjectId();

  return OrderModel.create({
    customer: userId,
    store: storeId,
    items: [
      {
        name: "Producto de prueba",
        quantity: 1,
        price: 1000
      }
    ],
    deliveryAddress: "Rosario, Santa Fe",
    total: 1000
  });
};

const fileExists = async (filePath) => {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
};

describe("ShipNow API - Carga de archivos", function () {
  this.timeout(15000);

  before(async function () {
    await connectTestDatabase();
  });

  beforeEach(async function () {
    await clearTestDatabase();
  });

  afterEach(async function () {
    // Se eliminan únicamente los archivos creados
    // durante estas pruebas.
    for (const filePath of this.testFiles ?? []) {
      await rm(filePath, { force: true });
    }

    this.testFiles = [];
  });

  after(async function () {
    await disconnectTestDatabase();
  });

  it("sube un documento válido y guarda sus metadatos", async function () {
    const user = await createUser();

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("documentType", "dni")
      .attach("file", PDF_BUFFER, "documento.pdf");

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");

    const metadata = response.body.payload.document;

    expect(metadata.originalName).to.equal("documento.pdf");
    expect(metadata.mimeType).to.equal("application/pdf");
    expect(metadata.documentType).to.equal("dni");
    expect(metadata.size).to.equal(PDF_BUFFER.length);

    const savedUser = await UserModel.findById(user._id);

    expect(savedUser.documents).to.have.lengthOf(1);
    expect(savedUser.documents[0].generatedName)
      .to.equal(metadata.generatedName);

    const filePath = path.join(
      UPLOAD_DIRECTORIES.userDocuments,
      metadata.generatedName
    );

    expect(await fileExists(filePath)).to.equal(true);

    this.testFiles = [filePath];
  });

  it("rechaza la carga cuando falta el archivo", async function () {
    const user = await createUser();

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("documentType", "dni");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("FILE_REQUIRED");
  });

  it("rechaza un tipo de documento inválido", async function () {
    const user = await createUser();

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("documentType", "factura")
      .attach("file", PDF_BUFFER, "documento.pdf");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_DOCUMENT_TYPE");

    const savedUser = await UserModel.findById(user._id);

    expect(savedUser.documents).to.have.lengthOf(0);
  });

  it("rechaza un usuario inexistente", async function () {
    const nonexistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/api/users/${nonexistentId}/documents`)
      .field("documentType", "dni")
      .attach("file", PDF_BUFFER, "documento.pdf");

    expect(response.status).to.equal(404);
    expect(response.body.code).to.equal("USER_NOT_FOUND");
  });

  it("rechaza archivos con un formato no permitido", async function () {
    const user = await createUser();

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("documentType", "dni")
      .attach("file", Buffer.from("texto"), "archivo.txt");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_FILE_TYPE");
  });

  it("rechaza un PDF con contenido inválido", async function () {
    const user = await createUser();

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("documentType", "dni")
      .attach("file", INVALID_BUFFER, {
        filename: "falso.pdf",
        contentType: "application/pdf"
      });

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_FILE_TYPE");

    const savedUser = await UserModel.findById(user._id);

    expect(savedUser.documents).to.have.lengthOf(0);
  });

  it("rechaza archivos superiores a 5 MB", async function () {
    const user = await createUser();

    const largeBuffer = Buffer.alloc(
      5 * 1024 * 1024 + 1,
      0x41
    );

    PDF_BUFFER.copy(largeBuffer);

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("documentType", "dni")
      .attach("file", largeBuffer, {
        filename: "grande.pdf",
        contentType: "application/pdf"
      });

    expect(response.status).to.equal(413);
    expect(response.body.code).to.equal("FILE_TOO_LARGE");
  });

  it("rechaza un nombre de campo incorrecto", async function () {
    const user = await createUser();

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field("documentType", "dni")
      .attach("documento", PDF_BUFFER, "documento.pdf");

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal("INVALID_FILE_FIELD");
  });

  it("sube un comprobante válido y lo asocia al pedido", async function () {
    const user = await createUser();
    const order = await createOrder(user._id);

    const response = await request(app)
      .post(`/api/orders/${order._id}/proof`)
      .attach("file", PDF_BUFFER, "comprobante.pdf");

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");

    const metadata = response.body.payload.proof;

    expect(metadata.originalName).to.equal("comprobante.pdf");

    const savedOrder = await OrderModel.findById(order._id);

    expect(savedOrder.proof.generatedName)
      .to.equal(metadata.generatedName);

    const filePath = path.join(
      UPLOAD_DIRECTORIES.orderProofs,
      metadata.generatedName
    );

    expect(await fileExists(filePath)).to.equal(true);

    this.testFiles = [filePath];
  });

  it("rechaza un pedido inexistente", async function () {
    const nonexistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/api/orders/${nonexistentId}/proof`)
      .attach("file", PDF_BUFFER, "comprobante.pdf");

    expect(response.status).to.equal(404);
    expect(response.body.code).to.equal("ORDER_NOT_FOUND");
  });

  it("reemplaza un comprobante anterior", async function () {
    const user = await createUser();
    const order = await createOrder(user._id);

    const firstResponse = await request(app)
      .post(`/api/orders/${order._id}/proof`)
      .attach("file", PDF_BUFFER, "primero.pdf");

    expect(firstResponse.status).to.equal(201);

    const firstFile = path.join(
      UPLOAD_DIRECTORIES.orderProofs,
      firstResponse.body.payload.proof.generatedName
    );

    this.testFiles = [firstFile];

    const secondResponse = await request(app)
      .post(`/api/orders/${order._id}/proof`)
      .attach("file", PDF_BUFFER, "segundo.pdf");

    expect(secondResponse.status).to.equal(201);

    const secondFile = path.join(
      UPLOAD_DIRECTORIES.orderProofs,
      secondResponse.body.payload.proof.generatedName
    );

    this.testFiles.push(secondFile);

    expect(await fileExists(firstFile)).to.equal(false);
    expect(await fileExists(secondFile)).to.equal(true);

    const savedOrder = await OrderModel.findById(order._id);

    expect(savedOrder.proof.originalName).to.equal("segundo.pdf");
  });
});
