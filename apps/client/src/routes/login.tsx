import { loginSchema } from '@repo/schemas';
import { AuthContainer } from '@repo/ui/auth-container';
import { Button } from '@repo/ui/button';
import { FieldInfo } from '@repo/ui/field-info';
import { Form } from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { CustomLink } from '@repo/ui/link';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import { authClient } from '../utils/auth';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: '/dashboard',
        },
        {
          onSuccess: (ctx) => {
            toast.success(ctx.response.url);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    },
  });

  const session = authClient.useSession();

  if (session.isPending) return 'Loading...';

  if (session.data !== null) {
    navigate({ to: '/dashboard' });
    return;
  }

  return (
    <AuthContainer>
      <h1>Login Form</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <>
                <Input
                  label="Email"
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
        Dont have an account? <CustomLink to="/register">Register</CustomLink>
      </div>
    </AuthContainer>
  );
}
