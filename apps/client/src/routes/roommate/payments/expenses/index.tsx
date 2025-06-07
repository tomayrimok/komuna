import { createFileRoute } from '@tanstack/react-router';
import ExpenseDetailsPage from '../../../../components/Payments/expenseDetailsPage';

export const Route = createFileRoute('/roommate/payments/expenses/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ExpenseDetailsPage />;
}
