import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GetTrailerDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  viaplay_url!: string;
}
