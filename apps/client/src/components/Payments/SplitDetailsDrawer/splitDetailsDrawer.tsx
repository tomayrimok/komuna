import { Box, Button, Card, CloseButton, Drawer, Flex, Portal, Text } from '@chakra-ui/react';
import React from 'react';
import SplitTypeTabs from './splitTypeTabs';
import { useExpense } from '../../../context/payments/ExpenseProvider';
import { Trans, useTranslation } from 'react-i18next';

interface SplitDetailsDrawerProps {
  trigger?: React.ReactNode;
}

type UserId = string;
export type UserSplits = Record<UserId, number>;

const SplitDetailsDrawer: React.FC<SplitDetailsDrawerProps> = ({ trigger }) => {
  const { open, setOpen, handleCancel, handleSaveSplits, helperText } = useExpense();
  const { t } = useTranslation();

  return (
    <Drawer.Root size="full" placement="bottom" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Trigger asChild>
        {trigger ? trigger : <Button variant="outline">{t('select-roommates')}</Button>}
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{t('payments.expense.split-options')}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <SplitTypeTabs />
            </Drawer.Body>
            <Drawer.Footer>
              <Flex direction="column" alignItems="start" me="auto">
                <Text fontSize="lg" textAlign="center">
                  <Trans defaults={helperText?.outOf} />
                </Text>
                <Text fontSize="sm" textAlign="center">
                  <Trans defaults={helperText?.remaining} />
                </Text>
              </Flex>
              <Drawer.ActionTrigger asChild>
                <Button variant="outline" onClick={handleCancel}>
                  {t('cancel')}
                </Button>
              </Drawer.ActionTrigger>
              <Button onClick={() => handleSaveSplits()}>{t('save')}</Button>
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
