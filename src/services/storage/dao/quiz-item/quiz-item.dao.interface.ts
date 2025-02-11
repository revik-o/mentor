import {
  NewQuizItemArgs,
  Page,
  StorageRequestOptions,
  QuizItemModel,
  QuizItemUpdateArgs,
} from "../../../../types.d";

export default interface IQuizItemDao {
  deleteItem(id: number): Promise<void>;
  countAllItemsByTopicId(topicId: number): Promise<number>;
  getAllItemsByTopicId(
    topicId: number,
    options?: StorageRequestOptions,
  ): Promise<QuizItemModel[]>;
  getItemsByTopicId(
    topicId: number,
    page: number,
    maxSize: number,
  ): Promise<Page<QuizItemModel>>;
  getItemById(id: number): Promise<QuizItemModel>;
  createNewItem(args: NewQuizItemArgs): Promise<QuizItemModel>;
  updateItem(id: number, args: QuizItemUpdateArgs): Promise<QuizItemModel>;
}
