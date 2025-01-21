import conf from '../conf/conf.js'
import { Client, ID, Databases, Storage, Query } from 'appwrite'

export class Service {
  client = new Client()
  databases
  bucket

  constructor() {
    this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
    this.databases = new Databases(this.client)
    this.bucket = new Storage(this.client)
  }

  async createPost({
    title,
    slug,
    content,
    userid,
    email,
    status,
    image,
    username,
    storyid,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          userid,
          email,
          status,
          image,
          username,
          storyid,
        }
      )
    } catch (error) {
      console.log(`error in create post ${error}`)
      alert(error)
    }
  }

  async createStory({ title, userid, email, image, username, slug, status }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteStoriesCollectionId,
        slug,
        {
          title,
          userid,
          email,
          image,
          username,
          status,
        }
      )
    } catch (error) {
      console.log(`error in createStory ${error}`)
      alert(error)
    }
  }

  async updatePost(slug, { title, content, email, status, image, storyid }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          email,
          status,
          image,
          storyid,
        }
      )
    } catch (error) {
      console.log(`error in update post ${error}`)
    }
  }

  async updateStory(slug, { title, image, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteStoriesCollectionId,
        slug,
        {
          title,
          image,
          status,
        }
      )
    } catch (error) {
      console.log(`error in update story ${error}`)
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )
      return true
    } catch (error) {
      console.log(`error in delete post ${error}`)
      return false
    }
  }

  async deleteStory(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteStoriesCollectionId,
        slug
      )
      return true
    } catch (error) {
      console.log(`error in delete story ${error}`)
      return false
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )
    } catch (error) {
      console.log('Appwrite service :: getPost :: error', error)
      return false
    }
  }

  async getStory(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteStoriesCollectionId,
        slug
      )
    } catch (error) {
      console.log(
        `Appwrite service :: getStory :: error in ${slug} fileId`,
        error
      )
      return false
    }
  }

  async getPosts(limitQuery, offsetQuery) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal('status', 'active'), limitQuery, offsetQuery]
      )
    } catch (error) {
      console.log('Appwrite serive :: getPosts :: error', error)

      return false
    }
  }

  async getStories(limitQuery, offsetQuery) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteStoriesCollectionId,
        [Query.equal('status', 'active'), limitQuery, offsetQuery]
      )
    } catch (error) {
      console.log('Appwrite serive :: getStories :: error', error)

      return false
    }
  }

  async getAllPosts() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal('status', 'active')]
      )
    } catch (error) {
      console.log('Appwrite serive :: getAllPosts :: error', error)

      return false
    }
  }

  async getUserAllPosts(userid) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal('userid', `${userid}`)]
      )
    } catch (error) {
      console.log('Appwrite serive :: getUserAllPosts :: error', error)

      return false
    }
  }

  async getUserAllStories(userid) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteStoriesCollectionId,
        [Query.equal('userid', `${userid}`)]
      )
    } catch (error) {
      console.log('Appwrite serive :: getUserAllStories :: error', error)

      return false
    }
  }

  async getUserAllStoriesPost(storyid) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal('storyid', `${storyid}`)]
      )
    } catch (error) {
      console.log('Appwrite serive :: getUserAllStoriesPost :: error', error)

      return false
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      )
    } catch (error) {
      console.log('Appwrite serive :: uploadFile :: error', error)
      return false
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId)
      return true
    } catch (error) {
      console.log('Appwrite serive :: deleteFile :: error', error)
      return false
    }
  }

  getFilePreviews(fileId, height, width, quality) {
    try {
      return this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId,
        width || 0,
        height || 0,
        'center', // crop center
        quality || '70', // slight compression
        0, // border width
        '000', // border color
        0, // border radius
        1, // full opacity
        0, // no rotation
        'FFFFFF', // background color
        'webp' // output jpg format
      )
    } catch (error) {
      console.log(
        error,
        `Appwrite error || getFilePreviews in ${fileId} fileId`
      )
    }
  }
}

const service = new Service()
export default service
