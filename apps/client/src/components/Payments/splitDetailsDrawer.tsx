import { Button, Card, CloseButton, Drawer, Flex, Portal } from "@chakra-ui/react"
import React, { useState } from "react";
import { useApartment } from "../../hooks/useApartment";

interface SplitDetailsDrawerProps {
    onSelect: (splits: { [userId: string]: number }) => void;
    trigger?: React.ReactNode;
}

const SplitDetailsDrawer: React.FC<SplitDetailsDrawerProps> = ({ trigger, onSelect }) => {

    const { data, isLoading, isError } = useApartment('60514c72-5b94-417f-b4a3-9da2092a267f');
    const [open, setOpen] = useState(false)

    return (
        <Drawer.Root size={'full'} placement={"bottom"} open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Drawer.Trigger asChild>
                {trigger ? trigger : <Button variant="outline">Select User</Button>}
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Drawer Title</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>

                        </Drawer.Body>
                        <Drawer.Footer>
                            <Drawer.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Drawer.ActionTrigger>
                            <Button>Save</Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}
export default SplitDetailsDrawer;