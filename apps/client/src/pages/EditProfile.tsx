import { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Field,
  FileUpload,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  useFileUpload,
  VStack,
  Card,
  Heading,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ApiTypes } from '@komuna/types';
import { IconCamera } from '@tabler/icons-react';
import { useAuth } from '../context/auth/AuthProvider';
import { useUpdateProfile } from '../hooks/query/useUpdateProfile';
import { useNavigate } from '@tanstack/react-router';
import { GoBackButton } from '../components/GoBackButton';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  image: string;
}

export const EditProfile = () => {
  const { t } = useTranslation();
  const { currentUserDetails } = useAuth();
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);

  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: currentUserDetails?.firstName || '',
    lastName: currentUserDetails?.lastName || '',
    image: currentUserDetails?.image || '/meerkats/waving.png',
  });

  const [originalData, setOriginalData] = useState<ProfileFormData>({
    firstName: currentUserDetails?.firstName || '',
    lastName: currentUserDetails?.lastName || '',
    image: currentUserDetails?.image || '/meerkats/waving.png',
  });

  const { triggerUpdateProfile, isPending } = useUpdateProfile({
    onSuccess: () => {
      setHasChanges(false);
      setOriginalData(profileData);
      navigate({ to: '/roommate' });
    },
  });

  useEffect(() => {
    if (currentUserDetails) {
      const newData = {
        firstName: currentUserDetails.firstName,
        lastName: currentUserDetails.lastName,
        image: currentUserDetails.image || '/meerkats/waving.png',
      };
      setProfileData(newData);
      setOriginalData(newData);
    }
  }, [currentUserDetails]);

  useEffect(() => {
    const isChanged =
      profileData.firstName !== originalData.firstName ||
      profileData.lastName !== originalData.lastName ||
      profileData.image !== originalData.image;
    setHasChanges(isChanged);
  }, [profileData, originalData]);

  const onSetProfileKey = (key: keyof ProfileFormData, value: string) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const fileUpload = useFileUpload({
    maxFiles: 1,
    accept: 'image/*',
    onFileAccept: (file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onSetProfileKey('image', reader.result as string);
        };
        reader.readAsDataURL(file.files[0]);
      }
    },
  });

  const handleSave = () => {
    const updateData: Partial<ApiTypes.UpdateUserDto> = {};

    if (profileData.firstName !== originalData.firstName) {
      updateData.firstName = profileData.firstName;
    }
    if (profileData.lastName !== originalData.lastName) {
      updateData.lastName = profileData.lastName;
    }
    if (profileData.image !== originalData.image) {
      updateData.image = profileData.image;
    }

    if (Object.keys(updateData).length > 0) {
      triggerUpdateProfile(updateData as ApiTypes.UpdateUserDto);
    }
  };

  const isValid = profileData.firstName.trim() && profileData.lastName.trim();

  return (
    <Box bg="brand.50" p="4" flex="1" display="flex" flexDirection="column" justifyContent="space-between">
      <VStack gap="6" maxW="md">
        {/* Header */}
        <HStack w="full" alignItems="center">
          <GoBackButton />
          <Heading size="lg" color="brand.900">
            {t('edit_profile.title')}
          </Heading>
          <Box w="8" /> {/* Spacer for centering */}
        </HStack>

        {/* Profile Image */}
        <FileUpload.RootProvider value={fileUpload} alignItems="center">
          <FileUpload.HiddenInput />
          <FileUpload.Label />
          <FileUpload.Trigger asChild display="flex" justifyContent="center" alignItems="center">
            <Stack position="relative" cursor="pointer" justifyContent="center" alignItems="center">
              <Avatar.Root
                variant="solid"
                width="120px"
                height="120px"
                borderWidth="3px"
                borderColor="brand.900"
                backgroundColor="brand.50"
              >
                <Avatar.Fallback name={profileData.firstName} />
                <Avatar.Image src={profileData.image} />
              </Avatar.Root>
              <IconButton
                variant="solid"
                background="brand.900"
                rounded="full"
                size="md"
                position="absolute"
                bottom="-2"
                right="-2"
                color="white"
                _hover={{ bg: 'brand.800' }}
              >
                <IconCamera size={16} />
              </IconButton>
            </Stack>
          </FileUpload.Trigger>
        </FileUpload.RootProvider>

        {/* Form */}
        <Card.Root w="full" p="6" bg="white" borderRadius="xl" shadow="md">
          <Stack gap="6">
            <Text textAlign="center" color="gray.600">
              {t('edit_profile.description')}
            </Text>

            <Field.Root required>
              <Field.Label fontWeight="bold" fontSize="md" color="brand.900">
                {t('create_profile.first_name')}
              </Field.Label>
              <Input
                value={profileData.firstName}
                onChange={(e) => onSetProfileKey('firstName', e.target.value)}
                name="firstName"
                backgroundColor="gray.50"
                size="lg"
                fontSize="lg"
                placeholder={`${t('create_profile.first_name')}...`}
                borderColor="gray.300"
                _focus={{ borderColor: 'brand.500', bg: 'white' }}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label fontWeight="bold" fontSize="md" color="brand.900">
                {t('create_profile.last_name')}
              </Field.Label>
              <Input
                value={profileData.lastName}
                onChange={(e) => onSetProfileKey('lastName', e.target.value)}
                name="lastName"
                backgroundColor="gray.50"
                size="lg"
                fontSize="lg"
                placeholder={`${t('create_profile.last_name')}...`}
                borderColor="gray.300"
                _focus={{ borderColor: 'brand.500', bg: 'white' }}
              />
            </Field.Root>
          </Stack>
        </Card.Root>
      </VStack>

      {/* Save Button */}
      <Button
        size="lg"
        fontSize="lg"
        fontWeight="bold"
        w="full"
        bg="brand.900"
        color="white"
        loading={isPending}
        disabled={!isValid || !hasChanges}
        onClick={handleSave}
        _hover={{ bg: 'brand.800' }}
        _disabled={{
          opacity: 0.5,
          cursor: 'not-allowed',
          bg: 'gray.400',
        }}
      >
        {t('edit_profile.save_changes')}
      </Button>
    </Box>
  );
};
