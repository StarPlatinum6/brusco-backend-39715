const addToCartForm = document.querySelector('[id^="addToCartForm-"]');

addToCartForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cartId = addToCartForm.children[0].lastElementChild.getAttribute("id");
  const productId = addToCartForm.getAttribute("id").split("-")[1];
  const prodTitle = addToCartForm
    .closest("div")
    .querySelector("h5").textContent;
  const prodStock = document
    .getElementById("prodStock")
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
            timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
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
