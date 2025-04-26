import { Badge, Button, CloseButton, Container, Drawer, Field, Flex, Input, Kbd, NumberInput, Portal, Text } from "@chakra-ui/react";
import { useState } from "react";
import SelectUserDrawer from "../General/selectResidentDrawer";
import SplitDetailsDrawer from "./splitDetailsDrawer";
import { User } from "@komuna/types"

const CreateExpensePage = () => {
    const [amount, setAmount] = useState(0);
    const [payedBy, setPayedBy] = useState<User | null>({ firstName: "test", lastName: "test", userId: "test", phoneNumber: "test" });
    const [splits, setSplits] = useState<{ [userId: string]: number }>({});

    const areSplitsValuesEqual = () => {
        const values = Object.values(splits);
        return values.every((value) => value === values[0]);
    }

    return (
        <Container>
            <Text>
                Create Expense Page
            </Text>

            <Input placeholder="Description" />

            <Flex direction="row" gap="2" alignItems="center">
                <NumberInput.Root
                    maxW="200px"
                    onValueChange={(e) => setAmount(Number(e.value))}
                >
                    <NumberInput.Control />
                    <NumberInput.Input placeholder="0.00" />
                </NumberInput.Root>
                <Text fontSize="xl" >
                    ₪
                </Text>
            </Flex>
            <Flex direction="row" gap="2" alignItems="center">
                <Text>
                    שולם על ידי
                </Text>
                <SelectUserDrawer
                    onSelect={(userId) => setPayedBy(userId)}
                    trigger={<Button px={1} py={0} h="unset" variant={"surface"}>
                        {payedBy?.firstName} {payedBy?.lastName}
                    </Button>}
                />
                <Text>
                    ומתחלק
                </Text>
                <SplitDetailsDrawer
                    onSelect={(splits) => setSplits(splits)}
                    trigger={<Button px={1} py={0} h="unset" variant={"surface"}>
                        {areSplitsValuesEqual() ? 'בצורה שווה' : 'בצורה לא שווה'}
                    </Button>}
                />
            </Flex>

        </Container>
    );
}
export default CreateExpensePage;