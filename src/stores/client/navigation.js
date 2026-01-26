// stores/auth.js
import {defineStore} from 'pinia'
import {ref} from "vue";

export const useNavigationStore = defineStore('navigation', () => {
    const title = ref('Заголовок')
    const showBackLink = ref(false)

    const changeTitle = (newTitle) => {
        title.value = newTitle
    }

    const changeBackLinkVisible = (newVal) => {
        showBackLink.value = newVal
    }

    return {title, showBackLink, changeTitle, changeBackLinkVisible}
})
