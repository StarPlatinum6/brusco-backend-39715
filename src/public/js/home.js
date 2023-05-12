const deleteProductForm = document.getElementById("deleteProductForm");
const addProductForm = document.getElementById("addProductForm");
const createCartForm = document.getElementById("createCartForm");
const addToCartForms = document.querySelectorAll('[id^="addToCartForm-"]');
const goToCartBtn = document.getElementById("goToCartBtn");
const logoutBtn = document.getElementById("logoutButton");

const thumbnails = document.getElementById("thumbnails").files;

const nextLink = document.getElementById("nextLink");
const prevLink = document.getElementById("prevLink");

const prevPage = prevLink?.getAttribute("prevpage");
const nextPage = nextLink?.getAttribute("nextpage");

const currentURL = new URL(window.location.href);
const searchParams = new URLSearchParams(currentURL.search);

searchParams.set("page", nextPage);
const nextUrl = "/home?" + searchParams.toString();

searchParams.set("page", prevPage);
const prevUrl = "/home?" + searchParams.toString();

nextLink?.setAttribute("href", nextUrl);
prevLink?.setAttribute("href", prevUrl);

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  for (let i = 0; i < thumbnails.length; i++) {
    formData.append("thumbnails", thumbnails[i]);
  }

  fetch(`/api/products`, {
    method: "POST",
    body: formData,
  });
});

deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const productId = document.getElementById("pid").value;
  fetch(`/api/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
});

addToCartForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cartId = form.querySelector("#cid").value;
    const productId = form.getAttribute("id").split("-")[1];
    const prodTitle = form.closest("div").querySelector("h5").textContent;

    fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
    })
      .then(() => {
        Swal.fire({
          title: "Product added to cart!",
          text: `You added 1 unit of ${prodTitle}`,
          toast: true,
          position: "top-right",
          icon: "success",
          customClass: {
            popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
            confirmButton: "!bg-blue-600 !px-5",
            timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
          },
        });
      })
      .catch((error) => console.log(error));
  });
});

createCartForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`/api/carts`, {
    method: "POST",
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      Swal.fire({
        title: "New cart created!",
        text: `The cart ID is ${response.payload._id}`,
        toast: true,
        confirmButton: false,
        position: "top-right",
        icon: "success",
        customClass: {
          popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
          confirmButton: "!bg-blue-600 !px-5",
          timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
        },
        onclose,
      });
    })
    .catch((error) => console.log(error));
});

goToCartBtn.addEventListener("click", () => {
  const cid = document.getElementById("cid").value;
  window.location.href = `/cart/${cid}`;
});

logoutBtn.addEventListener("click", () => {
  fetch(`/api/sessions/logout`, {
    method: "GET",
  })
    .then(() => {
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
    })
    .catch((error) => console.log(error));
});
