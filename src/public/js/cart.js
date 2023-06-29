import {
  removeFromCartSwal,
  successfulOrderSwal,
  errorSwal,
} from "./swalCalls.js";

const removeFromCartForms = document.querySelectorAll(
  '[id^="removeFromCartForm-"]'
);
const cartId = document.getElementById("cartId").textContent;
const checkoutBtn = document.getElementById("checkoutBtn");

removeFromCartForms.forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const productId = form.getAttribute("id").split("-")[1];
    const prodTitle = form
      .closest(".max-w-4xl")
      .querySelector("h5").textContent;

    try {
      const response = await fetch(
        `/api/v1/carts/${cartId}/product/${productId}`,
        { method: "DELETE" }
      );
      const data = await response.json();

      if (response.ok) {
        removeFromCartSwal(prodTitle);
      } else {
        throw data;
      }
    } catch ({ error }) {
      errorSwal(error);
    }
  });
});

checkoutBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`/api/v1/carts/${cartId}/purchase`, {
      method: "POST",
    });
    const data = await response.json();

    if (response.ok) {
      const {
        payload: { code, purchaser },
      } = data;
      successfulOrderSwal(code, purchaser);
    } else {
      throw data;
    }
  } catch ({ error }) {
    errorSwal(error);
  }
});
