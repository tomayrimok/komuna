import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/landloard/apartment-details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/manager/apartment-details"!</div>
}
