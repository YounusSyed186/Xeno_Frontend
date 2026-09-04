import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/customization/printing-methods')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/customization' });
  },
});
