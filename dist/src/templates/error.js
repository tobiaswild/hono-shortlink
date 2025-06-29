import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import Layout from './layout.js';
export default function ErrorPage() {
    return (_jsx(Layout, { title: "Shortlink Error", children: _jsx("p", { children: "Error" }) }));
}
