const form = document.getElementById("passRestoreForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  let response = await fetch("/api/v1/users/restore", {
    method: "PUT",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let result = await response.json();
  console.log(result);

  if (result.status === "success") {
    Swal.fire({
      title: "Password update successful!",
      text: `${result.message}. Redirecting you to login.`,
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
  } else {
    Swal.fire({
      title: "Password update error!",
      text: `${result.error}... Please try again!`,
      icon: "error",
      customClass: {
        popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
        confirmButton: "!bg-blue-600 !px-5",
        timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
      },
      timer: 2000,
      timerProgressBar: true,
    });
  }
});
