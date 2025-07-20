import type { ApiMessageResponse } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import beaver from '../assets/beaver.svg';

export const Route = createFileRoute('/')({
  component: Index,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

function Index() {
  const { error, data, isFetching, refetch } = useQuery({
    queryKey: ['hello'],
    queryFn: async (): Promise<ApiMessageResponse> => {
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
          <img
            src={beaver}
            className="h-24 animate-logo-spin p-6 transition will-change-auto hover:drop-shadow-2xl hover:drop-shadow-blue-600"
            alt="beaver logo"
          />
        </a>
      </div>
      <h1 className="text-5xl">bhvr</h1>
      <h2>Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="p-8">
        <div className="flex items-center gap-8">
          <button onClick={() => refetch()} type="button">
            Call API
          </button>
          <a
            className="cursor-pointer rounded border border-transparent border-solid bg-neutral-900 px-5 py-2.5 font-medium text-white transition hover:border-blue-900 focus:outline-4"
            target="_blank"
            href="https://bhvr.dev"
            rel="noopener"
          >
            Docs
          </a>
        </div>
        {data && (
          <pre className="rounded-2xl bg-gray-600 p-8 dark:bg-amber-500">
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
