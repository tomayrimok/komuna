import { User, UserRole } from "@komuna/types";
import axios from "axios";

export type ApartmentDetails = {
    apartmentId: string;
    name: string;
    residents: {
        userId: string;
        rent: number | null;
        role: UserRole;
        user: User | null;
    }[];
};

export const fetchApartment = async (apartmentId: string): Promise<ApartmentDetails> => {
    const response = await axios.get("/api/apartment/", {
        params: {
            apartmentId
        }
    });

    return response.data;
};
