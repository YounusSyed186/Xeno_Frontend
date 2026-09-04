import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/inventory/low-stock')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/inventory' });
  },
});
