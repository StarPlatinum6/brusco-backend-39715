const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  try {
    let response = await fetch("/api/v1/users/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      let result = await response.json();
      console.log(result);

      if (result.status === "success") {
        Swal.fire({
          title: "Registration successful!",
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
        throw new Error(result.error);
      }
    } else {
      let errorMessage = await response.json();
      throw errorMessage;
    }    
  } catch (error) {
    console.log(error);
    Swal.fire({
      title: "Registration error!",
      text: `${error.message}... Please try again!`,
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
