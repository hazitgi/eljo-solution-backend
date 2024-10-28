import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum Role {
  ADMIN = 'admin',
  QC_INSPECTOR = 'qc_inspector',
}
registerEnumType(Role, {
  name: 'Role', // This name is used in the GraphQL schema
});

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field(() => Role)
  @IsString()
  @IsOptional()
  role: Role | null = Role.QC_INSPECTOR;
}
