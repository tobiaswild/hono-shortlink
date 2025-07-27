import {
  type CreateShortlinkSchema,
  createShortlinkSchema,
  type DeleteShortlinkSchema,
} from '@repo/schemas';
import type { ApiResponse, Shortlink } from '@repo/types';
import { Button } from '@repo/ui/button';
import { Cell } from '@repo/ui/cell';
import { FieldInfo } from '@repo/ui/field-info';
import { Form } from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  type CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import createHttpError from 'http-errors';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { EditModal } from '../components/edit-modal';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

const REDIRECT_HOST = 'http://localhost:3000/redirect';

const columnHelper = createColumnHelper<Shortlink>();

function RouteComponent() {
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditId(id);
    setOpenModal(true);
  };

  const handleUpdate = () => {
    setOpenModal(false);
    setEditId(null);
    shortlinks.refetch();
  };

  const createShortlinkMutation = useMutation({
    mutationFn: async (
      values: CreateShortlinkSchema,
    ): Promise<ApiResponse<Shortlink>> => {
      const response = await fetch('/api/shortlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      return response.json();
    },
    onSuccess: () => shortlinks.refetch(),
  });

  const deleteShortlinkMutation = useMutation({
    mutationFn: async (
      values: DeleteShortlinkSchema,
    ): Promise<ApiResponse<Shortlink>> => {
      const response = await fetch(`/api/shortlinks/${values.code}`, {
        method: 'DELETE',
      });

      return response.json();
    },
    onSuccess: () => shortlinks.refetch(),
  });

  const shortlinks = useQuery({
    queryKey: ['shortlinks'],
    queryFn: async (): Promise<ApiResponse<Shortlink[]>> => {
      const response = await fetch('/api/shortlinks');

      if (!response.ok) {
        throw createHttpError(response.status, response.statusText);
      }

      return await response.json();
    },
    retry: () => false,
  });

  const form = useForm({
    defaultValues: { url: '', code: '' },
    validators: { onChange: createShortlinkSchema },
    onSubmit: async ({ value }) => {
      const response = await createShortlinkMutation.mutateAsync(value);

      if (response.success) {
        toast.success(response.data.code);
      } else {
        toast.error(response.error.message);
      }
    },
  });

  const triggerDelete = async (code: string) => {
    const response = await deleteShortlinkMutation.mutateAsync({ code });

    if (response.success) {
      toast.success(`Shortlink ${response.data.code} deleted`);
    } else {
      toast.error(response.error.message);
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => <Cell>{info.getValue()}</Cell>,
    }),
    columnHelper.accessor('url', {
      header: 'URL',
      cell: (info) => (
        <Cell>
          <a href={info.getValue()} target="_blank">
            <i>{info.getValue()}</i>
          </a>
        </Cell>
      ),
    }),
    columnHelper.accessor('code', {
      header: 'Code',
      cell: (info) => (
        <Cell>
          <a href={`${REDIRECT_HOST}/${info.getValue()}`} target="_blank">
            <i>{info.getValue()}</i>
          </a>
        </Cell>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created at',
      cell: (info) => (
        <Cell>{new Date(info.getValue()).toLocaleString('de-DE')}</Cell>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated at',
      cell: (info) => (
        <Cell>{new Date(info.getValue()).toLocaleString('de-DE')}</Cell>
      ),
    }),
    {
      id: 'actions',
      header: 'Actions',
      cell: (info: CellContext<Shortlink, unknown>) => {
        const rowData = info.row.original;
        return (
          <div className="flex gap-2">
            <Button onClick={() => handleEdit(rowData.code)}>Edit</Button>
            <Button
              variant="danger"
              onClick={() => triggerDelete(rowData.code)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: shortlinks.data?.success ? shortlinks.data.data : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="flex flex-col gap-4 p-4">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            <div className="p-6">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div>
                  <form.Field name="url">
                    {(field) => (
                      <>
                        <Input
                          label="Url"
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
                  <form.Field name="code">
                    {(field) => (
                      <>
                        <Input
                          label="Code"
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
                      {isSubmitting ? 'Submitting...' : 'Create Shortlink'}
                    </Button>
                  )}
                </form.Subscribe>
              </Form>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            <div className="p-6">
              <table className="w-full table-auto border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="border-gray-400 border-b bg-gray-50 p-4"
                        >
                          <p className="block font-normal font-sans text-gray-900 leading-none antialiased opacity-70">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </p>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="border-gray-50 border-b p-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <EditModal
        code={editId}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        afterUpdate={() => handleUpdate()}
      />
    </>
  );
}
