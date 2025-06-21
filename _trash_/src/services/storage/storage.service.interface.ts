import IExamItemDao from "./dao/exam/item/exam-item.dao.interface";
import IExamTopicDao from "./dao/exam/topic/topic.dao.interface";
import IQuizItemDao from "./dao/quiz/item/quiz-item.dao.interface";
import IQuizTopicDao from "./dao/quiz/topic/topic.dao.interface";

export default interface IStorage {
  getQuizTopicDao(): IQuizTopicDao;
  getQuizItemDao(): IQuizItemDao;
  getExamTopicDao(): IExamTopicDao;
  getExamItemDao(): IExamItemDao;
}
