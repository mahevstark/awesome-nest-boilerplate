import { CreateTranslationDto } from '../../../common/dto/create-translation.dto';
import { TranslationsField } from '../../../decorators';

export class CreateQuestionDto {
  @TranslationsField({ type: CreateTranslationDto })
  title!: CreateTranslationDto[];

  @TranslationsField({ type: CreateTranslationDto })
  description!: CreateTranslationDto[];
}
