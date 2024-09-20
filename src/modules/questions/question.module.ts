import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateQuestionHandler } from './commands/create-question.command';
import { QuestionController } from './question.controller';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';
import { QuestionTranslationEntity } from './question-translation.entity';
import { GetQuestionHandler } from './queries/get-question.query';

const handlers = [CreateQuestionHandler, GetQuestionHandler];

@Module({
    imports: [TypeOrmModule.forFeature([QuestionEntity, QuestionTranslationEntity])],
    providers: [QuestionService, ...handlers],
    controllers: [QuestionController],
})
export class QuestionModule { }
