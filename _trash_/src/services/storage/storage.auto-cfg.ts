import IExamItemDao from "./dao/exam/exam-item/exam-item.dao.interface";
import ExamItemLocalStorageDao from "./dao/exam/exam-item/exam-item.dao.local-storage-impl";
import IQuizItemDao from "./dao/quiz/item/quiz-item.dao.interface";
import QuizItemDaoLocalStorageImpl from "./dao/quiz/item/quiz-item.dao.local-storage-impl";
import IQuizTopicDao from "./dao/quiz/topic/topic.dao.interface";
import QuizTopicDaoLocalStorageImpl from "./dao/quiz/topic/topic.dao.local-storage-impl";
import IStorage from "./storage.service.interface";

class LocalStorageConfig implements IStorage {
  private readonly _quizTopicDao = new QuizTopicDaoLocalStorageImpl(this);
  private readonly _quizItemDao = new QuizItemDaoLocalStorageImpl();
  private readonly _examItemDao = new ExamItemLocalStorageDao();

  public getQuizTopicDao(): IQuizTopicDao {
    return this._quizTopicDao;
  }

  public getQuizItemDao(): IQuizItemDao {
    return this._quizItemDao;
  }

  public getExamItemDao(): IExamItemDao {
    return this._examItemDao;
  }
}

export default function autoConfigApplicationStorage(): IStorage {
  return new LocalStorageConfig();
}
