import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/roommate/balances')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/member/balances"!</div>
}
