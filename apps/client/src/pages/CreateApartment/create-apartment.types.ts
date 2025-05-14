import type { CreateApartmentDto } from "@komuna/types";

export interface CommonApartmentProps<T extends keyof CreateApartmentDto> {
  aptDetails: CreateApartmentDto;
  updateField: UpdateFieldFn<T>;
}

export type UpdateFieldFn<T extends keyof CreateApartmentDto> = (
  field: keyof CreateApartmentDto[T],
  value: unknown
) => void;
