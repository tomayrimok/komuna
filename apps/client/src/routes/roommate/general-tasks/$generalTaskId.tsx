import { createFileRoute } from '@tanstack/react-router';
import GeneralTaskDetailsPage from '../../../pages/Tasks/GeneralTaskDetailsPage';

export const Route = createFileRoute('/roommate/general-tasks/$generalTaskId')({
    component: RouteComponent,
});

function RouteComponent() {
    return <GeneralTaskDetailsPage />;
} 