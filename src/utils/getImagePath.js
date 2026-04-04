export const getImagePath = imageRawUrl => {
  if (!imageRawUrl) {
    return ''
  }

  if (
    imageRawUrl.startsWith('blob:') ||
    imageRawUrl.startsWith('data:') ||
    imageRawUrl.startsWith('http://') ||
    imageRawUrl.startsWith('https://')
  ) {
    return imageRawUrl
  }

  return `https://admin.daimfood.ru${imageRawUrl}`
}
