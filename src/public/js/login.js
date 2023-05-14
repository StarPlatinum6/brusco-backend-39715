const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  let response = await fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let result = await response.json();

  if (result.status === "success") {
    Swal.fire({
      title: "Login successful!",
      text: `${result.message}. Welcome!`,
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
  } else {
    Swal.fire({
      title: "Login error!",
      text: `${result.error}... Please try again!`,
      allowOutsideClick: false,
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
