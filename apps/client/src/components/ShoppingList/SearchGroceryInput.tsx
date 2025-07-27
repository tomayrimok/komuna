import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Box, VStack, Text, InputGroup, Spinner, Image, Flex, Stack } from '@chakra-ui/react';
import { IconShoppingBagPlus } from '@tabler/icons-react';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import { API, ApiTypes } from '@komuna/types';
import ShoppingListItemDetailsDrawer from './shoppingListItemDetailsDrawer';
import { GroceryItemCategory } from './GroceryItemCategory';

interface SearchGroceryInputProps {
  handleAddItem: (item: ApiTypes.ShoppingListItemWithIdDto) => void;
}

export const SearchGroceryInput = ({ handleAddItem }: SearchGroceryInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<ApiTypes.GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on the drawer
      const drawer = document.querySelector('[role="dialog"]');
      if (drawer?.contains(event.target as Node)) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const debouncedFetch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await API.shoppingListControllerSearchItem({
          query: {
            query: searchTerm,
          },
        });
        setSuggestions(data?.items || []);
      } catch (error) {
        console.error('Error while fetching grocery items', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetch(searchTerm);
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchTerm, debouncedFetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: ApiTypes.GroceryItem) => {
    setSearchTerm('');
    setIsOpen(false);
    handleAddItem({
      name: suggestion.description,
      amount: 1,
      isUrgent: false,
      image: suggestion.image,
      category: suggestion.category,
      isPurchased: false,
      itemId: '',
    });
    // Here you can add additional logic when a suggestion is selected
  };

  return (
    <Box position="relative" ref={containerRef} width="100%">
      <InputGroup
        onChange={handleInputChange}
        borderRadius="md"
        onClick={() => setIsOpen(true)}
        flex="1"
        backgroundColor="white"
        startElement={isLoading ? <Spinner size="sm" /> : <IconShoppingBagPlus color="currentColor" />}
      >
        <Input size="lg" value={searchTerm} placeholder={t('shopping.search_add_item')} />
      </InputGroup>

      {isOpen && searchTerm.trim() && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          zIndex={4}
          maxH="300px"
          overflowY="auto"
        >
          <VStack align="stretch" gap={0}>
            <Box
              borderBottom="1px solid"
              borderColor="gray.200"
              p={3}
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Flex direction="column" flex={1}>
                <Flex justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text fontWeight="bold">פריט חסר? הוסף את ״{searchTerm}״</Text>
                  </VStack>

                  <ShoppingListItemDetailsDrawer
                    initialText={searchTerm}
                    onClose={() => setSearchTerm('')}
                  />
                </Flex>
              </Flex>
            </Box>
            {suggestions.map((suggestion) => (
              <Box
                borderBottom="1px solid"
                borderColor="gray.200"
                key={suggestion.id}
                p={3}
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                display="flex"
                alignItems="center"
                gap={2}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Image src={suggestion.image || 'https://icons.veryicon.com/png/o/business/hotel-facilities/supermarket.png'} alt={suggestion.description} width="60px" />
                <Flex direction="column" flex={1} gap={2}>
                  <Stack flexDirection="column" alignItems="flex-start">
                    <Text fontWeight="bold">{suggestion.description}</Text>
                    <GroceryItemCategory category={suggestion.category} />
                  </Stack>
                  <Text fontSize="sm" color="gray.600">
                    {suggestion.formattedPrice} / {suggestion.priceForUnit}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};
