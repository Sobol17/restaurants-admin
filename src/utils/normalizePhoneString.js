export const normalizePhoneString = (phoneString) => {
    return phoneString.replace(/(?!^\+)\D/g, '')
}