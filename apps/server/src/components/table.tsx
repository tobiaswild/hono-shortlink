import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function Table({ children }: PropsWithChildren) {
  const style = css`
width: 100%;
border-collapse: collapse;
margin-top: 15px;
`;

  return <table class={style}>{children}</table>;
}
