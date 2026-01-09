import {computed} from 'vue'

export const usePhotoUtils = (photoState, options = {}) => {
    const {
        imageUrlKey = 'imageUrl',
        fileKey = 'file',
        previewUrlKey = 'previewUrl',
        getImagePath,
    } = options

    const revokePreviewUrl = () => {
        const previewUrl = photoState[previewUrlKey]
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
    }

    const resetPhotoState = () => {
        revokePreviewUrl()
        photoState[fileKey] = null
        photoState[previewUrlKey] = null
    }

    const setFile = file => {
        if (!file) {
            resetPhotoState()
            return
        }

        revokePreviewUrl()
        photoState[fileKey] = file
        photoState[previewUrlKey] = URL.createObjectURL(file)
    }

    const onUpload = event => {
        setFile(event.files?.[0])
    }

    const onClearUpload = () => {
        resetPhotoState()
    }

    const imagePreviewSrc = computed(() => {
        const previewUrl = photoState[previewUrlKey]
        if (previewUrl) {
            return previewUrl
        }

        const imageUrl = photoState[imageUrlKey]
        if (imageUrl && getImagePath) {
            return getImagePath(imageUrl)
        }

        return ''
    })

    return {
        imagePreviewSrc,
        onUpload,
        onClearUpload,
        resetPhotoState,
        setFile,
        revokePreviewUrl,
    }
}
