import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'lodash';
import { Repository } from 'typeorm';

import type { CreateQuestionDto } from '../dtos/create-question.dto';
import { QuestionEntity } from '../question.entity';
import { QuestionTranslationEntity } from '../question-translation.entity';

export class CreateQuestionCommand implements ICommand {
    constructor(
        public readonly userId: Uuid,
        public readonly createQuestionDto: CreateQuestionDto,
    ) { }
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler
    implements ICommandHandler<CreateQuestionCommand, QuestionEntity> {
    constructor(
        @InjectRepository(QuestionEntity)
        private questionRepository: Repository<QuestionEntity>,
        @InjectRepository(QuestionTranslationEntity)
        private questionTranslationRepository: Repository<QuestionTranslationEntity>,
    ) { }

    async execute(command: CreateQuestionCommand) {
        const { userId, createQuestionDto } = command;
        const questionEntity = this.questionRepository.create({ userId });
        const translations: QuestionTranslationEntity[] = [];

        await this.questionRepository.save(questionEntity);

        // FIXME: Create generic function for translation creation
        for (const createTranslationDto of createQuestionDto.title) {
            const languageCode = createTranslationDto.languageCode;
            const translationEntity = this.questionTranslationRepository.create({
                questionId: questionEntity.id,
                languageCode,
                title: createTranslationDto.text,
                description: find(createQuestionDto.description, {
                    languageCode,
                })!.text,
            });

            translations.push(translationEntity);
        }

        await this.questionTranslationRepository.save(translations);

        questionEntity.translations = translations;

        return questionEntity;
    }
}
