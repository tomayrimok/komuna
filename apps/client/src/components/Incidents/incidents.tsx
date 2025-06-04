import { Box, Flex, For, Icon, Image, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/auth/AuthProvider";
import { groupBy } from 'lodash';
import { format, parseISO } from 'date-fns';

import { useIncidents } from "../../hooks/query/useIncidents";
import IncidentCard from "./incidentCard";

const Incidents = () => {
    const { t } = useTranslation();
    const { currentUserDetails } = useAuth();
    const { data, isLoading } = useIncidents();
    console.log('data :', data);



    return (
        <Flex gap="2" direction="column" width="100%" p={6} pb={11}>
            {isLoading && <SkeletonText noOfLines={1} width="50%" mb="2" />}
            {data?.data && (
                !data.data?.length ? (
                    <Flex
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        mt="15vh"
                    >
                        <Image src="/meerkats/campfire.png" width="50vw" />
                        <Text fontSize="xl" fontWeight="bold" mb={2}>

                            {/* {t("payments.incident.no-incidents")} */}
                        </Text>
                    </Flex>
                ) : (

                    <For each={data.data}>
                        {(item) => <IncidentCard key={item.incidentId} item={item} />}
                    </For>


                )
            )}
        </Flex>
    );
};

export default Incidents;
