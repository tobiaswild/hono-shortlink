import { loginSchema } from '@repo/schemas';
import type { ApiErrorResponse, ApiSuccessResponse } from '@repo/types';
import { type AnyFieldApi, useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.map((err) => err.message).join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

function RouteComponent() {
  const loginMutation = useMutation({
    mutationFn: async (values: {
      username: string;
      password: string;
    }): Promise<ApiSuccessResponse | ApiErrorResponse> => {
      const response = await fetch(`${SERVER_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      return response.json();
    },
  });

  const form = useForm({
    defaultValues: { username: '', password: '' },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      const response = await loginMutation.mutateAsync(value);

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
  });

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field
            name="username"
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>First Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="password"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </div>
  );
}
