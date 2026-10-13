import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'
const USER_SESSION_KEY = 'bonkers-user'
const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true })

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

let currentUser = getStoredUser()
let authenticated = Boolean(currentUser)
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

export function subscribeAuth(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function isAuthenticated() {
  return authenticated
}

export function getAuthenticatedUser() {
  return currentUser
}

export function setAuthenticatedUser(user) {
  currentUser = user
  authenticated = true
  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user))
  notify()
}

async function requestAuth(path, body) {
  try {
    const response = await api.post(path, body)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Authentication request failed.', { cause: error })
  }
}

export function registerUser(credentials) {
  return requestAuth('/auth/register', credentials)
}

export function loginUser(credentials) {
  return requestAuth('/auth/login', credentials)
}

export async function logoutUser() {
  try {
    const response = await api.post('/auth/logout')
    currentUser = null
    authenticated = false
    sessionStorage.removeItem(USER_SESSION_KEY)
    notify()
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed.', { cause: error })
  }
}

export { api }
