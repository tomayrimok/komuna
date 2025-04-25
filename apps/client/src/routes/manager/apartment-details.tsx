import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manager/apartment-details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/manager/apartment-details"!</div>
}
