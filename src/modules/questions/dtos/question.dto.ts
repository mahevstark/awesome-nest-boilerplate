import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DynamicTranslate, StaticTranslate } from '../../../decorators';
import type { QuestionEntity } from '../question.entity';
import { QuestionTranslationDto } from './question-translation.dto';

export class QuestionDto extends AbstractDto {
  @ApiPropertyOptional()
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: string;

  @ApiPropertyOptional({ type: QuestionTranslationDto, isArray: true })
  declare translations?: QuestionTranslationDto[];

  constructor(questionEntity: QuestionEntity) {
    super(questionEntity);

    this.info = 'keywords.admin';
  }
}
