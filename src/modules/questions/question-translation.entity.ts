import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractTranslationEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { QuestionTranslationDto } from './dtos/question-translation.dto'
import { QuestionEntity } from './question.entity';

@Entity({ name: 'question_translations' })
@UseDto(QuestionTranslationDto)
export class QuestionTranslationEntity extends AbstractTranslationEntity<QuestionTranslationDto> {
    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({ type: 'uuid' })
    questionId!: Uuid;

    @ManyToOne(() => QuestionEntity, (questionEntity) => questionEntity.translations, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'question_id' })
    question?: QuestionEntity;
}
