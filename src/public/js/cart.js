import {
  removeFromCartSwal,
  successfulOrderSwal,
  errorSwal
} from './swalCalls.js'

async function initialize () {
  const response = await fetch('/api/v1/payments/create-payment-intent')
  const { clientSecret } = await response.json()

  const appearance = {
    theme: 'night'
  }
  elements = stripe.elements({ appearance, clientSecret, locale: 'en' })

  const linkAuthenticationElement = elements.create('linkAuthentication')
  linkAuthenticationElement.mount('#link-authentication-element')

  linkAuthenticationElement.on('change', (event) => {
    emailAddress = event.value.email
  })

  const paymentElementOptions = {
    layout: 'tabs'
  }

  const paymentElement = elements.create('payment', paymentElementOptions)
  paymentElement.mount('#payment-element')
}

function showMessage (messageText) {
  const messageContainer = document.querySelector('#payment-message')

  messageContainer.classList.remove('hidden')
  messageContainer.textContent = messageText

  setTimeout(function () {
    messageContainer.classList.add('hidden')
    messageContainer.textContent = ''
  }, 7000)
}

const removeFromCartForms = document.querySelectorAll(
  '[id^="removeFromCartForm-"]'
)
const cartId = document.getElementById('cartId').textContent
const checkoutBtn = document.getElementById('checkoutBtn')

let stripe

if (checkoutBtn) {
  initialize()
  stripe = Stripe(
    'pk_test_51N3n7aFecsTNP7sgQyEV7aSUb8UMKeltJOr1yCIsiMXMb3aLjcYi2ZV7ARVrIirH3U26m0jzrI2V0xCmCyFVrltA001jmAyWed'
  )
}

let elements
let emailAddress = ''

removeFromCartForms.forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const productId = form.getAttribute('id').split('-')[1]
    const prodTitle = form
      .closest('.max-w-4xl')
      .querySelector('h5').textContent

    try {
      const response = await fetch(
        `/api/v1/carts/${cartId}/product/${productId}`,
        { method: 'DELETE' }
      )
      const data = await response.json()

      if (response.ok) {
        removeFromCartSwal(prodTitle)
      } else {
        throw data
      }
    } catch ({ error }) {
      errorSwal(error)
    }
  })
})

checkoutBtn?.addEventListener('click', async (e) => {
  e.preventDefault()

  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        receipt_email: emailAddress
      }
    })

    if (error?.type === 'card_error' || error?.type === 'validation_error') {
      showMessage(error.message)
    }

    if (paymentIntent?.status === 'succeeded') {
      const response = await fetch(`/api/v1/carts/${cartId}/purchase`, {
        method: 'POST'
      })
      const data = await response.json()

      if (response.ok) {
        const {
          payload: { code, purchaser }
        } = data
        successfulOrderSwal(code, purchaser)
      } else {
        throw data
      }
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})
