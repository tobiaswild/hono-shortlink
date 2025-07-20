import { type RegisterSchema, registerSchema } from '@repo/schemas';
import type { ApiErrorResponse, ApiSuccessResponse } from '@repo/types';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import FieldInfo from '../components/FieldInfo';
import { SERVER_URL } from '../main';
import { Button } from '@repo/ui/button';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async (
      values: RegisterSchema,
    ): Promise<ApiSuccessResponse | ApiErrorResponse> => {
      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      return response.json();
    },
  });

  const form = useForm({
    defaultValues: { username: '', password: '', confirmPassword: '' },
    validators: { onChange: registerSchema },
    onSubmit: async ({ value }) => {
      const response = await registerMutation.mutateAsync(value);

      if (response.success) {
        toast.success(response.message);

        navigate({ to: '/dashboard' });
      } else {
        toast.error(response.message);
      }
    },
  });

  return (
    <div>
      <h1>Register Form</h1>
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
                  <label htmlFor={field.name}>Username:</label>
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
                <label htmlFor={field.name}>Password:</label>
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
        <div>
          <form.Field
            name="confirmPassword"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Confirm Password:</label>
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
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
      </form>
      <div>
        Already have an acoount? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
