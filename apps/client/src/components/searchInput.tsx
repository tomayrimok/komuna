import { Icon, Input, InputGroup } from "@chakra-ui/react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "ref"> {
    handleChange?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ handleChange, ...props }) => {

    const [value, setValue] = useState(props.defaultValue || "");
    const inputRef = useRef<HTMLInputElement | null>(null)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        handleChange?.(e.target.value);
    };

    useEffect(() => {
        if (props.value !== undefined) {
            setValue(props.value);
        }
    }, [props.value]);

    const EndElement = () => {
        return (
            <Icon color={"gray.400"} size={"md"} onClick={() => {
                if (value) {
                    setValue("");
                    handleChange?.("");
                    inputRef.current?.focus();
                }
            }}>
                {!value ? <IconSearch /> : <IconX />}
            </Icon>
        );
    }

    return (
        <InputGroup endElement={<EndElement />} mb={4}>
            <Input
                {...props}
                size="lg"
                borderRadius="md"
                style={{ outline: "none" }}
                onChange={onChange}
                value={value}
                ref={inputRef}
            />
        </InputGroup>
    );
};

export default SearchInput;