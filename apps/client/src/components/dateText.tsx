import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

interface DateTextProps {
    date: string;
}

export const DateText: React.FC<DateTextProps> = ({ date }) => {

    const month = format(parseISO(date), 'M')
    const day = format(parseISO(date), 'dd')
    const year = format(parseISO(date), 'yyyy')

    const { t } = useTranslation();

    return (
        `${day} ${t(`months.${month}` as any)} ${year}`
    );
}
export default DateText;
