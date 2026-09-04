import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/customization/options')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/customization' });
  },
});
