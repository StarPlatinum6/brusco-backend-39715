import ProductManager from "./ProductManager.js";

const env = async () => {
  const productManager = new ProductManager();

  const product1 = {
    title: "Test product",
    description: "this is a test product",
    price: 200,
    code: "abc123",
    stock: 50,
  };

  const product2 = {
    title: "Test product",
  };

  const product3 = {
    title: "Test product",
    description: "this is a test product",
    price: 200,
    thumbnail: "No image",
    code: "abc123",
    stock: 50,
  };

  const product4 = {
    title: "Test product 2",
    description: "this is a test product 2",
    price: 500,
    thumbnail: "No image",
    code: "BBC456",
    stock: 150,
  };

  const product5 = {
    title: "Test product 3",
    description: "this is a test product 3",
    price: 1500,
    thumbnail: "No image",
    code: "CBAC789",
    stock: 85,
  };

  await productManager.getProducts();

  await productManager.addProduct(product1); // Missing fields
  await productManager.addProduct(product2); // Missing fields
  await productManager.addProduct(product3);
  await productManager.addProduct(product4);
  await productManager.addProduct(product5);

  await productManager.getProducts();

  await productManager.addProduct(product5);

  await productManager.getProductById(8); // Non existant
  await productManager.getProductById(1);
  await productManager.getProductById(3);
  await productManager.getProductById(17); // Non existant

  await productManager.updateProduct(
    2,
    "description",
    "This product was recently updated"
  );
  await productManager.updateProduct(4, "stock", 500);
  await productManager.updateProduct(1, "Price", 25500);

  await productManager.getProductById(2);

  await productManager.deleteProduct(3);
  await productManager.deleteProduct(2);
  await productManager.deleteProduct(1); // Delete all products

  await productManager.addProduct(product4);
  await productManager.addProduct(product5); // Add them again

  await productManager.getProductById(3); // This product doesn't exist now

  await productManager.getProducts(); // Final list
};

env();
