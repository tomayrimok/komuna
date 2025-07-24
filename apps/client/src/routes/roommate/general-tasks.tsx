import { createFileRoute } from '@tanstack/react-router';
import GeneralTasks from '../../pages/Tasks/GeneralTasks';

export const Route = createFileRoute('/roommate/general-tasks')({
    component: GeneralTasks,
}); 