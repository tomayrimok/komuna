import { SplitType } from '@komuna/types';
import { useParams } from '@tanstack/react-router';
import { ApartmentExpensesResponse, User } from 'libs/types/src/generated';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toaster } from '../../chakra/ui/toaster';
import EqualSplit from '../../components/Payments/SplitDetailsDrawer/equalSplit';
import NumberSplit from '../../components/Payments/SplitDetailsDrawer/numberSplit';
import PercentageSplit from '../../components/Payments/SplitDetailsDrawer/percentageSplit';
import { useAddEditExpense } from '../../hooks/useAddEditExpense';
import { useApartment } from '../../hooks/useApartment';
import { useExpenseDetails } from '../../hooks/useExpenseDetails';
import { useAuth } from '../auth/AuthProvider';
import { useShoppingList } from '../auth/ShoppingListProvider';

type SplitTypeData = {
  component: React.ReactNode;
  title: string;
  isValid: () => boolean;
  isEqual: () => boolean;
  convertToSplits: (data: any) => { [userId: string]: number };
};

type SplitTypeDataArray = { name: string } & SplitTypeData;

type ExpenseContextValue = {
  open: boolean;
  expenseId?: string;
  users: (User | null)[];
  splitType: SplitType;
  selectedUserIds: Set<string>;
  usersFixedAmounts: { [userId: string]: number };
  usersPercentage: { [userId: string]: number };
  splitTypesData: { [key: string]: SplitTypeData };
  splitTypesDataArray: SplitTypeDataArray[];
  areSplitsValuesEqual: boolean;
  setOpen: (open: boolean) => void;
  setSplitType: (splitType: SplitType) => void;
  setAmount: (amount: number) => void;
  setSelectedUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setUsersFixedAmounts: React.Dispatch<React.SetStateAction<{ [userId: string]: number }>>;
  setUsersPercentage: React.Dispatch<React.SetStateAction<{ [userId: string]: number }>>;
  handleSave: () => void;
  handleSaveSplits: () => void;
  handleCancel: () => void;
  setDescription: (description: string) => void;
  setPaidBy: (user: User) => void;
  isExpenseDetailsLoading: boolean;
  expenseDetails: ApartmentExpensesResponse;
  helperText?: {
    outOf: string;
    remaining: string;
  };
  isAddEditExpenseLoading?: boolean;
  setExtendedDescription: (extendedDescription: string) => void;
};

export const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export const ExpenseProvider = ({ children }: PropsWithChildren<{ expenseId?: string }>) => {
  const { data: apartmentData, isLoading: isApartmentDataLoading, isError: isApartmentDataError } = useApartment();
  const { mutate: createExpense, isPending: isAddEditExpenseLoading } = useAddEditExpense();
  const [open, setOpen] = useState(false);
  const [splitType, setSplitType] = useState<SplitType>(SplitType.EQUAL);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [usersFixedAmounts, setUsersFixedAmounts] = useState<{ [userId: string]: number }>({});
  const [usersPercentage, setUsersPercentage] = useState<{ [userId: string]: number }>({});
  const { currentUserDetails } = useAuth();
  const { t } = useTranslation();
  const { purchaseItems = [], markAllPurchaseItemsAsPurchased } = useShoppingList();

  const [expenseDetails, setExpenseDetails] = useState<ApartmentExpensesResponse>({
    expenseId: '',
    apartmentId: '',
    amount: 0,
    description: '',
    paidByUser: currentUserDetails || ({} as User),
    splits: {},
    paidById: currentUserDetails?.userId || '',
    createdAt: '',
  });

  const { expenseId } = useParams({ strict: false });
  const fromShoppingList = Boolean(new URLSearchParams(window.location.search).get('fromShoppingList'));

  const {
    data: expenseDetailsData,
    isLoading: isExpenseDetailsLoading,
    isError: isExpenseDetailsError,
  } = useExpenseDetails(expenseId || '');

  useEffect(() => {
    if (fromShoppingList) {
      setDescription(t('shopping.purchase_made'));
      setExtendedDescription(purchaseItems.length > 0 ? purchaseItems.map((item) => '- ' + item.name + ' (' + item.amount + ')').join('\n') : '');
    }
  }, [fromShoppingList]);

  useEffect(() => {
    if (!expenseDetailsData) return;
    setExpenseDetails(expenseDetailsData);
    const userIds = new Set(Object.keys(expenseDetailsData.splits || {}));
    setSplitType(expenseDetailsData.splitType as SplitType);
    setSelectedUserIds(userIds);

    const fixedAmounts: { [userId: string]: number } = {};
    const percentages: { [userId: string]: number } = {};

    Object.entries(expenseDetailsData?.splits || {}).forEach(([userId, value]) => {
      fixedAmounts[userId] = value;
      percentages[userId] = parseFloat(((value / expenseDetailsData.amount) * 100).toFixed(2));
    });

    setUsersFixedAmounts(fixedAmounts);
    setUsersPercentage(percentages);
  }, [expenseDetailsData]);

  const splitTypesData = useMemo(
    () => ({
      [SplitType.EQUAL]: {
        component: (
          <EqualSplit
            toggleSelectUser={(userId: string) => {
              setSelectedUserIds((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(userId)) newSet.delete(userId);
                else newSet.add(userId);
                return newSet;
              });
            }}
          />
        ),
        title: '=',
        isValid: () => selectedUserIds.size > 0,
        isEqual: () => true,
        convertToSplits: () => {
          const splits: { [userId: string]: number } = {};
          selectedUserIds.forEach((userId: any) => {
            splits[userId] = expenseDetails ? expenseDetails.amount / selectedUserIds.size : 0;
          });
          return splits;
        },
      },
      [SplitType.NUMBER]: {
        title: '1.23',
        component: (
          <NumberSplit
            setUserFixedAmount={(userId: string, amount: number) => {
              setUsersFixedAmounts((prev) => ({
                ...prev,
                [userId]: amount,
              }));
            }}
          />
        ),
        isValid: () => {
          const total = Object.values(usersFixedAmounts).reduce((acc, val) => acc + val, 0);
          return total === (expenseDetails?.amount || 0);
        },
        isEqual: () => {
          const values = Object.values(usersFixedAmounts);
          return users.every((user) => {
            const userId = user?.userId;
            return (usersFixedAmounts[userId || ''] || 0) === values[0];
          });
        },
        convertToSplits: () => {
          return { ...usersFixedAmounts };
        },
      },
      [SplitType.PERCENTAGE]: {
        title: '%',
        component: (
          <PercentageSplit
            setUserPercentage={(userId: string, percentage: number) => {
              setUsersPercentage((prev) => ({
                ...prev,
                [userId]: percentage,
              }));
            }}
          />
        ),
        isValid: () => {
          const total = Object.values(usersPercentage).reduce((acc, val) => acc + val, 0);
          return total === 100;
        },
        isEqual: () => {
          const values = Object.values(usersPercentage);
          return users.every((user) => {
            const userId = user?.userId;
            return (usersPercentage[userId || ''] || 0) === values[0];
          });
        },
        convertToSplits: () => {
          const splits: { [userId: string]: number } = {};
          const total = Object.values(usersPercentage).reduce((acc, val) => acc + val, 0);
          Object.keys(usersPercentage).forEach((userId) => {
            splits[userId] = (usersPercentage[userId] / total) * (expenseDetails?.amount || 0);
          });
          return splits;
        },
      },
    }),
    [expenseDetails, selectedUserIds, usersFixedAmounts, usersPercentage]
  );

  const users = useMemo(() => {
    if (!apartmentData) return [];
    return apartmentData.residents.map((user) => user.user);
  }, [apartmentData]);

  const areSplitsValuesEqual = useMemo(() => {
    const currentSplitTypeData = splitTypesData[splitType];
    return currentSplitTypeData.isEqual();
  }, [splitTypesData, splitType]);

  const helperText = useMemo(() => {
    if (splitType === SplitType.NUMBER) {
      const amount = Object.values(usersFixedAmounts).reduce((acc, val) => acc + val, 0);
      return {
        outOf: t('payments.expense.out-of', { total: expenseDetails?.amount + '₪', amount: amount + '₪' }),
        remaining: t('payments.expense.remaining', { amount: expenseDetails?.amount - amount + '₪' }),
      };
    }
    if (splitType === SplitType.PERCENTAGE) {
      const amount = Object.values(usersPercentage).reduce((acc, val) => acc + val, 0);
      return {
        outOf: t('payments.expense.out-of', { total: '100%', amount: amount + '%' }),
        remaining: t('payments.expense.remaining', { amount: 100 - amount + '%' }),
      };
    }
  }, [splitTypesData, splitType, usersFixedAmounts, expenseDetails?.amount]);

  useEffect(() => {
    if (!apartmentData) return;
    apartmentData.residents.forEach((user) => {
      if (selectedUserIds.has(user.userId) || !expenseId) selectUser(user.userId);
    });
  }, [apartmentData]);

  const selectUser = (userId: string) => {
    setSelectedUserIds((prev) => new Set(prev).add(userId));
  };

  const handleSaveSplits = () => {
    const currentSplitTypeData = splitTypesData[splitType];
    if (!currentSplitTypeData.isValid()) {
      toaster.error({ title: t('error.error'), description: t('error.incorrect_values'), meta: { closable: true } });
      return;
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const splits = splitTypesData[splitType].convertToSplits();
    if (!expenseDetails || !apartmentData) return;
    createExpense({
      expenseId: expenseDetails.expenseId,
      amount: expenseDetails.amount,
      description: expenseDetails.description,
      extendedDescription: expenseDetails.extendedDescription,
      paidById: expenseDetails.paidById,
      apartmentId: apartmentData.apartmentId,
      splits,
      splitType,
    });
    if (fromShoppingList) {
      markAllPurchaseItemsAsPurchased?.();
    }
  };

  const setAmount = (amount: number) => {
    setExpenseDetails((prev) => ({ ...prev, amount }));
  };

  const setDescription = (description: string) => {
    setExpenseDetails((prev) => ({ ...prev, description }));
  };

  const setExtendedDescription = (extendedDescription: string) => {
    setExpenseDetails((prev) => ({ ...prev, extendedDescription }));
  };

  const setPaidBy = (paidByUser: User) => {
    setExpenseDetails((prev) => ({ ...prev, paidByUser, paidById: paidByUser.userId }));
  };

  const setSplits = (splits: Record<string, number>) => {
    setExpenseDetails((prev) => ({ ...prev, splits }));
  };

  return (
    <ExpenseContext.Provider
      value={{
        open,
        setOpen,
        splitType,
        setSplitType,
        selectedUserIds,
        usersFixedAmounts,
        usersPercentage,
        setUsersFixedAmounts,
        setUsersPercentage,
        users,
        setAmount,
        setSelectedUserIds,
        splitTypesData,
        areSplitsValuesEqual,
        splitTypesDataArray: Object.entries(splitTypesData).map(([key, value]) => ({ ...value, name: key })),
        handleSave,
        handleSaveSplits,
        handleCancel,
        setPaidBy,
        setDescription,
        setExtendedDescription,
        expenseId,
        isExpenseDetailsLoading,
        expenseDetails,
        helperText,
        isAddEditExpenseLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('`useExpense` must be used within an `ExpenseProvider`');
  }
  return context;
};
