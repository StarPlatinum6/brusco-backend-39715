import {
  errorSwal,
  uploadDocumentsSwal,
  changeRoleSwal,
  profilePictureSwal,
  checkDocumentationSwal
} from './swalCalls.js'

const d = document

const uid = d.getElementById('userId').innerText

const addDocumentsForm = d.getElementById('addDocumentsForm')
const identification = d.getElementById('identification').files
const address = d.getElementById('address').files
const statement = d.getElementById('statement').files

const addProfilePictureForm = d.getElementById('addProfilePictureForm')
const profilePictureInput = d.getElementById('profile')
const profilePicture = profilePictureInput.files

const changeRoleForm = d.getElementById('changeRoleForm')

const checkDocumentation = d.getElementById('checkDocumentation')

// Documentation upload form

addDocumentsForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(addDocumentsForm)

  for (let i = 0; i < identification.length; i++) {
    formData.append('identification', identification[i])
  }

  for (let i = 0; i < address.length; i++) {
    formData.append('address', address[i])
  }

  for (let i = 0; i < statement.length; i++) {
    formData.append('statement', statement[i])
  }

  try {
    const response = await fetch(`/api/v1/users/${uid}/documents`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()

    if (response.ok) {
      uploadDocumentsSwal()
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})

// Profile picture form

profilePictureInput.addEventListener('change', () => {
  addProfilePictureForm.dispatchEvent(new Event('submit'))
})

addProfilePictureForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(addProfilePictureForm)

  for (let i = 0; i < profilePicture.length; i++) {
    formData.append('profile', profilePicture[i])
  }

  try {
    const response = await fetch(`/api/v1/users/${uid}/profilepicture`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()

    if (response.ok) {
      profilePictureSwal()
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})

// Role change form

changeRoleForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  try {
    const response = await fetch(`/api/v1/users/premium/${uid}`, {
      method: 'POST'
    })
    const data = await response.json()

    if (response.ok) {
      changeRoleSwal()
      await fetch('/api/v1/users/logout')
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})

// Check documentation

checkDocumentation.addEventListener('click', async (e) => {
  e.preventDefault()
  try {
    const response = await fetch(`/api/v1/users/${uid}/status`, {
      method: 'POST',
      body: uid
    })
    const docs = await response.json()

    if (response.ok) {
      checkDocumentationSwal(docs.payload)
    } else {
      throw data
    }
  } catch ({ error }) {
    errorSwal(error)
  }
})
