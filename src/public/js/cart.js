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
        fetch(`/api/v1/tickets/mail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.payload.purchaser,
            subject: `Ephemer Gaming order ${data.payload.code}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <title>Order Confirmation</title>
            </head>
            <body>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
            <td align="center" bgcolor="#f7f7f7">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse: collapse;">
            <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
              <img src="https://i.imgur.com/8BQPQDC.png" alt="Logo" width="150">
            </td>
            </tr>
            <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
                <tr>
                  <td style="color: #333333; font-family: Arial, sans-serif; font-size: 24px;">
                    Order Confirmation
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0 30px 0; color: #333333; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    Dear ${data.payload.purchaser},
                    <br><br>
                    Thank you for your purchase! We are pleased to inform you that your order has been successfully placed and is being processed.
                    <br><br>
                    Order Details:
                    <ul>
                      <li>Order Number: ${data.payload.code}</li>
                      <li>Order Date: ${new Date(
                        data.payload.purchase_datetime
                      ).toLocaleString()}</li>
                      <li>Order Total: ${data.payload.ammount}</li>
                    </ul>
                    <br>
                    If you have any questions or need further assistance, please feel free to contact our customer support team.
                    <br><br>
                    Thank you for choosing our company.
                    <br><br>
                    Sincerely,
                    <br>
                    Ephemer Gaming
                  </td>
                </tr>
              </table>
            </td>
            </tr>
            <tr>
            <td bgcolor="#f7f7f7" align="center" style="padding: 20px 0 20px 0; color: #888888; font-family: Arial, sans-serif; font-size: 12px;">
              This is an automated email. Please do not reply to this message.
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </table>
            </body>
            </html>
            `,
          }),
        }).catch((error) => console.log(error));
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
