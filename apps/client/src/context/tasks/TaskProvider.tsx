import { createContext, useContext } from "react";
import type { TaskResponseDto } from "../../../../../libs/types/src/generated";

type TaskContextValue = {
  taskDetails?: TaskResponseDto;
  isTaskDetailsLoading: boolean;
  isTaskDetailsError: boolean;
  taskId?: string;
  handleSave?: () => void;
  updateTaskDetails: (data: Partial<TaskResponseDto>) => void;
};

export const TaskContext = createContext<TaskContextValue | null>(null);

export const TaskProvider = ({ children }: React.PropsWithChildren<{ taskId?: string }>) => {

  return (
    <TaskContext.Provider value={{ /* context values */ }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('`useTask` must be used within a `TaskProvider`');
  }
  return context;
};
