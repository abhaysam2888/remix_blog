import conf from '../conf/conf'
import { Client, Account, ID, OAuthProvider } from "appwrite";

export class AuthService{
    client = new Client();
    account;
    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }
 
    async createAccount({email,password,name}) {
        const id = ID.unique()
        try {
            const userAccount = await this.account.create(id, email, password, name);
            if(userAccount){
                return this.userLogin({email, password});
            }else{
                return userAccount
            }
        } catch (error) {
            throw error;
        }
    }

    async userLogin({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.log(error)
        }
    }
    
    async logout() {
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService