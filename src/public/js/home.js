import {
  errorSwal,
  addProductSwal,
  deleteProductSwal,
  addToCartSwal,
  createCartSwal,
  logoutSwal
} from './swalCalls.js'

const deleteProductForm = document.getElementById('deleteProductForm')
const addProductForm = document.getElementById('addProductForm')
const createCartForm = document.getElementById('createCartForm')
const addToCartForms = document.querySelectorAll('[id^="addToCartForm-"]')
const goToCartBtn = document.getElementById('goToCartBtn')
const logoutBtn = document.getElementById('logoutButton')

const thumbnails = document.getElementById('thumbnails')?.files

const nextLink = document.getElementById('nextLink')
const prevLink = document.getElementById('prevLink')

const prevPage = prevLink?.getAttribute('prevpage')
const nextPage = nextLink?.getAttribute('nextpage')

const currentURL = new URL(window.location.href)
const searchParams = new URLSearchParams(currentURL.search)

searchParams.set('page', nextPage)
const nextUrl = '/home?' + searchParams.toString()

searchParams.set('page', prevPage)
const prevUrl = '/home?' + searchParams.toString()

nextLink?.setAttribute('href', nextUrl)
prevLink?.setAttribute('href', prevUrl)

addProductForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(addProductForm)
  for (let i = 0; i < thumbnails.length; i++) {
    formData.append('thumbnails', thumbnails[i])
  }

  try {
    const response = await fetch('/api/v1/products', {
      method: 'POST',
      body: formData
    })
    const data = await response.json()

    if (response.ok) {
      addProductSwal(data.payload.title, data.payload._id)
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})

deleteProductForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const productId = document.getElementById('pid').value

  try {
    const response = await fetch(`/api/v1/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()

    if (response.ok) {
      deleteProductSwal(productId)
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})

addToCartForms?.forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const cartId = document.querySelector('#userCartId').textContent
    const productId = form.getAttribute('id').split('-')[1]
    const prodTitle = form.closest('div').querySelector('h5').textContent
    const prodStock = form.nextElementSibling
      .querySelector('#prodStock')
      .getAttribute('data-stock')

    try {
      if (prodStock >= 1) {
        const response = await fetch(
          `/api/v1/carts/${cartId}/product/${productId}`,
          { method: 'POST' }
        )
        const data = await response.json()
        if (response.ok) {
          addToCartSwal(prodTitle)
        } else {
          throw data
        }
      } else {
        throw { error: 'Product is out of stock' }
      }
    } catch ({ error }) {
      errorSwal(error)
    }
  })
})

createCartForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  try {
    const response = await fetch('/api/v1/carts', {
      method: 'POST'
    })
    const data = await response.json()

    if (response.ok) {
      createCartSwal(data.payload._id)
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})

goToCartBtn?.addEventListener('click', () => {
  const cid = document.getElementById('cid').value
  window.location.href = `/cart/${cid}`
})

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/v1/users/logout', {
      method: 'GET'
    })
    logoutSwal()
  } catch (error) {
    errorSwal()
  }
})
