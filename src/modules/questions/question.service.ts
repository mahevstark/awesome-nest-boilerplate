import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { CreateQuestionCommand } from './commands/create-question.command';
import { CreateQuestionDto } from './dtos/create-question.dto';
import type { QuestionDto } from './dtos/question.dto';
import type { QuestionPageOptionsDto } from './dtos/question-page-options.dto';
import type { UpdateQuestionDto } from './dtos/update-question.dto';
import { QuestionNotFoundException } from './exceptions/question-not-found.exception';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    private commandBus: CommandBus,
  ) {}

  @Transactional()
  createQuestion(userId: Uuid, createQuestionDto: CreateQuestionDto): Promise<QuestionEntity> {
    return this.commandBus.execute<CreateQuestionCommand, QuestionEntity>(
      new CreateQuestionCommand(userId, createQuestionDto),
    );
  }

  async getAllQuestion(
    questionPageOptionsDto: QuestionPageOptionsDto,
  ): Promise<PageDto<QuestionDto>> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.translations', 'questionTranslation');
    const [items, pageMetaDto] =
      await queryBuilder.paginate(questionPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSingleQuestion(id: Uuid): Promise<QuestionEntity> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .where('question.id = :id', { id });

    const questionEntity = await queryBuilder.getOne();

    if (!questionEntity) {
      throw new QuestionNotFoundException();
    }

    return questionEntity;
  }

  async updateQuestion(id: Uuid, updateQuestionDto: UpdateQuestionDto): Promise<void> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .where('question.id = :id', { id });

    const questionEntity = await queryBuilder.getOne();

    if (!questionEntity) {
      throw new QuestionNotFoundException();
    }

    this.questionRepository.merge(questionEntity, updateQuestionDto);

    await this.questionRepository.save(updateQuestionDto);
  }

  async deleteQuestion(id: Uuid): Promise<void> {
    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .where('question.id = :id', { id });

    const questionEntity = await queryBuilder.getOne();

    if (!questionEntity) {
      throw new QuestionNotFoundException();
    }

    await this.questionRepository.remove(questionEntity);
  }
}
