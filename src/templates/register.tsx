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

export default function RegisterPage({ flash }: { flash?: Flash }) {
  return (
    <Layout title="Register">
      <Container variant="centered">
        <Heading level="h2">📝 Register</Heading>

        <Alert flash={flash} />

        <Form action="/auth/register" method="post">
          <FormGroup>
            <InputLabel forId="username">Username:</InputLabel>
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
            />
          </FormGroup>
          <FormGroup>
            <InputLabel forId="password">Password:</InputLabel>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
            />
          </FormGroup>
          <FormGroup>
            <InputLabel forId="confirmPassword">Confirm Password:</InputLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
            />
          </FormGroup>
          <Button type="submit" fullWidth={true} size="large">
            Create account
          </Button>
        </Form>
        <p>
          Already have an account? <Link href="/auth/login">Sign in here</Link>
        </p>
      </Container>
    </Layout>
  );
}
