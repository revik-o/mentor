import {
  ExamItemModel,
  ExamItemUpdateArgs,
  NewExamItemArgs,
  Page,
  StorageRequestOptions,
} from "../../../../../types.d";

export default interface IExamItemDao {
  deleteItem(id: number): Promise<void>;
  countAllItemsByTopicId(topicId: number): Promise<number>;
  getAllItemsByTopicId(
    topicId: number,
    options?: StorageRequestOptions,
  ): Promise<ExamItemModel[]>;
  getItemsByTopicId(
    topicId: number,
    page: number,
    maxSize: number,
  ): Promise<Page<ExamItemModel>>;
  getItemById(id: number): Promise<ExamItemModel>;
  createNewItem(args: NewExamItemArgs): Promise<ExamItemModel>;
  updateItem(id: number, args: ExamItemUpdateArgs): Promise<ExamItemModel>;
}
