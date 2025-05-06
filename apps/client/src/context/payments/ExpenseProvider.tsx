import React, { createContext, useContext, useState, ReactNode, useEffect, PropsWithChildren, useMemo } from 'react';
import { User, UserRole } from '@komuna/types';
import { useApartment } from '../../hooks/useApartment';
import EqualSplit from '../../components/Payments/SplitDetailsDrawer/equalSplit';
import NumberSplit from '../../components/Payments/SplitDetailsDrawer/numberSplit';
import PercentageSplit from '../../components/Payments/SplitDetailsDrawer/percentageSplit';
import useExpenseSplits from '../../hooks/useExpenseSplits';
import { toaster } from '../../chakra/ui/toaster';
import { useCreateExpense } from '../../hooks/useCreateExpense';
import { ExpenseDetails } from '../../api/expenseDetails';
import { useParams } from '@tanstack/react-router';
import { useExpenseDetails } from '../../hooks/useExpenseDetails';

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
    // payedBy: User;
    // amount: number;
    // description: string;
    splitType: SplitType;
    selectedUserIds: Set<string>;
    usersFixedAmounts: { [userId: string]: number };
    usersPercentage: { [userId: string]: number };
    splitTypesData: { [key: string]: SplitTypeData; };
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
    expenseDetails: ExpenseDetails;
}

export type SplitType = 'equal' | 'number' | 'percentage';

export const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export const ExpenseProvider = ({ children }: PropsWithChildren<{ expenseId?: string }>) => {

    const { data: apartmentData, isLoading: isApartmentDataLoading, isError: isApartmentDataError } = useApartment('60514c72-5b94-417f-b4a3-9da2092a267f');
    const { mutate: createExpense } = useCreateExpense();
    const [open, setOpen] = useState(false);
    const [splitType, setSplitType] = useState<SplitType>('equal');
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [usersFixedAmounts, setUsersFixedAmounts] = useState<{ [userId: string]: number }>({});
    const [usersPercentage, setUsersPercentage] = useState<{ [userId: string]: number }>({});
    // const [amount, setAmount] = useState(0);
    // const [payedBy, setPayedBy] = useState<User>({ firstName: "test", lastName: "test", userId: "test", phoneNumber: "test" });
    // const [description, setDescription] = useState("");

    // now make it a big object
    const [expenseDetails, setExpenseDetails] = useState<ExpenseDetails>({
        expenseId: '',
        apartmentId: '',
        amount: 0,
        description: '',
        paidByUser: {} as User,
        splits: {},
        paidById: '',
        createdAt: '',
    });

    const { expenseId } = useParams({ strict: false });
    const { data: expenseDetailsData, isLoading: isExpenseDetailsLoading, isError: isExpenseDetailsError } = useExpenseDetails(expenseId || '');

    useEffect(() => {
        if (!expenseDetailsData) return;
        setExpenseDetails(expenseDetailsData);
        const userIds = new Set(Object.keys(expenseDetailsData.splits || {}));
        setSelectedUserIds(userIds);

        const fixedAmounts: { [userId: string]: number } = {};
        const percentages: { [userId: string]: number } = {};

        Object.entries(expenseDetailsData?.splits || {}).forEach(([userId, value]) => {
            fixedAmounts[userId] = value;
            percentages[userId] = (value / expenseDetailsData.amount) * 100;
        });

        setUsersFixedAmounts(fixedAmounts);
        setUsersPercentage(percentages);
    }, [expenseDetailsData]);


    const splitTypesData = {
        'equal': {
            component: <EqualSplit
                toggleSelectUser={(userId: string) => {
                    setSelectedUserIds(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(userId)) newSet.delete(userId);
                        else newSet.add(userId);
                        return newSet;
                    })
                }}
            />,
            title: "=",
            isValid: () => selectedUserIds.size > 0,
            isEqual: () => true,
            convertToSplits: () => {
                const splits: { [userId: string]: number } = {};
                selectedUserIds.forEach((userId: any) => {
                    splits[userId] = expenseDetails ? (expenseDetails.amount / selectedUserIds.size) : 0;
                });
                return splits;
            }
        },
        'number': {
            title: "1.23",
            component: <NumberSplit
                setUserFixedAmount={(userId: string, amount: number) => {
                    setUsersFixedAmounts(prev => ({
                        ...prev,
                        [userId]: amount
                    }));
                }}
            />,
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
            }
        },
        'percentage': {
            title: "%",
            component: <PercentageSplit
                setUserPercentage={(userId: string, percentage: number) => {
                    setUsersPercentage(prev => ({
                        ...prev,
                        [userId]: percentage
                    }));
                }}
            />,
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
                Object.keys(usersPercentage).forEach(userId => {
                    splits[userId] = (usersPercentage[userId] / total) * (expenseDetails?.amount || 0);
                });
                return splits;
            }
        }
    };

    const users = useMemo(() => {
        if (!apartmentData) return [];
        return apartmentData.residents.map(user => user.user);
    }, [apartmentData]);

    const areSplitsValuesEqual = useMemo(() => {
        const currentSplitTypeData = splitTypesData[splitType];
        return currentSplitTypeData.isEqual();
    }, [splitTypesData, splitType]);


    useEffect(() => {
        if (!apartmentData) return;
        apartmentData.residents.forEach(user => {
            if (selectedUserIds.has(user.userId) || !expenseId) selectUser(user.userId);
        });
    }, [apartmentData]);

    const selectUser = (userId: string) => {
        setSelectedUserIds(prev => new Set(prev).add(userId));
    };


    const handleSaveSplits = () => {
        const currentSplitTypeData = splitTypesData[splitType];
        if (!currentSplitTypeData.isValid()) {
            toaster.create({ title: "Error", description: "Please fill all the required fields", meta: { closable: true } }); //todo noam
            return;
        }


        setOpen(false);
    }

    const handleCancel = () => {
        setOpen(false);
    }

    const handleSave = () => {
        const splits = splitTypesData[splitType].convertToSplits();
        if (!expenseDetails || !apartmentData) return;
        createExpense({
            ...expenseDetails,
            apartmentId: apartmentData.apartmentId,
            splits,
            // amount,
            // description,
            // userId: expenseDetails.payedBy.userId
        })
    }

    const setAmount = (amount: number) => {
        console.log('amount :', amount);
        setExpenseDetails(prev => ({ ...prev, amount }));
    };

    const setDescription = (description: string) => {
        setExpenseDetails(prev => ({ ...prev, description }));
    };

    const setPaidBy = (paidByUser: User) => {
        setExpenseDetails(prev => ({ ...prev, paidByUser, paidById: paidByUser.userId }));
    };

    const setSplits = (splits: Record<string, number>) => {
        setExpenseDetails(prev => ({ ...prev, splits }));
    };


    return (
        <ExpenseContext.Provider value={{
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
            expenseId,
            isExpenseDetailsLoading,
            expenseDetails
        }}>
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
