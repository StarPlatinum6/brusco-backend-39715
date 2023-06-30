export const loginErrorInfo = (user) => {
  return `One or more properties were incomplete or invalid:
    * password: required String, received ${user.password}
    * email: required String, received ${user.email}`;
};

export const addProductErrorInfo = (product) => {
  return `One or more properties were incomplete or invalid:
  * title: required String, received ${product.title}
  * description: required String, received ${product.description}
  * code: required String, received ${product.code}
  * price: required Number, received ${product.price}
  * stock: required Number, received ${product.stock}
  * category: required String, received ${product.category}`;
};

export const addToCartErrorInfo = (props) => {
  return `One or more properties were incomplete or invalid:
  * cid (Cart ID): required String, received ${props.cid}
  * pid (Product ID): required String, received ${props.pid}`;
};

export const authenticationErrorInfo = () => {
  return "Access denied. Authentication credentials were missing or incorrect. Login and try again.";
};

export const authorizationErrorInfo = (props) => {
  return `Access forbidden for ${props.role} role. Your account does not have the necessary privileges to access this page. Login as an ${props.rolesToVerify} to proceed`;
};
