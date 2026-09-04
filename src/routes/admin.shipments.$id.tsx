import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/shipments/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/shipments/$id"!</div>
}
