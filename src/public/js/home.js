const deleteProductForm = document.getElementById("deleteProductForm");
const addProductForm = document.getElementById("addProductForm");
const createCartForm = document.getElementById("createCartForm");
const addToCartForms = document.querySelectorAll('[id^="addToCartForm-"]');
const goToCartBtn = document.getElementById("goToCartBtn");
const logoutBtn = document.getElementById("logoutButton");

const thumbnails = document.getElementById("thumbnails")?.files;

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

addProductForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  for (let i = 0; i < thumbnails.length; i++) {
    formData.append("thumbnails", thumbnails[i]);
  }

  fetch(`/api/v1/products`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Product successfully created!",
          html: `You created ${data.payload.title}.<br>
          New product ID is: ${data.payload._id}.`,
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
      } else {
        Swal.fire({
          title: "Error!",
          text: `${data.error}`,
          toast: true,
          position: "top-right",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
            confirmButton: "!bg-blue-600 !px-5",
            timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
          },
        });
      }
    });
});

deleteProductForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const productId = document.getElementById("pid").value;
  fetch(`/api/v1/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
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
      } else {
        Swal.fire({
          title: "Error!",
          text: `${data.error}`,
          toast: true,
          position: "top-right",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
            confirmButton: "!bg-blue-600 !px-5",
            timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
          },
        });
      }
    });
});

addToCartForms?.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cartId = document.querySelector("#userCartId").textContent;
    const productId = form.getAttribute("id").split("-")[1];
    const prodTitle = form.closest("div").querySelector("h5").textContent;
    const prodStock = form.nextElementSibling
      .querySelector("#prodStock")
      .getAttribute("data-stock");

    if (prodStock > 1) {
      fetch(`/api/v1/carts/${cartId}/product/${productId}`, {
        method: "POST",
      })
        .then(() => {
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
              timerProgressBar:
                "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
            },
          });
        })
        .catch((error) => console.log(error));
    } else {
      Swal.fire({
        title: "Woops!!",
        text: `${prodTitle} is out of stock! Sorry!`,
        toast: true,
        position: "top-right",
        icon: "error",
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
          confirmButton: "!bg-blue-600 !px-5",
          timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
        },
      });
    }
  });
});

createCartForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`/api/v1/carts`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "New cart created!",
          text: `The cart ID is ${data.payload._id}`,
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
      } else {
        Swal.fire({
          title: "Error!",
          text: `${data.error}`,
          toast: true,
          position: "top-right",
          icon: "error",
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
            confirmButton: "!bg-blue-600 !px-5",
            timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
          },
        });
      }
    })
    .catch((error) => console.log(error));
});

goToCartBtn?.addEventListener("click", () => {
  const cid = document.getElementById("cid").value;
  window.location.href = `/cart/${cid}`;
});

logoutBtn.addEventListener("click", () => {
  fetch(`/api/v1/users/logout`, {
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
