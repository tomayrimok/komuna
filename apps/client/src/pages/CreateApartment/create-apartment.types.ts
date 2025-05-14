import type { CreateApartmentDto } from '@komuna/types';

export type UpdateFieldFn<
  PageKey extends keyof CreateApartmentDto,
  FieldKey extends keyof CreateApartmentDto[PageKey]
> = (field: FieldKey, value: unknown) => void;

export type UpdateFieldOfPageFn = <PageKey extends keyof CreateApartmentDto>(
  page: PageKey
) => UpdateFieldFn<PageKey, keyof CreateApartmentDto[PageKey]>;

export interface CommonApartmentProps<PageKey extends keyof CreateApartmentDto> {
  aptDetails: CreateApartmentDto;
  updateField: UpdateFieldFn<PageKey, keyof CreateApartmentDto[PageKey]>;
}

