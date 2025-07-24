import { createFileRoute } from '@tanstack/react-router';
import GeneralTaskDetailsPage from '../../../pages/Tasks/GeneralTaskDetailsPage';

export const Route = createFileRoute('/roommate/general-tasks/create')({
    component: RouteComponent,
});

function RouteComponent() {
    return <GeneralTaskDetailsPage />;
} 