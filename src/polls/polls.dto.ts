import { ApiProperty } from '@nestjs/swagger';
import { Length, IsInt, IsString, Min, Max } from 'class-validator';

export class CreatePollDto {
  @ApiProperty({
    example: 'What to do day?',
    description: 'topic',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  topic: string;

  @ApiProperty({
    example: 3,
    description: 'votesPerVoter',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  votesPerVoter: number;

  @ApiProperty({
    example: 'Player 1',
    description: 'player name',
    minLength: 1,
    maxLength: 25,
  })
  @IsString()
  @Length(1, 25)
  name: string;
}

export class JoinPollDto {
  @ApiProperty({
    example: 'test',
    description: 'topic',
    minLength: 1,
    maxLength: 6,
  })
  @IsString()
  @Length(1, 6)
  pollID: string;

  @ApiProperty({
    example: 'Player 2',
    description: 'player name',
    minLength: 1,
    maxLength: 25,
  })
  @IsString()
  @Length(1, 25)
  name: string;
}

export class NominationDto {
  @IsString()
  @Length(1, 100)
  text: string;
}
