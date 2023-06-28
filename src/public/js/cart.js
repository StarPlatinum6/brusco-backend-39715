const removeFromCartForms = document.querySelectorAll(
  '[id^="removeFromCartForm-"]'
);
const cartId = document.getElementById("cartId").textContent;
const checkoutBtn = document.getElementById("checkoutBtn");

removeFromCartForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const productId = form.getAttribute("id").split("-")[1];
    const prodTitle = form
      .closest(".max-w-4xl")
      .querySelector("h5").textContent;

    fetch(`/api/v1/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          Swal.fire({
            title: "Product removed from cart!",
            text: `You removed ${prodTitle} from the cart`,
            footer: "Reloading page in 4s",
            toast: true,
            position: "top-right",
            icon: "success",
            timer: 4000,
            timerProgressBar: true,
            customClass: {
              popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
              confirmButton: "!bg-blue-600 !px-5",
              timerProgressBar:
                "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
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
              timerProgressBar:
                "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
            },
          });
        }
        setTimeout(() => {
          location.reload();
        }, 4000);
      })
      .catch((error) => console.log(error));
  });
});

checkoutBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(`/api/v1/carts/${cartId}/purchase`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        Swal.fire({
          title: "Successful order!",
          html: `
          Your purchase code is:<br>
          <strong class="text-bold">${data.payload.code}</strong><br><br>
          Details were sent to ${data.payload.purchaser}
          `,
          footer: "Reloading page in 5s",
          icon: "success",
          timer: 5000,
          timerProgressBar: true,
          customClass: {
            popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
            confirmButton: "!bg-blue-600 !px-5",
            timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
          },
        });
      } else {
        Swal.fire({
          title: "Woops!",
          html: `
          ${data.error}<br>
          <strong class="text-bold">All products were out of stock.</strong>
          `,
          footer: "Reloading page in 5s",
          icon: "error",
          timer: 5000,
          timerProgressBar: true,
          customClass: {
            popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
            confirmButton: "!bg-blue-600 !px-5",
            timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
          },
        });
      }
      setTimeout(() => {
        location.reload();
      }, 5000);
    })
    .catch((error) => console.log(error));
});
