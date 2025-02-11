import IExamItemDao from "./dao/exam-item/exam-item.dao.interface";
import IQuizItemDao from "./dao/quiz-item/quiz-item.dao.interface";
import ITopicDao from "./dao/topic/topic.dao.interface";

export default interface IStorage {
  getTopicDao(): ITopicDao;
  getQuizItemDao(): IQuizItemDao;
  getExamItemDao(): IExamItemDao;
}
