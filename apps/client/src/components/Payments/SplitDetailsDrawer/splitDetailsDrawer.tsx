import {
    Button, Card, CloseButton, Drawer, Flex, Portal
} from "@chakra-ui/react";
import React from "react";
import SplitTypeTabs from "./splitTypeTabs";
import { useExpense } from "../../../context/payments/ExpenseProvider";

interface SplitDetailsDrawerProps {
    expenseId?: string;
    trigger?: React.ReactNode;
}

type UserId = string;
export type UserSplits = Record<UserId, number>;

//todo noam edit - expense id
const SplitDetailsDrawer: React.FC<SplitDetailsDrawerProps> = ({ expenseId, trigger }) => {

    const { open, setOpen, handleCancel, handleSaveSplits } = useExpense();

    return (
        <Drawer.Root size="full" placement="bottom" open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Drawer.Trigger asChild>
                {trigger ? trigger : <Button variant="outline">בחר משתמשים</Button>}
                {/* //todo noam */}
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>אפשרויות חלוקה</Drawer.Title>
                        </Drawer.Header>
                        {/* //todo noam */}
                        <Drawer.Body>
                            <SplitTypeTabs />
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Drawer.ActionTrigger asChild>
                                <Button variant="outline" onClick={handleCancel}>ביטול</Button>
                                {/* //todo noam */}
                            </Drawer.ActionTrigger>
                            <Button onClick={() => handleSaveSplits()}>שמירה</Button>
                            {/* //todo noam */}
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};

export default SplitDetailsDrawer;
