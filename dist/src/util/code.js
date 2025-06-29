import urlStore from '@/db/store/shortlink.js';
export async function getCode() {
    let code;
    do {
        code = generateCode();
    } while (await urlStore.has(code));
    return code;
}
function generateCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
