export const wantsHtml = (c) => {
    return (c.req.header('Accept')?.includes('text/html') || c.req.header('User-Agent')?.includes('Mozilla'));
};
