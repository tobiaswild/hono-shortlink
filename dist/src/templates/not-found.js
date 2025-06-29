import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import Layout from './layout.js';
export default function NotFoundPage() {
    return (_jsx(Layout, { title: "Shortlink Not Found", children: _jsx("p", { children: "Not found" }) }));
}
