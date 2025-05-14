import { Box, Card, Checkbox, Container, Flex, IconButton, Text } from "@chakra-ui/react";
import { ShoppingListItemDto } from "@komuna/types";
import { motion, PanInfo, useMotionValue, useTransform, animate, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { IconStar, IconStarFilled, IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";

interface ShoppingListItemProps {
    item: ShoppingListItemDto;
    openEditDrawer: (item: ShoppingListItemDto) => void;
    setActiveSwipe: (itemId: string) => void;
    updateItem: (itemId: string, updates: Partial<ShoppingListItemDto>) => void;
}

const DELETE_THRESHOLD = 100;
const DELETE_BUTTON_WIDTH = 80;
const SWIPE_THRESHOLD = 20;


export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, openEditDrawer, setActiveSwipe, updateItem }) => {


    const x = useMotionValue(0);
    const hasTriggeredDelete = useRef(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const [showRedBg, setShowRedBg] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    useMotionValueEvent(x, "change", (latest) => {
        setShowRedBg(latest > 0);
    });

    const onDelete = () => {
        hasTriggeredDelete.current = true;
        setIsDeleted(true);
        animate(x, itemRef.current?.clientWidth || 0);
    }

    const handleDragEnd = (info: PanInfo) => {
        if (info.offset.x > SWIPE_THRESHOLD && info.offset.x < DELETE_BUTTON_WIDTH) animate(x, DELETE_BUTTON_WIDTH);
        else if (info.offset.x > DELETE_THRESHOLD && !hasTriggeredDelete.current) onDelete();
        else animate(x, 0);
    }

    return (
        <AnimatePresence>
            {!isDeleted && (
                <motion.div
                    key={item.itemId}
                    layout
                    initial={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
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
                            bg={showRedBg ? "red.500" : "transparent"}
                        >
                            <Container
                                m={0}
                                width={`${DELETE_BUTTON_WIDTH}px`}
                                color={"white"}
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
                            style={{ x, touchAction: "pan-y" }}
                            onDragStart={() => {
                                setActiveSwipe(item.itemId);
                                hasTriggeredDelete.current = false;
                            }}
                            onDragEnd={(_, info: PanInfo) => handleDragEnd(info)}
                        >
                            <Card.Root
                                borderRadius="lg"
                                bg={item.isPurchased ? "gray.50" : "white"}
                                borderWidth="1px"
                                borderColor="gray.200"
                                boxShadow="sm"
                            >
                                <Box py={2} px={3}>
                                    <Flex justify="space-between" align="center">
                                        <Flex align="center" gap={3} flex={1}>
                                            {/* <Checkbox.Root
                                                checked={item.isPurchased}
                                                onCheckedChange={() =>
                                                    updateItem(item.itemId, { isPurchased: !item.isPurchased })
                                                }
                                                size="lg"
                                            >
                                                <Checkbox.Indicator />
                                            </Checkbox.Root> */}

                                            <Checkbox.Root
                                                checked={item.isPurchased}
                                                onCheckedChange={() =>
                                                    updateItem(item.itemId, { isPurchased: !item.isPurchased })
                                                }
                                                variant={"outline"}
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                            </Checkbox.Root>

                                            <Box>
                                                <Text
                                                    fontWeight={item.isUrgent ? "bold" : "medium"}
                                                    textDecoration={item.isPurchased ? "line-through" : "none"}
                                                    fontSize="md"
                                                >
                                                    {item.name}
                                                </Text>
                                                {item.amount > 1 && (
                                                    <Text fontSize="sm" color="gray.600">
                                                        Qty: {item.amount}
                                                    </Text>
                                                )}
                                            </Box>
                                        </Flex>
                                        <Flex gap={2}>
                                            {/* <IconButton
                                    aria-label={item.isUrgent ? "Remove urgent" : "Mark urgent"}
                                    icon={item.isUrgent ? <IconStarFilled /> : <IconStar />}
                                    variant="ghost"
                                    colorScheme={item.isUrgent ? "orange" : "gray"}
                                    onClick={() =>
                                        updateItem(item.itemId, { isUrgent: !item.isUrgent })
                                    }
                                    size="sm"
                                />
                                <IconButton
                                    aria-label="Edit item"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDrawer(item)}
                                >
                                    <IconEdit />
                                </IconButton> */}
                                        </Flex>
                                    </Flex>
                                </Box>
                            </Card.Root>
                        </motion.div>
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    )
}