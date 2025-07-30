import { Button, Card, CloseButton, ConditionalValue, Drawer, Flex, Portal } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useApartment } from '../../hooks/useApartment';
import UserCard from './userCard';
import { useTranslation } from 'react-i18next';
import { User } from 'libs/types/src/generated';

interface SelectUserDrawerProps {
  title?: string;
  onSelect: (user: User) => void;
  trigger?: React.ReactNode;
  size: ConditionalValue<'sm' | 'md' | 'lg' | 'xl' | 'xs' | 'full' | undefined>;
  multiple?: boolean;
  selected?: string[];
}

const SelectUserDrawer: React.FC<SelectUserDrawerProps> = ({ trigger, size, title, onSelect, multiple = false, selected }) => {
  const { data, isLoading, isError } = useApartment();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Drawer.Root size={size || 'full'} placement={'bottom'} open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Trigger asChild>
        {trigger ? trigger : <Button variant="outline">{multiple ? t('select-roommates') : t('select-roommate')}</Button>}
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{title || (multiple ? t('select-roommates') : t('select-roommate'))}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body maxH={'50vh'}>
              <Flex direction="column" gap="3" pb={4}>
                {data &&
                  data.residents.map((user) => {
                    if (!user.user) return null;
                    return (
                      <UserCard
                        key={user.userId}
                        user={user.user}
                        onClick={() => {
                          onSelect(user.user!);
                          if (!multiple) setOpen(false);
                        }}
                        selected={multiple ? selected?.includes(user.userId) : undefined}
                      />
                    );
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
  );
};
export default SelectUserDrawer;
