import { Column, Entity,  OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { QuestionDto } from './dtos/question.dto';
import { QuestionTranslationEntity } from './question-translation.entity';

@Entity({ name: 'questions' })
@UseDto(QuestionDto)
export class QuestionEntity extends AbstractEntity<QuestionDto> {
    @Column({ type: 'uuid' })
    userId!: Uuid;

    

    @OneToMany(
        () => QuestionTranslationEntity,
        (questionTranslationEntity) => questionTranslationEntity.question,
    )
    declare translations?: QuestionTranslationEntity[];
}
