import { IQuizService } from "./quiz.service.interface";
import IStorage from "../storage/storage.service.interface";
import QuizLocalService from "./quiz.service.local-impl";

export default function autoConfigQuizService(
  topicId: number,
  appStorage: IStorage,
): IQuizService {
  return new QuizLocalService(topicId, appStorage);
}
