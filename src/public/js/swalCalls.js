// export const Swal = () => {};

//
// cart.js
//

export const removeFromCartSwal = (prodTitle) => {
  Swal.fire({
    title: "Product removed from cart!",
    text: `You removed ${prodTitle} from the cart`,
    footer: "Reloading page on close",
    toast: true,
    position: "top-right",
    icon: "success",
    timer: 4000,
    timerProgressBar: true,
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
    willClose: () => {
      location.reload();
    },
  });
};

export const successfulOrderSwal = (code, purchaser) => {
  Swal.fire({
    title: "Successful order!",
    html: `
        Your purchase code is:<br>
        <strong class="text-bold">${code}</strong><br><br>
        Details were sent to ${purchaser}
        `,
    footer: "Reloading page on close",
    icon: "success",
    timer: 5000,
    timerProgressBar: true,
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
    willClose: () => {
      location.reload();
    },
  });
};

//
// home.js & product.js
//

export const addProductSwal = (title, id) => {
  Swal.fire({
    title: "Product successfully created!",
    html: `You created ${title}.<br>
        New product ID is: ${id}`,
    toast: true,
    position: "top-right",
    icon: "success",
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
  });
};

export const deleteProductSwal = (productId) => {
  Swal.fire({
    title: "Product successfully deleted!",
    text: `Product ID: ${productId}`,
    toast: true,
    position: "top-right",
    icon: "success",
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
  });
};

export const addToCartSwal = (prodTitle) => {
  Swal.fire({
    title: "Product added to cart!",
    text: `You added 1 unit of ${prodTitle}`,
    toast: true,
    position: "top-right",
    icon: "success",
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
  });
};

export const createCartSwal = (id) => {
  Swal.fire({
    title: "New cart created!",
    text: `The cart ID is ${id}`,
    toast: true,
    confirmButton: false,
    position: "top-right",
    icon: "success",
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
  });
};

export const logoutSwal = () => {
  Swal.fire({
    title: "Logout successful!",
    text: `Redirecting you... See you soon!`,
    allowOutsideClick: false,
    confirmButton: false,
    icon: "success",
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
    willClose: () => {
      window.location.href = "/";
    },
  });
};

//
// login.js
//

export const ghLoginSwal = () => {
  Swal.fire({
    title: "Processing login.",
    text: "Please, stand by...",
    allowOutsideClick: false,
    icon: "info",
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
    timer: 3000,
    timerProgressBar: true,
  });
};

export const loginSwal = (statusText) => {
  Swal.fire({
    title: "Login successful!",
    text: `${statusText}. Welcome!`,
    allowOutsideClick: false,
    icon: "success",
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
    timer: 2000,
    timerProgressBar: true,
    willClose: () => {
      window.location.href = "/home";
    },
  });
};

//
// register.js
//

export const registerSwal = (message) => {
  Swal.fire({
    title: "Registration successful!",
    text: `${message}. Redirecting you to login.`,
    icon: "success",
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
    timer: 2000,
    timerProgressBar: true,
    willClose: () => {
      window.location.href = "/";
    },
  });
};

//
// restore.js & resetPassword.js
//

export const passUpdateSwal = (message) => {
  Swal.fire({
    title: "Success!",
    text: `${message}. Redirecting you to login.`,
    icon: "success",
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
    timer: 2000,
    timerProgressBar: true,
    willClose: () => {
      window.location.href = "/";
    },
  });
};

//
// error
//

export const errorSwal = (
  error = "There was an error with your request, please try again!"
) => {
  Swal.fire({
    title: "Error!",
    html: `<strong class="text-bold">${error}</strong>`,
    icon: "error",
    timer: 5000,
    footer: "Reloading page on close",
    timerProgressBar: true,
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
    willClose: () => {
      location.reload();
    },
  });
};
