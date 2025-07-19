import { css } from 'hono/css';
import Alert from '@/components/alert.js';
import Button from '@/components/button.js';
import Container from '@/components/container.js';
import Form from '@/components/form.js';
import FormGroup from '@/components/form-group.js';
import Heading from '@/components/heading.js';
import Input from '@/components/input.js';
import InputLabel from '@/components/input-label.js';
import Link from '@/components/link.js';
import Table from '@/components/table.js';
import TableBody from '@/components/table-body.js';
import TableData from '@/components/table-data.js';
import TableHead from '@/components/table-head.js';
import TableHeader from '@/components/table-header.js';
import TableRow from '@/components/table-row.js';
import type { User } from '@/db/schema/user.js';
import type { Shortlink } from '@/db/types/shortlink.js';
import Layout from '@/templates/layout.js';
import type { Flash } from '@/util/flash.js';

export default function DashboardPage({
  shortlinks,
  baseUrl,
  user,
  flash,
}: {
  shortlinks: Shortlink[];
  baseUrl: string;
  user: User;
  flash?: Flash;
}) {
  const styles = {
    header: css`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  `,
    stats: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  `,
    statCard: css`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`,
    statNumber: css`
    font-size: 2rem;
    font-weight: bold;
    color: #2563eb;
  `,
    statLabel: css`
    color: #666;
    margin-top: 5px;
  `,
    section: css`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  `,
    shortlinkCode: css`
    font-family: monospace;
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 4px;
    color: #dc2626;
  `,
    shortlinkUrl: css`
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
    linkReset: css`
  
`,
    buttons: css`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`,
    openBtn: css`

}
`,
  };

  return (
    <Layout title="Admin Dashboard">
      <Container>
        <div class={styles.header}>
          <Heading level="h1">🔗 Admin Dashboard</Heading>
          <p>
            Welcome, {user.username}! Manage your shortlinks and create new ones
          </p>
          <Form method="post" action="/auth/logout">
            <Button type="submit" variant="danger">
              Logout
            </Button>
          </Form>
        </div>

        <Alert flash={flash} />

        <div class={styles.stats}>
          <div class={styles.statCard}>
            <div class={styles.statNumber}>{shortlinks.length}</div>
            <div class={styles.statLabel}>Your Shortlinks</div>
          </div>
        </div>

        <div class={styles.section}>
          <Heading level="h2">➕ Create New Shortlink</Heading>
          <Form method="post" action="/shortlinks">
            <FormGroup>
              <InputLabel for="url">Target URL:</InputLabel>
              <Input
                type="url"
                id="url"
                name="url"
                placeholder="https://example.com"
                required
              />
            </FormGroup>
            <FormGroup>
              <InputLabel for="customCode">
                Custom Code (optional, 6 characters):
              </InputLabel>
              <Input
                type="text"
                id="customCode"
                name="customCode"
                placeholder="Leave empty for auto-generated"
                maxlength={6}
                pattern="[A-Za-z0-9]{6}"
                required={false}
              />
            </FormGroup>
            <Button type="submit" size="large">
              Create Shortlink
            </Button>
          </Form>
        </div>

        <div class={styles.section}>
          <Heading level="h2">📋 Your Shortlinks</Heading>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Code</TableHeader>
                <TableHeader>Target URL</TableHeader>
                <TableHeader>Short URL</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {shortlinks.map((link) => (
                <TableRow>
                  <TableData>{link.id}</TableData>
                  <TableData>
                    <span class={styles.shortlinkCode}>{link.code}</span>
                  </TableData>
                  <TableData class={styles.shortlinkUrl} title={link.url}>
                    {link.url}
                  </TableData>
                  <TableData
                    class={styles.shortlinkUrl}
                    title={`${baseUrl}/${link.code}`}
                  >
                    {baseUrl}/{link.code}
                  </TableData>
                  <TableData class={styles.buttons}>
                    <Link
                      href={`${baseUrl}/${link.code}`}
                      target="_blank"
                      variant="button"
                    >
                      Open
                    </Link>

                    <Form
                      method="post"
                      action={`/shortlinks/${link.code}/delete`}
                    >
                      <Button
                        type="submit"
                        variant="danger"
                        data-code={link.code}
                      >
                        Delete
                      </Button>
                    </Form>
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    </Layout>
  );
}
