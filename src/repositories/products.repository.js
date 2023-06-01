export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async (page, limit, category, available, sort) => {
    try {
      const products = await this.dao.getProducts(
        page,
        limit,
        category,
        available,
        sort
      );
      return products;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getProductById = async (productId) => {
    try {
      const filteredProduct = await this.dao.getProductById(productId);
      return filteredProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  addProduct = async (product) => {
    try {
      const newProduct = await this.dao.addProduct(product);
      return newProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateProduct = async (productId, updateProd) => {
    try {
      const updatedProduct = await this.dao.updateProduct(
        productId,
        updateProd
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteProduct = async (deleteId) => {
    try {
      const deletedProduct = await this.dao.deleteProduct(deleteId);
      return deletedProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
