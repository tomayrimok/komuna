export class CreateUserDto {
  phoneNumber: string;

  firstName: string;

  lastName: string;

  image?: string;
}

export class UserResponse {
  userId: string;

  phoneNumber: string;

  firstName: string;

  lastName: string;

  image?: string;
}
