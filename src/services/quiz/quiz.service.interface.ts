import { AnswerResult, QuestionData } from "../../types.d";

export interface IQuizService {
  checkAnswer(result: string): Promise<AnswerResult>;
  nextQuestion(): Promise<QuestionData>;
}
