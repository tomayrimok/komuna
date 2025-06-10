import { useParams, useRouter } from '@tanstack/react-router';
import { IncidentResponseDto, TaskResponseDto } from 'libs/types/src/generated';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useAddEditIncident } from '../../hooks/query/useAddEditIncident';
import { useIncidentDetails } from '../../hooks/query/useIncidentDetails';
import { useApartment } from '../../hooks/useApartment';
import { useAddEditTask } from '../../hooks/query/useAddEditTask';
import { useTaskDetails } from '../../hooks/query/useTaskDetails';

type TaskMetadataContextValue = {
  taskDetails?: TaskResponseDto;
  isTaskDetailsLoading: boolean;
  isTaskDetailsError: boolean;
  taskId?: string;
  handleSave?: () => void;
  updateTaskDetails: (data: Partial<TaskResponseDto>) => void;
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

  const { history } = useRouter();

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
      // assignedTo: taskDetails.assignedTo || [],
      dueDate: taskDetails.dueDate,
      dueTime: taskDetails.dueTime,
      // isRecurrent: taskDetails.isRecurrent,
      // recurrenceRule: taskDetails.recurrenceRule,
      apartmentId: apartmentData.apartmentId!,
    });

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

  return (
    <TaskMetadataContext.Provider
      value={{
        taskDetails,
        isTaskDetailsLoading,
        isTaskDetailsError,
        taskId,
        handleSave,
        updateTaskDetails,
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
