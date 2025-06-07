import { IncidentUrgency } from '@komuna/types';
import { useParams, useRouter } from '@tanstack/react-router';
import { IncidentResponseDto } from 'libs/types/src/generated';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useAddEditIncident } from '../../hooks/query/useAddEditIncident';
import { useIncidentDetails } from '../../hooks/query/useIncidentDetails';
import { useApartment } from '../../hooks/useApartment';

type IncidentMetadataContextValue = {
  incidentDetails?: IncidentResponseDto;
  isIncidentDetailsLoading: boolean;
  isIncidentDetailsError: boolean;
  incidentId?: string;
  handleSave?: () => void;
  updateIncidentDetails: (data: Partial<IncidentResponseDto>) => void;
};

export const IncidentMetadataContext = createContext<IncidentMetadataContextValue | null>(null);

export const IncidentMetadataProvider = ({ children }: PropsWithChildren<{ incidentId?: string }>) => {
  const { data: apartmentData, isLoading: isApartmentDataLoading, isError: isApartmentDataError } = useApartment();

  const [incidentDetails, setIncidentDetails] = useState<IncidentResponseDto>();

  const { incidentId } = useParams({ strict: false });
  const {
    data: incidentDetailsData,
    isLoading: isIncidentDetailsLoading,
    isError: isIncidentDetailsError,
  } = useIncidentDetails(incidentId || '');
  const { mutate: addEditIncident } = useAddEditIncident();

  const { history } = useRouter();

  useEffect(() => {
    if (!incidentDetailsData) return;
    setIncidentDetails(incidentDetailsData);
  }, [incidentDetailsData]);

  const handleSave = () => {
    if (!incidentDetails || !apartmentData?.apartmentId) return;

    addEditIncident({
      apartmentId: apartmentData.apartmentId,
      incidentId: incidentDetails.incidentId,
      urgencyLevel: incidentDetails.urgencyLevel || IncidentUrgency.MEDIUM,
      title: incidentDetails.title,
      description: incidentDetails.description,
    });

    history.back();
  };

  const updateIncidentDetails = (data: Partial<IncidentResponseDto>) => {
    setIncidentDetails((prevDetails) => {
      return {
        ...prevDetails,
        ...data,
      } as IncidentResponseDto;
    });
  };

  return (
    <IncidentMetadataContext.Provider
      value={{
        incidentDetails,
        isIncidentDetailsLoading,
        isIncidentDetailsError,
        incidentId,
        handleSave,
        updateIncidentDetails,
      }}
    >
      {children}
    </IncidentMetadataContext.Provider>
  );
};

export const useIncidentMetadata = () => {
  const context = useContext(IncidentMetadataContext);
  if (!context) {
    throw new Error('`useIncident` must be used within an `IncidentProvider`');
  }
  return context;
};
