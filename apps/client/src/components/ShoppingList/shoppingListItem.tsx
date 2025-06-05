import { Box, Card, Checkbox, Container, Flex, Image, Textarea, VStack } from '@chakra-ui/react';
import { motion, PanInfo, useMotionValue, animate, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { ShoppingListItemQuantity } from './shoppingListItemQuantity';
import { useShoppingList } from '../../context/auth/ShoppingListProvider';
import { ShoppingListItemIsUrgent } from './shoppingListItemIsUrgent';
import { ApiTypes } from '@komuna/types';
import { GroceryItemCategory } from './GroceryItemCategory';

interface ShoppingListItemProps {
  item: ApiTypes.ShoppingListItemWithIdDto;
  openEditDrawer: (item: ApiTypes.ShoppingListItemWithIdDto) => void;
}

const DELETE_THRESHOLD = 100;
const DELETE_BUTTON_WIDTH = 80;
const SWIPE_THRESHOLD = 20;
const DEFAULT_IMAGE = 'https://icons.veryicon.com/png/o/business/hotel-facilities/supermarket.png';

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, openEditDrawer }) => {
  const x = useMotionValue(0);
  const hasTriggeredDelete = useRef(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const [showRedBg, setShowRedBg] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { handleDeleteItem, setActiveSwipe, updateItem, togglePurchased, syncShoppingList } = useShoppingList();

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

                      <Image src={item.image || DEFAULT_IMAGE} alt={item.name} w="40px" h="40px" />
                      <Flex w="full" alignItems="center" justifyContent="space-between">
                        <VStack alignItems="start">
                          <Textarea
                            fontWeight={item.isUrgent ? 'bold' : 'medium'}
                            textDecoration={item.isPurchased ? 'line-through' : 'none'}
                            fontSize="md"
                            resize="none"
                            rows={1}
                            defaultValue={item.name}
                            variant={'subtle'}
                            style={{
                              borderColor: 'transparent',
                              backgroundColor: 'transparent',
                              outline: 'none',
                              padding: '0',
                              overflow: 'hidden',
                              minHeight: '24px',
                              height: 'auto',
                            }}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = `${target.scrollHeight}px`;
                            }}
                            onChange={(e) => {
                              updateItem(item.itemId, { name: e.target.value }, false);
                            }}
                            onBlur={(e) => {
                              syncShoppingList();
                            }}
                          />
                          <GroceryItemCategory category={item.category} />
                        </VStack>

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
