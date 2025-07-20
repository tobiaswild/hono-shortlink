import { type RegisterSchema, registerSchema } from '@repo/schemas';
import type { ApiErrorResponse, ApiSuccessResponse } from '@repo/types';
import { AuthContainer } from '@repo/ui/auth-container';
import { Button } from '@repo/ui/button';
import { FieldInfo } from '@repo/ui/field-info';
import { Form } from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { CustomLink } from '@repo/ui/link';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import { SERVER_URL } from '../main';

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
    <AuthContainer>
      <h1>Register Form</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="username">
            {(field) => (
              <>
                <Input
                  label="Username"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="password">
            {(field) => (
              <>
                <Input
                  label="Password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="confirmPassword">
            {(field) => (
              <>
                <Input
                  label="Confirm Password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              fullWidth={true}
              size="large"
            >
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        </form.Subscribe>
      </Form>
      <div>
        Already have an acoount? <CustomLink to="/login">Login</CustomLink>
      </div>
    </AuthContainer>
  );
}
