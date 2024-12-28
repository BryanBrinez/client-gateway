import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';


export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  ownerId: string

  @IsOptional()
  @IsString()
  owner?: string



//   @IsOptional()
//   @IsEnum(ProjectStatus,
//     { message: `Status must be one of the following values: ${Object.values(ProjectStatus).join(', ')}`
//   )
//   status: ProjectStatus;
}