export const getImagePath = imageRawUrl => {
    if (!imageRawUrl) {
        return ''
    }

    if (
        imageRawUrl.startsWith('blob:')
        || imageRawUrl.startsWith('data:')
        || imageRawUrl.startsWith('http://')
        || imageRawUrl.startsWith('https://')
    ) {
        return imageRawUrl
    }

    return `http://87.242.102.227:5000${imageRawUrl}`
}
