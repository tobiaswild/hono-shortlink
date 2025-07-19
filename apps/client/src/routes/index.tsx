import { createFileRoute } from '@tanstack/react-router';
import beaver from '../assets/beaver.svg';
import '../App.css';
import type { ApiResponse } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Index,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

function Index() {
  const { error, data, isFetching, refetch } = useQuery({
    queryKey: ['hello'],
    queryFn: async (): Promise<ApiResponse> => {
      const response = await fetch(`${SERVER_URL}/hello`);
      return await response.json();
    },
    enabled: false,
  });

  if (isFetching) return 'Loading...';

  if (error) return `An error has occurred: ${error.message}`;

  return (
    <>
      <div>
        <a
          href="https://github.com/stevedylandev/bhvr"
          target="_blank"
          rel="noopener"
        >
          <img src={beaver} className="logo" alt="beaver logo" />
        </a>
      </div>
      <h1>bhvr</h1>
      <h2>Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="card">
        <div className="button-container">
          <button onClick={() => refetch()} type="button">
            Call API
          </button>
          <a
            className="docs-link"
            target="_blank"
            href="https://bhvr.dev"
            rel="noopener"
          >
            Docs
          </a>
        </div>
        {data && (
          <pre className="response">
            <code>
              Message: {data.message} <br />
              Success: {data.success.toString()}
            </code>
          </pre>
        )}
      </div>
    </>
  );
}
