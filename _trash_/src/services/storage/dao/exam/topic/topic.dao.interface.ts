import { ExamModel, ExamTopicUpdateArgs, Page } from "../../../../../types";

export default interface IExamTopicDao {
  deleteTopic(id: number): Promise<void>;
  getTopics(page: number, maxSize: number): Promise<Page<ExamModel>>;
  getTopic(id: number): Promise<ExamModel>;
  createNewExamTopic(name: string): Promise<ExamModel>;
  updateTopic(id: number, args: ExamTopicUpdateArgs): Promise<ExamModel>;
}
