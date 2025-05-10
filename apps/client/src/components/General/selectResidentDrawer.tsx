import { Button, Card, CloseButton, Drawer, Flex, Portal } from "@chakra-ui/react"
import React, { useState } from "react";
import { useApartment } from "../../hooks/useApartment";
import UserCard from "./userCard";
import { User } from "@komuna/types";

interface SelectUserDrawerProps {
    onSelect: (user: User) => void;
    trigger?: React.ReactNode;
}

const SelectUserDrawer: React.FC<SelectUserDrawerProps> = ({ trigger, onSelect }) => {

    const { data, isLoading, isError } = useApartment();
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
                            <Drawer.Title>Select User</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <Flex direction="column" gap="3">
                                {data && data.residents.map((user) => {
                                    if (!user.user) return null;
                                    return <UserCard
                                        key={user.userId}
                                        user={user.user}
                                        onClick={() => {
                                            onSelect(user.user!);
                                            setOpen(false);
                                        }}
                                    />
                                })}
                            </Flex>
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}
export default SelectUserDrawer;