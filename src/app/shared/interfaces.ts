export interface User {
  email: string
  password: string
  returnSecureToken: boolean
}

export interface FireBaseAuthResponse {
  idToken: string
  expiresIn: string
}

export interface Post {
  id?: string
  title: string
  text: string
  author: string
  date: Date
}

export interface CreateFbResponse {
  name: string
}

export interface GetFbResponse {
  [key: string]: any
}
