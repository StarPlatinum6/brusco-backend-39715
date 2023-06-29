import { addToCartSwal, errorSwal } from "./swalCalls.js";

const addToCartForm = document.querySelector('[id^="addToCartForm-"]');

addToCartForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cartId = addToCartForm.children[0].lastElementChild.getAttribute("id");
  const productId = addToCartForm.getAttribute("id").split("-")[1];
  const prodTitle = addToCartForm
    .closest("div")
    .querySelector("h5").textContent;
  const prodStock = document
    .getElementById("prodStock")
    .getAttribute("data-stock");

  try {
    if (prodStock >= 1) {
      const response = await fetch(
        `/api/v1/carts/${cartId}/product/${productId}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (response.ok) {
        addToCartSwal(prodTitle);
      } else {
        throw data;
      }
    } else {
      throw { error: "Product is out of stock" };
    }
  } catch ({ error }) {
    errorSwal(error);
  }
});
