// stores/auth.js
import {defineStore} from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const ACCESS_TOKEN_KEY = 'access_token'
    const AUTH_METADATA_KEY = 'auth_metadata'
    const RESTAURANT_ID_KEY = 'restaurant_id'

    const getAccessToken = () => {
        return localStorage.getItem(ACCESS_TOKEN_KEY)
    }

    const setAccessToken = token => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token)
    }

    const getMetadata = () => {
        const rawMetadata = localStorage.getItem(AUTH_METADATA_KEY)

        if (!rawMetadata) {
            return null
        }

        try {
            return JSON.parse(rawMetadata)
        } catch {
            localStorage.removeItem(AUTH_METADATA_KEY)
            return null
        }
    }

    const setMetadata = metadata => {
        if (!metadata || typeof metadata !== 'object') {
            localStorage.removeItem(AUTH_METADATA_KEY)
            localStorage.removeItem(RESTAURANT_ID_KEY)
            return
        }

        localStorage.setItem(AUTH_METADATA_KEY, JSON.stringify(metadata))

        if (metadata.restaurant_id !== null && metadata.restaurant_id !== undefined) {
            localStorage.setItem(RESTAURANT_ID_KEY, String(metadata.restaurant_id))
            return
        }

        localStorage.removeItem(RESTAURANT_ID_KEY)
    }

    const getUserRole = () => {
        return getMetadata()?.role ?? null
    }

    const clearSession = () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(AUTH_METADATA_KEY)
        localStorage.removeItem(RESTAURANT_ID_KEY)
        sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    }

    return {
        getAccessToken,
        setAccessToken,
        getMetadata,
        setMetadata,
        getUserRole,
        clearSession,
    }
})
