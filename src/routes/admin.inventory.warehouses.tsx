import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/inventory/warehouses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/inventory/warehouses"!</div>
}
