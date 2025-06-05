import { Box, Card, Checkbox, Container, Flex, Input } from '@chakra-ui/react';
import { motion, PanInfo, useMotionValue, animate, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ShoppingListItemQuantity } from './shoppingListItemQuantity';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import { ShoppingListItemIsUrgent } from './shoppingListItemIsUrgent';
import { ShoppingListItemWithIdDto } from 'libs/types/src/generated/types.gen';

interface ShoppingListItemProps {
  item: ShoppingListItemWithIdDto;
  openEditDrawer: (item: ShoppingListItemWithIdDto) => void;
}

const DELETE_THRESHOLD = 100;
const DELETE_BUTTON_WIDTH = 80;
const SWIPE_THRESHOLD = 20;

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, openEditDrawer }) => {
  const x = useMotionValue(0);
  const hasTriggeredDelete = useRef(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const [showRedBg, setShowRedBg] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { handleDeleteItem, setActiveSwipe, updateItem, togglePurchased, setEditingItem, syncShoppingList } =
    useShoppingList();

  useMotionValueEvent(x, 'change', (latest) => {
    setShowRedBg(latest > 0);
  });

  const onDelete = () => {
    hasTriggeredDelete.current = true;
    setIsDeleted(true);
    animate(x, itemRef.current?.clientWidth || 0);
    handleDeleteItem(item.itemId);
  };

  const handleDragEnd = (info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD && info.offset.x < DELETE_BUTTON_WIDTH) animate(x, DELETE_BUTTON_WIDTH);
    else if (info.offset.x > DELETE_THRESHOLD && !hasTriggeredDelete.current) onDelete();
    else animate(x, 0);
  };

  return (
    <AnimatePresence>
      {!isDeleted && (
        <motion.div
          key={item.itemId}
          layout
          initial={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Box ref={itemRef} key={item.itemId} position="relative" overflow="hidden" mb="3" borderRadius="lg">
            {/* Delete background revealed on swipe */}
            <Box
              position="absolute"
              top="0"
              bottom="0"
              left="0"
              right="0"
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              borderRadius="lg"
              zIndex={0}
              bg={showRedBg ? 'red.500' : 'transparent'}
            >
              <Container
                m={0}
                width={`${DELETE_BUTTON_WIDTH}px`}
                color={'white'}
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={onDelete}
              >
                מחיקה
              </Container>
            </Box>

            <motion.div
              drag="x"
              dragDirectionLock
              dragElastic={0.1}
              dragConstraints={{ left: 0, right: DELETE_BUTTON_WIDTH }}
              style={{ x, touchAction: 'pan-y' }}
              onDragStart={() => {
                setActiveSwipe(item.itemId);
                hasTriggeredDelete.current = false;
              }}
              onDragEnd={(_, info: PanInfo) => handleDragEnd(info)}
            >
              <Card.Root
                borderRadius="lg"
                bg={item.isPurchased ? 'gray.50' : 'white'}
                borderWidth="1px"
                borderColor="gray.200"
                boxShadow="sm"
              >
                <Box py={2} px={3}>
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={3} flex={1}>
                      <Checkbox.Root
                        checked={item.isPurchased}
                        onCheckedChange={() => togglePurchased(item.itemId)}
                        variant={'outline'}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>

                      <Flex w="full">
                        {/* <Flex
                                                    flexGrow={1}
                                                    fontWeight={item.isUrgent ? "bold" : "medium"}
                                                    textDecoration={item.isPurchased ? "line-through" : "none"}
                                                    fontSize="md"
                                                >
                                                    {item.name}
                                                </Flex> */}

                        <Input
                          as="input"
                          fontWeight={item.isUrgent ? 'bold' : 'medium'}
                          textDecoration={item.isPurchased ? 'line-through' : 'none'}
                          fontSize="md"
                          h={'3/4'}
                          me={2}
                          value={item.name}
                          variant={'subtle'}
                          style={{ borderColor: 'transparent', backgroundColor: 'transparent', outline: 'none' }}
                          onFocus={(e) => {
                            setEditingItem(item);
                          }}
                          onChange={(e) => {
                            updateItem(item.itemId, { name: e.target.value }, false);
                          }}
                          onBlur={(e) => {
                            syncShoppingList();
                            setEditingItem(null);
                          }}
                        />

                        <ShoppingListItemQuantity
                          handleChange={(amount) => {
                            updateItem(item.itemId, { amount });
                          }}
                          amount={item.amount}
                        />
                        <ShoppingListItemIsUrgent
                          handleChange={(isUrgent) => {
                            updateItem(item.itemId, { isUrgent });
                          }}
                          isUrgent={item.isUrgent}
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>
              </Card.Root>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
