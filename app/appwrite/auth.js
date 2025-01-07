import conf from '../conf/conf'
import { Client, Account, ID, OAuthProvider } from 'appwrite'

export class AuthService {
  client = new Client()
  account
  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
    this.account = new Account(this.client)
  }

  async createAccount({ email, password, name }) {
    const id = ID.unique()
    try {
      const userAccount = await this.account.create(id, email, password, name)
      console.log(userAccount, 'user account create')

      if (userAccount) {
        const user = await this.userLogin({ email, password })
        console.log(user, 'login')

        return user
      } else {
        return userAccount
      }
    } catch (error) {
      throw error
    }
  }

  async verifyEmailLogin() {
    try {
      const verification = await this.account.createVerification(
        'https://www.rogblog.me/SucessfullEmailVerification'
      )
      return verification
    } catch (error) {
      console.log(error, 'error in appwrite :: verifyEmailLogin')
    }
  }

  async SuccessfullverifyEmailLogin({ userId, secret }) {
    try {
      const verification = await this.account.updateVerification(userId, secret)
      return verification
    } catch (error) {
      console.log(error, 'error in appwrite :: SuccessfullverifyEmailLogin')
    }
  }

  async createGoogleLogin() {
    try {
      const user = await this.account.createOAuth2Token(
        OAuthProvider.Google,
        'https://www.rogblog.me',
        'https://www.rogblog.me/fail'
      )
      if (user) {
        return user
      }
    } catch (error) {
      console.error(error, 'appwrite error :: google login')
    }
  }

  async verifyGoogleLogin({ userId, secret }) {
    try {
      const user = await this.account.createSession(userId, secret)

      if (user) {
        return user
      }
    } catch (error) {
      console.error(error, 'appwrite error :: verify google login')
    }
  }

  async userLogin({ email, password }) {
    try {
      console.log(email, password);
      
      return await this.account.createEmailPasswordSession(email, password)
    } catch (error) {
      console.error(error, 'appwrite error :: userLogin')
      return error
    }
  }

  async recoverPassword({ email }) {
    try {
      return await this.account.createRecovery(
        email,
        'https://www.rogblog.me/resetSucessfullPassword'
      )
    } catch (error) {
      console.error(error, 'appwrite error :: recoverPassword')
      return error
    }
  }

  async resetPasswordSuccessfully({
    userId,
    secret,
    password,
    confirmPassword,
  }) {
    try {
      return await this.account.updateRecovery(
        userId,
        secret,
        password,
        confirmPassword
      )
    } catch (error) {
      console.error(error, 'appwrite error :: resetPasswordSuccessfully')
      return error
    }
  }

  async getCurrentUser() {
    try {
      const currentUser = await this.account.get()

      return currentUser
    } catch (error) {
      console.log(error)
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions()
    } catch (error) {
      throw error
    }
  }
}

const authService = new AuthService()

export default authService
