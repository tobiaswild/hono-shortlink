import Alert from '@/components/alert.js';
import Button from '@/components/button.js';
import Container from '@/components/container.js';
import Form from '@/components/form.js';
import FormGroup from '@/components/form-group.js';
import Heading from '@/components/heading.js';
import Input from '@/components/input.js';
import InputLabel from '@/components/input-label.js';
import Link from '@/components/link.js';
import type { Flash } from '@/util/flash.js';
import Layout from './layout.js';

export default function LoginPage({ flash }: { flash?: Flash }) {
  return (
    <Layout title="Admin Login">
      <Container variant="centered">
        <Heading level="h1" centered={true}>
          🔐 Admin Login
        </Heading>

        <Alert flash={flash} />

        <Form method="post" action="/auth/login">
          <FormGroup>
            <InputLabel for="username">Username:</InputLabel>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
            />
          </FormGroup>
          <FormGroup>
            <InputLabel for="password">Password:</InputLabel>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          <Button type="submit" fullWidth={true} size="large">
            Login
          </Button>
        </Form>
        <p>
          Don't have an account?{' '}
          <Link href="/auth/register">Create one here</Link>
        </p>
      </Container>
    </Layout>
  );
}
