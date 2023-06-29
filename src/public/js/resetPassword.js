import { passUpdateSwal, errorSwal } from "./swalCalls.js";

const form = document.getElementById("passRestoreForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  const newPasswords = Object.values(obj);
  const matches = newPasswords.every((el) => el === newPasswords[0]);

  if (matches) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      obj["token"] = token;

      const response = await fetch("/api/v1/users/resetPassword", {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        passUpdateSwal(data.message);
      } else {
        throw data;
      }
    } catch ({ error }) {
      errorSwal(error);
    }
  } else {
    errorSwal("Passwords don't match. Please type them again.");
  }
});
