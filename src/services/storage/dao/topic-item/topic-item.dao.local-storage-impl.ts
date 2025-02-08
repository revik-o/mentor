import {
  LearnStatus,
  NewTopicItemArgs,
  Page,
  StorageRequestOptions,
  TopicItemModel,
  TopicItemUpdateArgs,
} from "../../../../types.d";
import ITopicItemDao from "./topic-item.dao.interface";

export default class TopicItemDaoLocalStorageImpl implements ITopicItemDao {
  private readonly _tableName = "topic_item_table";

  private getTableData(): TopicItemModel[] {
    const strTableData = localStorage.getItem(this._tableName);

    if (strTableData) {
      return JSON.parse(strTableData) as TopicItemModel[];
    }

    const emptyResult: TopicItemModel[] = [];
    localStorage.setItem(this._tableName, JSON.stringify(emptyResult));
    return emptyResult;
  }

  private updateItemFields(
    itemPtr: TopicItemModel,
    argsPtr: TopicItemUpdateArgs,
  ) {
    if (argsPtr.learnData) {
      itemPtr.learnData = argsPtr.learnData;
    }
    if (argsPtr.meaningData) {
      itemPtr.meaningData = argsPtr.meaningData;
    }
    if (argsPtr.learnStatus) {
      itemPtr.learnStatus = argsPtr.learnStatus;
    }
    if (argsPtr.topicId) {
      itemPtr.topicId = argsPtr.topicId;
    }
  }

  public async deleteItem(id: number): Promise<void> {
    if (id >= 0) {
      const tableData = this.getTableData();
      localStorage.setItem(
        this._tableName,
        JSON.stringify(tableData.filter((item) => item.id != id)),
      );
      return;
    }

    throw new Error("Index is out of bounds");
  }

  public async countAllItemsByTopicId(topicId: number): Promise<number> {
    return (await this.getAllItemsByTopicId(topicId)).length;
  }

  public async getAllItemsByTopicId(
    topicId: number,
    options?: StorageRequestOptions,
  ): Promise<TopicItemModel[]> {
    if (topicId >= 0) {
      let result = this.getTableData().filter((item) => item.topicId === topicId);

      if (options?.sortBy) {
        if (options?.sortBy === "learnStatus") {
          result = result.sort((item1, item2) =>
            LearnStatus.compare(item1.learnStatus, item2.learnStatus),
          );
        } else if (options.sortBy === "id") {
          result = result.sort((item1, item2) => item1.id - item2.id);
        }
      }

      return result;
    }

    throw new Error("Unexpected arguments");
  }

  public async getItemsByTopicId(
    topicId: number,
    page: number,
    maxSize: number,
  ): Promise<Page<TopicItemModel>> {
    if (page > 0 && maxSize > 0) {
      const result: TopicItemModel[] = [];
      const validPageValue = page - 1;
      const availableLastIndex = maxSize * validPageValue + maxSize;
      const tableData = (await this.getAllItemsByTopicId(topicId));

      for (
        let index = maxSize * validPageValue;
        index < tableData.length && index < availableLastIndex;
        index++
      ) {
        result.push(tableData[index]);
      }

      return {
        page,
        totalPages: Math.ceil(tableData.length / maxSize),
        data: result,
      };
    }

    throw new Error("Unexpected arguments");
  }

  public async getItemById(id: number): Promise<TopicItemModel> {
    if (id >= 0) {
      const tableData = this.getTableData();
      const result = tableData.find((item) => item.id === id);

      if (result) {
        return result;
      }

      throw new Error("Element does not exist");
    }

    throw new Error("Unexpected arguments");
  }

  public async createNewItem(args: NewTopicItemArgs): Promise<TopicItemModel> {
    const topicId = args.topicId;
    const learnData = args.learnData;
    const meaningData = args.meaningData;
    const tableData = this.getTableData();
    const newItem: TopicItemModel = {
      id: tableData.length === 0 ? 0 : tableData[0].id + 1,
      topicId,
      learnData,
      meaningData,
      learnStatus: LearnStatus.UnTouched,
    };
    localStorage.setItem(
      this._tableName,
      JSON.stringify([newItem, ...tableData]),
    );

    return newItem;
  }

  public async updateItem(
    id: number,
    args: TopicItemUpdateArgs,
  ): Promise<TopicItemModel> {
    const tableData = this.getTableData();

    if (id >= 0) {
      for (const element of tableData) {
        const item = element;

        if (item.id === id) {
          this.updateItemFields(item, args);
          localStorage.setItem(this._tableName, JSON.stringify([...tableData]));

          return item;
        }
      }

      throw new Error("Element does not exist");
    }

    throw new Error("Unexpected arguments");
  }
}
