import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionEntity } from '../question.entity';

export class GetQuestionQuery implements ICommand {
  constructor(public readonly userId: Uuid) {}
}

@QueryHandler(GetQuestionQuery)
export class GetQuestionHandler implements IQueryHandler<GetQuestionQuery> {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
  ) {}

  async execute(query: GetQuestionQuery) {
    return this.questionRepository.findBy({
      userId: query.userId as never,
    });
  }
}
