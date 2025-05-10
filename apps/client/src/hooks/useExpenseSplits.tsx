import EqualSplit from "../components/Payments/SplitDetailsDrawer/equalSplit";
import NumberSplit from "../components/Payments/SplitDetailsDrawer/numberSplit";
import PercentageSplit from "../components/Payments/SplitDetailsDrawer/percentageSplit";
import { useExpense } from "../context/payments/ExpenseProvider";

const useExpenseSplits = () => {

    const { users, expenseDetails: { amount }, selectedUserIds, usersFixedAmounts, usersPercentage, setSelectedUserIds, setUsersPercentage, setUsersFixedAmounts } = useExpense();

    const splitTypes = {
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
            convertToSplits: (data: Set<string>) => {
                const splits: { [userId: string]: number } = {};
                data.forEach((userId: any) => {
                    splits[userId] = amount / selectedUserIds.size;
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
                return total === amount;
            },
            isEqual: () => {
                const values = Object.values(usersFixedAmounts);
                return users.every((user) => {
                    const userId = user?.userId;
                    return (usersFixedAmounts[userId || ''] || 0) === values[0];
                });
            },
            convertToSplits: (data: { [userId: string]: number }) => {
                return data;
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
            convertToSplits: (data: { [userId: string]: number }) => {
                const splits: { [userId: string]: number } = {};
                const total = Object.values(data).reduce((acc, val) => acc + val, 0);
                Object.keys(data).forEach(userId => {
                    splits[userId] = (data[userId] / total) * amount;
                });
                return splits;
            }
        }
    }

    return { splitTypes, splitTypesArray: Object.entries(splitTypes).map(([key, value]) => ({ ...value, name: key })) };
}

export default useExpenseSplits;