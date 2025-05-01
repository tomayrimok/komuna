import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (context.currentUserDetails) {
      throw redirect({ to: '/select-apartment' });
    } else {
      throw redirect({ to: '/login' });
    }
  },

  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>TODO: Here there will be onboarding, showcase of all features, then login</h3>
    </div>
  );
}
