export const ErrorCodes = {
  AUTHENTICATION_ERROR: 1,
  AUTHORIZATION_ERROR: 2,
  MISSING_DATA_ERROR: 3,
};

export const ErrorNames = {
  AUTHENTICATION_ERROR: "Login failed",
  NO_AUTHENTICATION_ERROR: "Authentication error",
  NO_AUTHORIZATION_ERROR: "Authorization error",
  ADD_PRODUCT_ERROR: "Add product error",
  ADD_PRODUCT_TO_CART_ERROR: "Add product to cart error",
};

export const ErrorMessages = {
  AUTHENTICATION_ERROR_MESSAGE: "Error trying to login User",
  NO_AUTHENTICATION_ERROR_MESSAGE: "Error authenticating user",
  NO_AUTHORIZATION_ERROR_MESSAGE: "Permission denied.",
  ADD_PRODUCT_ERROR_MESSAGE: "Error trying to create new product",
  ADD_PRODUCT_TO_CART_ERROR_MESSAGE: "Error trying to add product to cart",
};
