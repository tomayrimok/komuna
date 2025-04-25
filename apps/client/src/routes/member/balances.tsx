import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/member/balances')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/member/balances"!</div>
}
