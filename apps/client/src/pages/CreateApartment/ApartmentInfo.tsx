import { Button, Heading, HStack, Image, Input, Text, VStack } from "@chakra-ui/react";
import { LoginLayout } from "../Login/LoginLayout";
import { useTranslation } from "react-i18next";

export const ApartmentInfo = () => {
  const { t } = useTranslation();

  return (<>
    <VStack>
      <Text fontSize="2xl" fontWeight="bold">
        {t('login.title')}
      </Text>
      <Text>{t('login.description')}</Text>
    </VStack>

    <HStack>
      <Input
        backgroundColor="white"
        size="2xl"
        fontSize="2xl"
        type="tel"
        letterSpacing="widest"
        dir="ltr"
        placeholder="50 9999999"
        // ref={withMask('99 9999999')}
        width="200px"
      // onChange={(e) => {
      //   setPhone(e.target.value);
      // }}
      // value={phone}
      />
      <Input
        backgroundColor="white"
        fontSize="2xl"
        letterSpacing="widest"
        size="2xl"
        type="tel"
        dir="ltr"
        // onChange={(e) => setPrefix(e.target.value)}
        // value={prefix}
        placeholder="(+972)"
        // ref={withMask('(+999)')}
        width="120px"
      />
    </HStack>
    {/* <Button disabled={!phone} size="xl" fontSize="2xl" fontWeight="bold" loading={isLoading} onClick={onSendCode}>
        {t('login.send_code')}
      </Button> */}
    <Image src="/meerkats/waving.png" width="20vh" />
  </>
  );
}

export default ApartmentInfo;