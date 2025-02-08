import ITopicItemDao from "./dao/topic-item/topic-item.dao.interface";
import TopicItemDaoLocalStorageImpl from "./dao/topic-item/topic-item.dao.local-storage-impl";
import ITopicDao from "./dao/topic/topic.dao.interface";
import TopicDaoLocalStorageImpl from "./dao/topic/topic.dao.local-storage-impl";
import IStorage from "./storage.service.interface";

class LocalStorageConfig implements IStorage {
  private readonly _topicDao = new TopicDaoLocalStorageImpl();
  private readonly _topicItemDao = new TopicItemDaoLocalStorageImpl();

  public getTopicDao(): ITopicDao {
    return this._topicDao;
  }

  public getTopicItemDao(): ITopicItemDao {
    return this._topicItemDao;
  }
}

export default function autoConfigApplicationStorage(): IStorage {
  return new LocalStorageConfig();
}
