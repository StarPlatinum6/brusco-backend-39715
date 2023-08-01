import jwt from 'jsonwebtoken'

import { config } from '../config/config.js'
import { createHash, isValidPassword } from '../utils.js'

import { usersRepository } from '../repositories/index.js'
import UserDTO from '../dao/dtos/user.dto.js'

import { emailTemplates } from '../mail/templates.js'

const {
  jwt: { JWT_SECRET }
} = config

export default class UserService {
  constructor (mailService) {
    this.mailService = mailService
  }

  async getUsers () {
    try {
      const users = await usersRepository.getUsers()
      if (!users) throw new Error('No users found')

      const usersDTO = users.map((user) => {
        const userDTO = new UserDTO(user)
        return JSON.parse(JSON.stringify(userDTO))
      })

      return usersDTO
    } catch (error) {
      throw error
    }
  }

  async getUser (email) {
    try {
      const user = await usersRepository.getUser({ email })
      if (!user) throw new Error(`User with email ${email} does not exist`)
      return user
    } catch (error) {
      throw error
    }
  }

  async getUserByCartId (cartId) {
    try {
      const user = await usersRepository.getUserByCartId(cartId)
      if (!user) throw new Error(`User with cart ID ${cartId} does not exist`)
      return user
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async checkExistingUser (email) {
    try {
      const user = await usersRepository.getUser({ email })
      if (user) throw new Error(`User with email ${email} already exists`)
      return user
    } catch (error) {
      throw error
    }
  }

  async decodeUser (token) {
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET, {
        ignoreExpiration: true
      })
      return decodedToken
    } catch (error) {
      throw error
    }
  }

  passwordValidate (user, password) {
    return isValidPassword(user, password)
  }

  loginUser (user, rememberMe) {
    try {
      const userDTO = new UserDTO(user)
      const jwtUser = JSON.parse(JSON.stringify(userDTO))

      const expireTime = rememberMe ? '7d' : '3h'

      const token = jwt.sign(jwtUser, JWT_SECRET, {
        expiresIn: expireTime
      })
      if (!token) throw new Error('Auth token signing failed')

      return token
    } catch (error) {
      throw error
    }
  }

  async registerUser (newUser) {
    try {
      const user = await usersRepository.registerUser(newUser)
      if (!user) throw new Error('Error trying to create user')

      const userDTO = new UserDTO(user)
      const { email, name, role } = userDTO

      const mail = {
        to: email,
        subject: `Welcome to Ephemer Gaming ${name}!`,
        html: emailTemplates.newUserGreetingEmail(name, role)
      }

      await this.mailService.sendEmail(mail)

      return user
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async restorePasswordProcess (email) {
    try {
      const user = await usersRepository.getUser({ email })
      if (!user) throw new Error('Something went wrong')

      const userDTO = new UserDTO(user)
      const { name } = userDTO

      const token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: '1h'
      })
      if (!token) throw new Error('Auth token signing failed')

      const mail = {
        to: email,
        subject: `Your Ephemer Gaming password restore, ${name}!`,
        html: emailTemplates.passwordRestoreEmail(email, name, token)
      }

      await this.mailService.sendEmail(mail)
    } catch (error) {
      throw error
    }
  }

  async updatePassword (token, password) {
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET, {
        ignoreExpiration: true
      })
      const { email } = decodedToken
      if (Date.now() / 1000 > decodedToken.exp) {
        throw new Error('Token has expired. Request another restore link.')
      }

      const user = await usersRepository.getUser({ email })
      const samePass = this.passwordValidate(user, password)
      if (samePass) { throw new Error('Password must be different from the actual one.') }

      const hashedPassword = createHash(password)
      if (!hashedPassword) throw new Error('Password hashing failed')

      const passwordUpdate = await usersRepository.updateUser(
        { email },
        { password: hashedPassword }
      )
      if (!passwordUpdate) { throw new Error(`Password update failed for ${email}`) }
      return passwordUpdate
    } catch (error) {
      throw error
    }
  }

  async changeRole (uid) {
    try {
      const requiredStatus = ['identification', 'address', 'statement']
      const user = await usersRepository.getUser({ _id: uid })

      let missingStatus = []
      let roleChanged = false

      if (!user) {
        const user = await usersRepository.getUserByCartId(uid)
        const userStatus = user.status

        missingStatus = requiredStatus.filter((el) => !userStatus.includes(el))

        if (requiredStatus.every((el) => userStatus.includes(el)) || user.role === 'premium') {
          const role = user.role === 'user' ? 'premium' : 'user'

          roleChanged = await usersRepository.updateUser(
            { cart: uid },
            { role }
          )
        } else {
          throw new Error(`You're missing documentantion to upgrade your role: ${missingStatus.join(', ')}`)
        }
      } else {
        const userStatus = user.status

        missingStatus = requiredStatus.filter((el) => !userStatus.includes(el))

        if (requiredStatus.every((el) => userStatus.includes(el)) || user.role === 'premium') {
          const role = user.role === 'user' ? 'premium' : 'user'

          roleChanged = await usersRepository.updateUser(
            { _id: uid },
            { role }
          )
        } else {
          throw new Error(`You're missing the following documentantion to upgrade your role: ${missingStatus.join(', ')}`)
        }
      }

      if (!roleChanged) { throw new Error(`Failed to change role for user ${uid}`) }

      return roleChanged
    } catch (error) {
      throw error
    }
  }

  async deleteUser (uid) {
    try {
      const deletedUser = await usersRepository.deleteUser(uid)
      if (!deletedUser) throw new Error(`Error deleting user ${uid}`)

      return deletedUser
    } catch (error) {
      throw error
    }
  }

  async deleteUserByCartId (cid) {
    try {
      const deletedUser = await usersRepository.deleteUserByCartId(cid)
      if (!deletedUser) throw new Error(`Error deleting user ${cid}`)

      return deletedUser
    } catch (error) {
      throw error
    }
  }

  async deleteInactiveUsers (users) {
    try {
      const twoDays = 2 * 24 * 60 * 60 * 1000
      const currentTime = new Date()

      // Evaluar los usuarios inactivos
      const inactiveUsers = users.filter((user) => {
        const lastConnection = new Date(user.last_connection)
        const timeDiff = currentTime - lastConnection
        return timeDiff > twoDays
      })

      if (inactiveUsers.length === 0) throw new Error('No inactive users were found')

      const inactiveUserIds = inactiveUsers.map((user) => user.cart)

      const deletedUsers = await usersRepository.deleteInactiveUsers(inactiveUserIds)

      inactiveUsers.forEach(async (user) => {
        const mail = {
          to: user.email,
          subject: 'Ephemer Gaming - Account Deletion Notification',
          html: emailTemplates.accountDeletionEmail(user.name, user.email)
        }
        await this.mailService.sendEmail(mail)
      })

      if (!deletedUsers) throw new Error(`Error deleting user ${uid}`)

      return deletedUsers
    } catch (error) {
      throw error
    }
  }

  updateConnection (email) {
    try {
      const connection_updated = usersRepository.updateUser(
        { email },
        { last_connection: new Date() }
      )
      if (!connection_updated) throw new Error('Error updating user\'s last connection')

      return connection_updated
    } catch (error) {
      throw error
    }
  }

  async updateUserDocumentsAndStatus (email, userDocuments) {
    try {
      const newUserStatus = []
      const newUserDocuments = []
      const { documents } = await usersRepository.getUser({ email })

      Object.values(userDocuments).forEach((els) => {
        els.forEach((el) => {
          const document = {
            name: el.fieldname,
            reference: `${el.fieldname}/${el.filename}`
          }
          newUserDocuments.push(document)
        })
      })

      newUserDocuments.forEach((newUserDoc) => {
        const existingDocIndex = documents.findIndex(
          (doc) => doc.name === newUserDoc.name
        )
        if (existingDocIndex !== -1) {
          documents[existingDocIndex] = newUserDoc
        } else {
          documents.push(newUserDoc)
        }
      })

      documents.forEach((el) => {
        newUserStatus.push(el.name)
      })

      const updates = {
        documents,
        status: newUserStatus
      }

      const updatedUserDocumentsAndStatus = await usersRepository.updateUser({ email }, updates)

      return updatedUserDocumentsAndStatus
    } catch (error) {
      throw error
    }
  }

  async updateProfilePicture (email, profilePicture) {
    try {
      const newUserDocuments = []
      const { documents } = await usersRepository.getUser({ email })

      const document = {
        name: profilePicture.fieldname,
        reference: `${profilePicture.fieldname}/${profilePicture.filename}`
      }
      newUserDocuments.push(document)

      newUserDocuments.forEach((newUserDoc) => {
        const existingDocIndex = documents.findIndex(
          (doc) => doc.name === newUserDoc.name
        )
        if (existingDocIndex !== -1) {
          documents[existingDocIndex] = newUserDoc
        } else {
          documents.push(newUserDoc)
        }
      })

      const updatedUserDocumentsAndStatus = await usersRepository.updateUser({ email }, { documents })

      return updatedUserDocumentsAndStatus
    } catch (error) {
      throw error
    }
  }

  filterUserDocs (documents) {
    try {
      let userStatus = []

      documents.forEach((el) => {
        userStatus.push(el.name)
      })

      const profileIndex = userStatus.findIndex((doc) => doc === 'profile')
      userStatus.splice(profileIndex, 1)

      userStatus = userStatus.length === 0 ? undefined : userStatus

      return userStatus
    } catch (error) {
      throw error
    }
  }
}
