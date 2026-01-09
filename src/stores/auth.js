// stores/auth.js
import {defineStore} from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const getAccessToken = () => {
        return localStorage.getItem('access_token')
    }

    const setAccessToken = token => {
        localStorage.setItem('access_token', token)
    }

    return {getAccessToken, setAccessToken}
})
