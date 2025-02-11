import { AnswerResult, QuestionData } from "../../types.d";

export interface IExamService {
  // TODO
  checkAnswer(result: string): Promise<AnswerResult>;
  nextQuestion(): Promise<QuestionData>;
}
