import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { TaskResponseDto, User } from 'libs/types/src/generated';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useAddEditTask } from '../../hooks/query/useAddEditTask';
import { useDeleteTask } from '../../hooks/query/useDeleteTask';
import { useTaskDetails } from '../../hooks/query/useTaskDetails';
import { useApartment } from '../../hooks/useApartment';

type TaskMetadataContextValue = {
  taskDetails?: TaskResponseDto;
  isTaskDetailsLoading: boolean;
  isTaskDetailsError: boolean;
  taskId?: string;
  handleSave?: () => void;
  updateTaskDetails: (data: Partial<TaskResponseDto>) => void;
  toggleAssignedTo: (user: User) => void;
  handleDelete: () => void;
};

export const TaskMetadataContext = createContext<TaskMetadataContextValue | null>(null);

export const TaskMetadataProvider = ({ children }: PropsWithChildren<{ taskId?: string }>) => {
  const { data: apartmentData, isLoading: isApartmentDataLoading, isError: isApartmentDataError } = useApartment();

  const [taskDetails, setTaskDetails] = useState<TaskResponseDto>();

  const { taskId } = useParams({ strict: false });
  const {
    data: taskDetailsData,
    isLoading: isTaskDetailsLoading,
    isError: isTaskDetailsError,
  } = useTaskDetails(taskId || '');

  const { mutate: addEditTask } = useAddEditTask();
  const { mutate: deleteTask } = useDeleteTask();

  const { history } = useRouter();
  const queryClient = useQueryClient();


  useEffect(() => {
    if (!taskDetailsData) return;
    setTaskDetails(taskDetailsData);
  }, [taskDetailsData]);

  const handleSave = () => {
    if (!taskDetails || !apartmentData?.apartmentId) return;

    if (taskDetails.taskId) {
      // If taskId exists, it means we are editing an existing taskDetails
      // TODO
    }

    addEditTask({
      taskId: taskDetails.taskId,
      title: taskDetails.title,
      description: taskDetails.description,
      assignedTo: taskDetails.assignedTo || [],
      dueDate: taskDetails.dueDate,
      taskType: taskDetails.taskType,
      dueTime: taskDetails.dueTime,
      // isRecurrent: taskDetails.isRecurrent,
      // recurrenceRule: taskDetails.recurrenceRule,
      apartmentId: apartmentData.apartmentId!,
    });

    // invalidate tasks query
    queryClient.invalidateQueries({ queryKey: ['tasks', apartmentData.apartmentId] });

    history.back();
  };


  const handleDelete = () => {
    if (!taskDetails || !apartmentData?.apartmentId) return;

    deleteTask({
      taskId: taskDetails.taskId,
      apartmentId: apartmentData.apartmentId!,
    });

    // invalidate tasks query
    queryClient.invalidateQueries({ queryKey: ['tasks', apartmentData.apartmentId] });

    history.back();
  };

  const updateTaskDetails = (data: Partial<TaskResponseDto>) => {
    setTaskDetails((prevDetails) => {
      return {
        ...prevDetails,
        ...data,
      } as TaskResponseDto;
    });
  };

  const toggleAssignedTo = (user: User) => {
    setTaskDetails((prevDetails) => {
      const assignedTo = prevDetails?.assignedTo || [];
      const userIndex = assignedTo.findIndex((u) => u.userId === user.userId);
      if (userIndex > -1) {
        // User already assigned, remove them
        assignedTo.splice(userIndex, 1);
      } else {
        // User not assigned, add them
        assignedTo.push(user);
      }
      return {
        ...prevDetails,
        assignedTo,
      } as TaskResponseDto;
    }
    );
  };

  return (
    <TaskMetadataContext.Provider
      value={{
        taskDetails,
        isTaskDetailsLoading,
        isTaskDetailsError,
        taskId,
        handleSave,
        updateTaskDetails,
        toggleAssignedTo,
        handleDelete
      }}
    >
      {children}
    </TaskMetadataContext.Provider>
  );
};


export const useTaskMetadata = () => {
  const context = useContext(TaskMetadataContext);
  if (!context) {
    throw new Error('`useTaskMetadata` must be used within a `TaskMetadataProvider`');
  }
  return context;
};
