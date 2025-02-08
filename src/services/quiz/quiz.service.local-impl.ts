import {
  AnswerResult,
  LearnStatus,
  QuestionData,
  TopicItemModel,
} from "../../types.d";
import {
  randomizeArray,
  randomPositiveNumber,
} from "../../utils/generic.utils";
import { IQuizService } from "./quiz.service.interface";
import IStorage from "../storage/storage.service.interface";

export default class QuizLocalService implements IQuizService {
  private _cachedQuestion: QuestionData[] = [];
  private _currentQuestion: QuestionData = {
    answers: [],
    itemId: -1,
    learnData: "",
    learnStatus: LearnStatus.UnTouched,
  };

  public constructor(
    private readonly _topicId: number,
    private readonly _appStorage: IStorage,
  ) { }

  private createAnswers(
    currentItem: TopicItemModel,
    itemsPtr: TopicItemModel[],
  ): string[] {
    if (
      !LearnStatus.statusIncreased(
        LearnStatus.InProgress,
        currentItem.learnStatus,
      )
    ) {
      let generateAttempts = 3;
      const result: string[] = [currentItem.meaningData];

      while (result.length < 5 && generateAttempts > 0) {
        const index = randomPositiveNumber(itemsPtr.length - 1);
        const candidate = itemsPtr[index];

        if (!result.includes(candidate.meaningData)) {
          result.push(candidate.meaningData);
        } else {
          generateAttempts--;
        }
      }

      return randomizeArray(result);
    }

    return [];
  }

  private buildQuestion(
    item: TopicItemModel,
    itemsPtr: TopicItemModel[],
  ): QuestionData {
    return {
      answers: this.createAnswers(item, itemsPtr),
      itemId: item.id,
      learnData: item.learnData,
      learnStatus: item.learnStatus,
    };
  }

  public async checkAnswer(result: string): Promise<AnswerResult> {
    if (this._currentQuestion.itemId >= 0) {
      const currentItem = await this._appStorage
        .getTopicItemDao()
        .getItemById(this._currentQuestion.itemId);
      const isCorrect = currentItem.meaningData.toLowerCase() === result.trim().toLowerCase();

      if (isCorrect) {
        this._appStorage.getTopicItemDao().updateItem(currentItem.id, {
          learnStatus: LearnStatus.nextStatus(currentItem.learnStatus),
        });
      }

      return {
        isCorrect,
        correctAnswer: currentItem.meaningData,
      };
    }

    throw new Error("Unexpected arguments");
  }

  public async nextQuestion(): Promise<QuestionData> {
    if (this._cachedQuestion.length) {
      this._currentQuestion = this._cachedQuestion.pop()!;
      return this._currentQuestion;
    }

    const items = await this._appStorage
      .getTopicItemDao()
      .getAllItemsByTopicId(this._topicId, { sortBy: "learnStatus" });
    const itemsQueue = [...items].splice(0, 5).filter((item) => item !== undefined);

    if (itemsQueue.length) {
      this._cachedQuestion = itemsQueue.map((item) =>
        this.buildQuestion(item, items),
      );
      this._currentQuestion = this._cachedQuestion.pop()!;
      return this._currentQuestion;
    }

    throw new Error("Unexpected arguments");
  }
}
