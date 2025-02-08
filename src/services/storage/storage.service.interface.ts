import ITopicItemDao from "./dao/topic-item/topic-item.dao.interface";
import ITopicDao from "./dao/topic/topic.dao.interface";

export default interface IStorage {
  getTopicDao(): ITopicDao;
  getTopicItemDao(): ITopicItemDao;
}
