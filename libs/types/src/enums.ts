export enum UserRole {
  LANDLORD = 'LANDLORD',
  ROOMMATE = 'ROOMMATE',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  SOLVED = 'SOLVED',
}

export enum IncidentUrgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EXTREME = 'EXTREME',
}

export enum TaskType {
  GROUP = 'GROUP',
  PERSONAL = 'PERSONAL'
}

export enum ContextType {
  APARTMENT = 'APARTMENT',
  USER = 'USER',
}

export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum WeekDay {
  SU = 'SU',
  MO = 'MO',
  TU = 'TU',
  WE = 'WE',
  TH = 'TH',
  FR = 'FR',
  SA = 'SA',
}

//TODO check that this works. It's been moved into common @komuna/types
export enum RENTER_PAYMENT_WAYS {
  RENTER = 'RENTER',
  ELSE = 'ELSE',
}

export enum SplitType {
  EQUAL = 'EQUAL',
  NUMBER = 'NUMBER',
  PERCENTAGE = 'PERCENTAGE',
}
