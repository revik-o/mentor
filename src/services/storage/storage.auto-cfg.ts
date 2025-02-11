import IExamItemDao from "./dao/exam-item/exam-item.dao.interface";
import ExamItemLocalStorageDao from "./dao/exam-item/exam-item.dao.local-storage-impl";
import IQuizItemDao from "./dao/quiz-item/quiz-item.dao.interface";
import QuizItemDaoLocalStorageImpl from "./dao/quiz-item/quiz-item.dao.local-storage-impl";
import ITopicDao from "./dao/topic/topic.dao.interface";
import TopicDaoLocalStorageImpl from "./dao/topic/topic.dao.local-storage-impl";
import IStorage from "./storage.service.interface";

class LocalStorageConfig implements IStorage {
  private readonly _topicDao = new TopicDaoLocalStorageImpl(this);
  private readonly _quizItemDao = new QuizItemDaoLocalStorageImpl();
  private readonly _examItemDao = new ExamItemLocalStorageDao();

  public getTopicDao(): ITopicDao {
    return this._topicDao;
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
