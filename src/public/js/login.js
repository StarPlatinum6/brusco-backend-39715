import { ghLoginSwal, loginSwal, errorSwal } from './swalCalls.js'

const form = document.getElementById('loginForm')
const ghBtn = document.getElementById('ghBtn')
const rememberMe = document.getElementById('rememberMe')

ghBtn.addEventListener('click', (e) => {
  if (e.target.matches('#ghBtn')) {
    ghLoginSwal()
  }
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = new FormData(form)
  const obj = {}

  data.forEach((value, key) => (obj[key] = value))
  obj.rememberMe = rememberMe.checked

  try {
    const response = await fetch('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (response.ok) {
      loginSwal(data.message)
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})
