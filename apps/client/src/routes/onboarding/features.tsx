import { createFileRoute, useNavigate } from '@tanstack/react-router';
import FeatureOnboarding from '../../components/Onboarding/FeatureOnboarding';
import { useAuth } from '../../context/auth/AuthProvider';

export const Route = createFileRoute('/onboarding/features')({
    component: FeaturesOnboarding,
});

function FeaturesOnboarding() {
    const navigate = useNavigate();
    const { sessionDetails } = useAuth();

    const handleComplete = () => {
        const homePath = sessionDetails?.role === 'LANDLORD' ? '/landlord' : '/roommate';
        navigate({ to: homePath });
    };


    return (
        <FeatureOnboarding
            onComplete={handleComplete}
            onSkip={handleComplete}
        />
    );
} 