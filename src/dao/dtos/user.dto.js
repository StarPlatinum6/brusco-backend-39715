export default class UserDTO {
  constructor (user) {
    this.name = `${user.first_name} ${user.last_name}`
    this.email = user.email
    this.age = user.age
    this.role = user.role
    this.cart = user.cart
    this.last_connection = user.last_connection
    this.profile_picture = user.profile_picture
  }
}
