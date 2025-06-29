export function getBaseUrl(c) {
    const url = new URL(c.req.url);
    return `${url.protocol}//${url.host}`;
}
