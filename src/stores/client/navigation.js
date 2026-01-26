// stores/auth.js
import {defineStore} from 'pinia'
import {ref} from "vue";

export const useNavigationStore = defineStore('navigation', () => {
    const title = ref('Заголовок')

    const changeTitle = (newTitle) => {
        title.value = newTitle
    }

    return {title, changeTitle}
})
