import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiAcceptedResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';

import type { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service';
import { UserEntity } from '../user/user.entity';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { QuestionDto } from './dtos/question.dto';
import { QuestionPageOptionsDto } from './dtos/question-page-options.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { QuestionService } from './question.service';

@Controller('questions')
@ApiTags('questions')
export class QuestionController {
    constructor(private questionService: QuestionService) { }

    @Post()
    @Auth([RoleType.ADMIN])
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ type: QuestionDto })
    async createQuestion(
        @Body() createQuestionDto: CreateQuestionDto,
        @AuthUser() user: UserEntity,
    ) {
        const questionEntity = await this.questionService.createQuestion(
            user.id,
            createQuestionDto,
        );

        return questionEntity.toDto();
    }

    @Get()
    @Auth([])
    @UseLanguageInterceptor()
    @ApiPageResponse({ type: QuestionDto })
    async getQuestions(
        @Query() questionsPageOptionsDto: QuestionPageOptionsDto,
    ): Promise<PageDto<QuestionDto>> {
        return this.questionService.getAllQuestion(questionsPageOptionsDto);
    }

    @Get(':id')
    @Auth([])
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: QuestionDto })
    async getSingleQuestion(@UUIDParam('id') id: Uuid): Promise<QuestionDto> {
        const entity = await this.questionService.getSingleQuestion(id);

        return entity.toDto();
    }

    @Put(':id')
    @Auth([RoleType.ADMIN])

    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse()
    updateQuestion(
        @UUIDParam('id') id: Uuid,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ): Promise<void> {
        return this.questionService.updateQuestion(id, updateQuestionDto);
    }

    @Delete(':id')
    @Auth([RoleType.ADMIN])
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse()
    async deleteQuestion(@UUIDParam('id') id: Uuid): Promise<void> {
        await this.questionService.deleteQuestion(id);
    }
}
