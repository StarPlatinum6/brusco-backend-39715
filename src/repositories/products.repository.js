import { productModel } from "../models/products.model.js";

export default class ProductsRepository {
  constructor() {
    this.model = productModel;
  }

  getProducts = async (page, limit, category, available, sort) => {
    try {
      let queries = {};
      category ? (queries.category = category.toUpperCase()) : null;
      available ? (queries.status = available.toLowerCase()) : null;
      parseInt(sort) === 1 ? (sort = { price: 1 }) : null;
      parseInt(sort) === -1 ? (sort = { price: -1 }) : null;

      const products = await this.model.paginate(queries, {
        limit,
        page,
        lean: true,
        sort,
      });

      products.hasPrevPage
        ? (products.prevLink = `/?page=${products.prevPage}`)
        : (products.prevLink = null);
      products.hasNextPage
        ? (products.nextLink = `/?page=${products.nextPage}`)
        : (products.nextLink = null);

      return products;
    } catch (error) {
      console.log(error);
    }
  };

  getProductById = async (productId) => {
    try {
      const filteredProduct = await this.model
        .findOne({ _id: productId })
        .lean();
      return filteredProduct;
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (product) => {
    try {
      product.stock > 0
        ? (product = { status: true, ...product })
        : (product = { status: false, ...product });

      if (product?.thumbnails[0]?.hasOwnProperty("fieldname")) {
        const imgPaths = product.thumbnails.map(
          (prod) => `images/${prod.filename}`
        );
        product.thumbnails = imgPaths;
      }

      const newProduct = await this.model.create(product);

      return newProduct;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (productId, updateProd) => {
    try {
      const updatedProduct = await this.model.updateOne(
        { _id: productId },
        updateProd
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (deleteId) => {
    try {
      const deletedProduct = await this.model.deleteOne({ _id: deleteId });
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  };
}
