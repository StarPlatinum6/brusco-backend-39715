import { registerSwal, errorSwal } from "./swalCalls.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch("/api/v1/users/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {
      registerSwal(data.message);
    } else {
      throw data;
    }
  } catch ({ error }) {
    errorSwal(error);
  }
});
