import { Page, TopicModel, TopicUpdateArgs } from "../../../../types.d";

export default interface ITopicDao {
  deleteTopic(id: number): Promise<void>;
  getTopics(page: number, maxSize: number): Promise<Page<TopicModel>>;
  getTopic(id: number): Promise<TopicModel>;
  createNewQuizTopic(name: string): Promise<TopicModel>;
  createNewExamTopic(name: string): Promise<TopicModel>;
  updateTopic(id: number, args: TopicUpdateArgs): Promise<TopicModel>;
}
