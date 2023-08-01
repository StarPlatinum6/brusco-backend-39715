import {
  errorSwal,
  deleteUserSwal,
  deleteInactiveUsersSwal
} from './swalCalls.js'

const d = document

const deleteUserButtons = d.querySelectorAll('[id^="deleteUser-"]')

const deleteInactiveUsers = d.getElementById('deleteInactiveUsers')

deleteUserButtons.forEach((button) => {
  button.addEventListener('click', async (e) => {
    e.preventDefault()
    const cartId = button.getAttribute('id').split('-')[1]
    const userName =
      button.previousElementSibling.querySelector('h3').textContent

    try {
      const response = await fetch(`/api/v1/users/${cartId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (response.ok) {
        deleteUserSwal(userName)
      } else {
        throw data
      }
    } catch ({ error }) {
      errorSwal(error)
    }
  })
})

deleteInactiveUsers.addEventListener('click', async (e) => {
  e.preventDefault()
  try {
    const response = await fetch('/api/v1/users/inactive', {
      method: 'DELETE'
    })
    const data = await response.json()

    if (response.ok) {
      deleteInactiveUsersSwal()
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})
