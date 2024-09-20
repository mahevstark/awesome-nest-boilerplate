import { AbstractTranslationDto } from '../../../common/dto/abstract.dto';
import { LanguageCode } from '../../../constants';
import { EnumFieldOptional, StringFieldOptional } from '../../../decorators';
import type { QuestionTranslationEntity } from '../question-translation.entity';

export class QuestionTranslationDto extends AbstractTranslationDto {
  @StringFieldOptional()
  title?: string;

  @StringFieldOptional()
  description?: string;

  @EnumFieldOptional(() => LanguageCode)
  languageCode?: LanguageCode;

  constructor(questionTranslationEntity: QuestionTranslationEntity) {
    super(questionTranslationEntity);
    this.title = questionTranslationEntity.title;
    this.description = questionTranslationEntity.description;
    this.languageCode = questionTranslationEntity.languageCode;
  }
}
