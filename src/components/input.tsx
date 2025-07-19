import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function Input({
  type,
  id,
  name,
  placeholder,
  required,
  maxlength,
  pattern,
}: PropsWithChildren<{
  type?: string | undefined;
  id?: string | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  required: boolean;
  maxlength?: number | undefined;
  pattern?: string | undefined;
}>) {
  const input = css`
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 16px;
`;

  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      class={input}
      maxlength={maxlength}
      pattern={pattern}
    />
  );
}
