import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/roommate/shopping')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/member/shopping"!</div>
}
