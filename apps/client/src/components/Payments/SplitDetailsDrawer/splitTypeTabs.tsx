import { Tabs } from "@chakra-ui/react";
import { useExpense } from "../../../context/payments/ExpenseProvider";
import { SplitType } from "@komuna/types";

const SplitTypeTabs = () => {

    const { splitType, setSplitType, splitTypesDataArray } = useExpense();

    return (
        <Tabs.Root value={splitType} variant="plain" fitted onValueChange={(e) => setSplitType(e.value as SplitType)}>

            <Tabs.List bg="bg.muted" rounded="l3" p="1" w="full" mb={6}>
                {splitTypesDataArray.map((splitType) => (
                    <Tabs.Trigger key={splitType.name} value={splitType.name}>
                        {splitType.title}
                    </Tabs.Trigger>
                ))}
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>

            {splitTypesDataArray.map((splitType) => (
                <Tabs.Content key={splitType.name} value={splitType.name}>
                    {splitType.component}
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
};

export default SplitTypeTabs;
