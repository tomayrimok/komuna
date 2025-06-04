import { IncidentStatus, IncidentUrgency } from '@komuna/types';
import { useParams } from '@tanstack/react-router';
import { CreateIncidentDto, Incident, User } from 'libs/types/src/generated';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApartment } from '../../hooks/useApartment';
import { useAuth } from '../auth/AuthProvider';
import { useAddEditIncident } from '../../hooks/query/useAddEditIncident';
import { useIncidentDetails } from '../../hooks/query/useIncidentDetails';




type IncidentContextValue = {
    incidentDetails?: Incident;
    isIncidentDetailsLoading: boolean;
    isIncidentDetailsError: boolean;
    isAddEditIncidentLoading: boolean;
    createIncident: (data: CreateIncidentDto) => void;
    incidentId?: string;
    handleSave?: () => void;
    updateIncidentDetails: (data: Partial<Incident>) => void;
    newComment: string;
    setNewComment: (comment: string) => void;

}


export const IncidentContext = createContext<IncidentContextValue | null>(null);

export const IncidentProvider = ({ children }: PropsWithChildren<{ incidentId?: string }>) => {

    const { data: apartmentData, isLoading: isApartmentDataLoading, isError: isApartmentDataError } = useApartment();
    const { mutate: createIncident, isPending: isAddEditIncidentLoading } = useAddEditIncident();
    const { currentUserDetails } = useAuth();
    const { t } = useTranslation();

    const [incidentDetails, setIncidentDetails] = useState<Incident>();
    const [newComment, setNewComment] = useState<string>('');

    const { incidentId } = useParams({ strict: false });
    const { data: incidentDetailsData, isLoading: isIncidentDetailsLoading, isError: isIncidentDetailsError } = useIncidentDetails(incidentId || '');
    const { mutate: addEditIncident } = useAddEditIncident();


    useEffect(() => {
        if (!incidentDetailsData) return;
        setIncidentDetails(incidentDetailsData);
    }, [incidentDetailsData]);

    const updateIncidentDetails = (data: Partial<Incident>) => {
        setIncidentDetails((prevDetails) => {
            if (!prevDetails) return data as Incident;
            return {
                ...prevDetails,
                ...data,
            } as Incident;
        });
    };

    const handleSave = () => {
        if (!incidentDetails) return;
        addEditIncident({
            ...incidentDetails,
            apartmentId: apartmentData?.apartmentId || '',
        });
    }

    const addComment = (incidentId: string, commentText: string) => {
        if (!commentText.trim()) return;

        const newNote = {
            id: Date.now(),
            text: commentText,
            author: 'משתמש נוכחי',
            createdAt: new Date().toISOString()
        };

        // setIncidents(prev => prev.map(incident =>
        //   incident.incidentId === incidentId
        //     ? { ...incident, notes: [...incident.notes, newNote] }
        //     : incident
        // ));
    };

    return (
        <IncidentContext.Provider value={{
            incidentDetails,
            isIncidentDetailsLoading,
            isIncidentDetailsError,
            isAddEditIncidentLoading,
            createIncident,
            incidentId,
            handleSave,
            updateIncidentDetails,
            newComment,
            setNewComment
        }}>
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
