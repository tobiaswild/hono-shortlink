import {
  type CreateShortlinkSchema,
  createShortlinkSchema,
} from '@repo/schemas';
import type { ApiResponse, Shortlink } from '@repo/types';
import { Button } from '@repo/ui/button';
import { FieldInfo } from '@repo/ui/field-info';
import { Form } from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { Modal } from '@repo/ui/modal';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import createHttpError from 'http-errors';
import toast from 'react-hot-toast';

export function EditModal({
  afterUpdate,
  isOpen,
  onClose,
  code,
}: {
  code: string | null;
  isOpen: boolean;
  onClose: () => void;
  afterUpdate: () => void;
}) {
  const updateShortlinkMutation = useMutation({
    mutationFn: async (
      values: CreateShortlinkSchema,
    ): Promise<ApiResponse<Shortlink>> => {
      const response = await fetch(`/api/shortlinks/${values.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: values.url,
        }),
      });

      return response.json();
    },
    onSuccess: afterUpdate,
  });

  const { data: shortlink } = useQuery({
    queryKey: ['shortlink', code],
    queryFn: async (): Promise<ApiResponse<Shortlink>> => {
      if (!code) throw new Error('No code provided');
      const response = await fetch(`/api/shortlinks/${code}`);

      if (!response.ok) {
        throw createHttpError(response.status, response.statusText);
      }

      return await response.json();
    },
    enabled: !!code,
    retry: () => false,
  });

  const form = useForm({
    defaultValues: shortlink?.success
      ? {
          code: shortlink.data.code,
          url: shortlink.data.url,
        }
      : {
          code: code || '',
          url: '',
        },
    validators: { onChange: createShortlinkSchema },
    onSubmit: async ({ value }) => {
      const response = await updateShortlinkMutation.mutateAsync(value);

      if (response.success) {
        toast.success(response.data.code);
      } else {
        toast.error(response.error.message);
      }
    },
  });

  if (code === null) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-2 font-bold text-xl">Edit Shortlink</h2>
      <p>Update the URL for this shortlink.</p>
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
                  disabled={true}
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
              {isSubmitting ? 'Updating...' : 'Update Shortlink'}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </Modal>
  );
}
