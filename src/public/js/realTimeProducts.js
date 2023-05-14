const socket = io();

const productList = document.getElementById("productsList");

const deleteProductForm = document.getElementById("deleteProductForm");
const addProductForm = document.getElementById("addProductForm");
const thumbnails = document.getElementById("thumbnails").files;

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

socket.on("product_add", (product) => {
  let addedProduct = document.createElement("div");
  addedProduct.innerHTML = `
  <h2>${product.title}</h2>
  <p>$${product.price}</p>
  <p>${product.description}</p>
  ${product.thumbnails
    .map(
      (thumbnail) => `<img src="${thumbnail}" alt="img" style="width: 300px"/>`
    )
    .join("")}
  `;
  productList.appendChild(addedProduct);
});

socket.on("product_remove", (productId) => {
  productList.removeChild(productList.children[productId]);
});
