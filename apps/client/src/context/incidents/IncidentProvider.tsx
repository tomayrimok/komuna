import { API, IncidentUrgency, UserRole } from '@komuna/types';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { IncidentResponseDto } from 'libs/types/src/generated';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useIncidentDetails } from '../../hooks/query/useIncidentDetails';
import { useApartment } from '../../hooks/useApartment';
import { useAuth } from '../auth/AuthProvider';

type IncidentContextValue = {
  incidentDetails?: IncidentResponseDto;
  isIncidentDetailsLoading: boolean;
  isIncidentDetailsError: boolean;
  incidentId?: string;
  updateIncidentDetails: (data: Partial<IncidentResponseDto>, sync?: boolean) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  addComment?: () => void;
  markAsSeenByLandlord?: () => Promise<void>;
};

export const IncidentContext = createContext<IncidentContextValue | null>(null);

export const IncidentProvider = ({ children }: PropsWithChildren<{ incidentId?: string }>) => {
  const { data: apartmentData, isLoading: isApartmentDataLoading, isError: isApartmentDataError } = useApartment();
  const { currentUserDetails, sessionDetails } = useAuth();

  const [incidentDetails, setIncidentDetails] = useState<IncidentResponseDto>();
  const [newComment, setNewComment] = useState<string>('');

  const { incidentId } = useParams({ strict: false });
  const {
    data: incidentDetailsData,
    isLoading: isIncidentDetailsLoading,
    isError: isIncidentDetailsError,
  } = useIncidentDetails(incidentId || '');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!incidentDetailsData) return;
    setIncidentDetails(incidentDetailsData);
  }, [incidentDetailsData]);

  const updateIncidentDetails = async (data: Partial<IncidentResponseDto>, sync = true) => {
    setIncidentDetails((prevDetails) => {
      return {
        ...prevDetails,
        ...data,
      } as IncidentResponseDto;
    });

    if (!sync) return;

    if (!incidentDetails?.incidentId) return;

    await API.incidentControllerUpdateIncident({
      body: {
        incidentId: incidentDetails.incidentId,
        urgencyLevel: incidentDetails.urgencyLevel || IncidentUrgency.MEDIUM,
        title: incidentDetails.title || '',
        description: incidentDetails.description || '',
        ...data,
      },
    });

    queryClient.invalidateQueries({ queryKey: ['incidents', apartmentData?.apartmentId] });
  };

  const addComment = async () => {
    const commentText = newComment.trim();
    if (!commentText || !incidentDetails?.incidentId) return;

    const { data } = await API.incidentControllerNewComment({
      body: {
        incidentId: incidentDetails.incidentId,
        message: commentText,
      },
    });

    queryClient.invalidateQueries({ queryKey: ['incidents', apartmentData?.apartmentId] });

    if (!data) return;

    const newCommentData = {
      ...data,
      user: currentUserDetails!,
    };

    setIncidentDetails((prevDetails) => {
      if (!prevDetails) return prevDetails;
      return {
        ...prevDetails,
        incidentId: incidentDetails.incidentId,
        comments: [...(prevDetails.comments || []), newCommentData],
      };
    });
    setNewComment('');
  };

  const markAsSeenByLandlord = async () => {
    if (!incidentDetails?.incidentId || !apartmentData?.apartmentId) return;
    if (sessionDetails.role !== UserRole.LANDLORD) return;

    try {
      await API.incidentControllerSetOwnerSeen({
        query: {
          incidentId: incidentDetails.incidentId,
          apartmentId: apartmentData.apartmentId,
        },
      });

      setIncidentDetails((prevDetails) => {
        if (!prevDetails) return prevDetails;
        return {
          ...prevDetails,
          seenByManager: true,
        };
      });

      queryClient.invalidateQueries({ queryKey: ['incidents', apartmentData.apartmentId] });
    } catch (error) {
      console.error('Failed to mark incident as seen:', error);
    }
  };

  return (
    <IncidentContext.Provider
      value={{
        incidentDetails,
        isIncidentDetailsLoading,
        isIncidentDetailsError,
        incidentId,
        updateIncidentDetails,
        newComment,
        setNewComment,
        addComment,
        markAsSeenByLandlord,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('`useIncident` must be used within an `IncidentProvider`');
  }
  return context;
};
