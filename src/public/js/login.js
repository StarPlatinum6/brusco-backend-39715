const form = document.getElementById("loginForm");
const ghBtn = document.getElementById("ghBtn");

ghBtn.addEventListener("click", (e) => {
  if (e.target.matches("#ghBtn")) {
    Swal.fire({
      title: "Processing login.",
      text: "Please, stand by...",
      allowOutsideClick: false,
      icon: "info",
      customClass: {
        popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
        confirmButton: "!bg-blue-600 !px-5",
        timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
      },
      timer: 3000,
      timerProgressBar: true,
    });
  }
});

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

  if (response.ok) {
    Swal.fire({
      title: "Login successful!",
      text: `${response.statusText}. Welcome!`,
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
      text: `${response.statusText}... Please try again!`,
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
