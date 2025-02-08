import {
  NewTopicItemArgs,
  Page,
  StorageRequestOptions,
  TopicItemModel,
  TopicItemUpdateArgs,
} from "../../../../types.d";

export default interface ITopicItemDao {
  deleteItem(id: number): Promise<void>;
  countAllItemsByTopicId(topicId: number): Promise<number>;
  getAllItemsByTopicId(
    topicId: number,
    options?: StorageRequestOptions,
  ): Promise<TopicItemModel[]>;
  getItemsByTopicId(
    topicId: number,
    page: number,
    maxSize: number,
  ): Promise<Page<TopicItemModel>>;
  getItemById(id: number): Promise<TopicItemModel>;
  createNewItem(args: NewTopicItemArgs): Promise<TopicItemModel>;
  updateItem(id: number, args: TopicItemUpdateArgs): Promise<TopicItemModel>;
}
