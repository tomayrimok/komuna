import { ApartmentResponse, User, UserRole } from "@komuna/types";
import axios from "axios";


export const fetchApartment = async (apartmentId: string) => {
    const response = await axios.get<ApartmentResponse>("/api/apartment/", {
        params: {
            apartmentId
        }
    });

    return response.data;
};
