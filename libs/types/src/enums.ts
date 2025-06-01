export enum UserRole {
  LANDLORD = 'LANDLORD',
  ROOMMATE = 'ROOMMATE',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  SOLVED = 'SOLVED',
}

export enum ContextType {
  APARTMENT = 'APARTMENT',
  USER = 'USER',
}

//TODO check that this works. It's been moved into common @komuna/types
export enum RENTER_PAYMENT_WAYS {
  RENTER = "RENTER",
  EQUALLY = "EQUALLY",
  ELSE = "ELSE", // TODO this must be a user id! Might need to change the whole type of this field
}
