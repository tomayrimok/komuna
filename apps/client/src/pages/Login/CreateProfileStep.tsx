import { useState } from 'react';
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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LoginLayout } from './LoginLayout';
import { IconCamera } from '@tabler/icons-react';
import { useCreateProfile } from '../../hooks/query/useCreateProfile';
import { CreateUserDto, UserResponse } from '@komuna/types';

interface CreateProfileStepProps {
  phoneNumber: string;
  onUserCreatedSuccessfully: (user: UserResponse) => void;
}

export const CreateProfileStep = ({ phoneNumber, onUserCreatedSuccessfully }: CreateProfileStepProps) => {
  const { t } = useTranslation();
  const [profileDetails, setProfileDetails] = useState<CreateUserDto>({
    firstName: '',
    lastName: '',
    image: '/meerkats/waving.png',
    phoneNumber,
  });
  const { isPending, triggerCreateProfile } = useCreateProfile({
    onSuccess: (res) => onUserCreatedSuccessfully(res.user),
  });

  const onSetProfileKey = (key: keyof CreateUserDto, value: string) =>
    setProfileDetails((prev) => ({ ...prev, [key]: value }));

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

  return (
    <LoginLayout
      heading={
        <HStack justifyContent="center" position="relative" bottom="-90px" alignSelf="center">
          <FileUpload.RootProvider value={fileUpload}>
            <FileUpload.HiddenInput />
            <FileUpload.Label />
            <FileUpload.Trigger asChild>
              <Stack>
                <Avatar.Root
                  variant="solid"
                  width="160px"
                  height="160px"
                  borderWidth="3px"
                  borderColor="brand.950"
                  backgroundColor="brand.50"
                >
                  <Avatar.Fallback name={profileDetails.firstName} />
                  <Avatar.Image src={profileDetails.image} />
                </Avatar.Root>
                <IconButton
                  variant="solid"
                  background="brand.950"
                  rounded="full"
                  size="lg"
                  position="absolute"
                  bottom="0"
                  right="0"
                  color="white"
                >
                  <IconCamera />
                </IconButton>
              </Stack>
            </FileUpload.Trigger>
          </FileUpload.RootProvider>
        </HStack>
      }
    >
      <VStack width="100%" paddingX="3" gap="10">
        <VStack>
          <Text fontSize="2xl" fontWeight="bold">
            {t('create_profile.title')}
          </Text>
          <Text>{t('create_profile.description')}</Text>
        </VStack>

        <Stack width="100%" gap="6">
          <Field.Root required>
            <Field.Label fontWeight="bold" fontSize="md">
              {t('create_profile.first_name')}
            </Field.Label>
            <Input
              onChange={(e) => onSetProfileKey('firstName', e.target.value)}
              name="firstName"
              backgroundColor="white"
              size="xl"
              fontSize="xl"
              placeholder={`${t('create_profile.first_name')}...`}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label fontWeight="bold" fontSize="md">
              {t('create_profile.last_name')}
            </Field.Label>
            <Input
              onChange={(e) => onSetProfileKey('lastName', e.target.value)}
              name="lastName"
              backgroundColor="white"
              size="xl"
              fontSize="xl"
              placeholder={`${t('create_profile.last_name')}...`}
            />
          </Field.Root>
        </Stack>
      </VStack>
      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold"
        marginBottom="12"
        loading={isPending}
        disabled={!profileDetails.firstName || !profileDetails.lastName}
        onClick={() => triggerCreateProfile(profileDetails)}
      >
        {t('create_profile.create_profile')}
      </Button>
    </LoginLayout>
  );
};
