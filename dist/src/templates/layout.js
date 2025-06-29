import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { styles } from '@/styles/main.js';
import { Style } from 'hono/css';
export default function Layout(props) {
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charset: "UTF-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("title", { children: props.title }), _jsx("link", { rel: "icon", type: "image/svg+xml", href: "/favicon.ico" }), _jsx(Style, {})] }), _jsx("body", { class: styles.body, children: props.children })] }));
}
