import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ApartmentTitle from './ApartmentTitle';
import { Button, Clipboard, HStack, Spacer, Text } from '@chakra-ui/react';

const shareCode = "6666";

const ShareApartmentCode: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <ApartmentTitle
        title={t("create_apartment.share_apartment.title")}
        description={t("create_apartment.share_apartment.description")} />
      <HStack>
        <Clipboard.Root value={shareCode}>
          <Clipboard.Trigger asChild>
            <Button position='fixed' margin="-40px" backgroundColor="transparent">
              <Clipboard.Indicator fontSize="2xl" />
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>

        <Text fontSize="7xl"
          fontWeight='bold'
          letterSpacing="widest">
          {shareCode}
        </Text>
      </HStack >
      <Spacer />
      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold">
        {t('create_apartment.share_apartment.close_btn')}
      </Button>
    </>
  );
}

export default ShareApartmentCode;