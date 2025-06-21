import {
  Page,
  QuizModel,
  QuizTopicUpdateArgs,
} from "../../../../../types.d";
import IStorage from "../../../storage.service.interface";
import QuizItemDaoLocalStorageImpl from "../item/quiz-item.dao.local-storage-impl";
import IQuizTopicDao from "./topic.dao.interface";

export default class QuizTopicDaoLocalStorageImpl implements IQuizTopicDao {
  private readonly _tableName = "quiz_topic_table";

  public constructor(private readonly _storage: IStorage) {}

  private getQuizItemDao(): QuizItemDaoLocalStorageImpl {
    return this._storage.getQuizItemDao() as unknown as QuizItemDaoLocalStorageImpl;
  }

  private getTableData(): QuizModel[] {
    const strTableData = localStorage.getItem(this._tableName);

    if (strTableData) {
      return JSON.parse(strTableData) as QuizModel[];
    }

    const emptyResult: QuizModel[] = [];
    localStorage.setItem(this._tableName, JSON.stringify(emptyResult));
    return emptyResult;
  }

  private async createNewTopic(
    name: string,
  ): Promise<QuizModel> {
    if (name) {
      const tableData = this.getTableData();
      const newTopic: QuizModel = {
        id: tableData.length === 0 ? 0 : tableData[0].id + 1,
        name,
      };
      localStorage.setItem(
        this._tableName,
        JSON.stringify([newTopic, ...tableData]),
      );

      return newTopic;
    }

    throw new Error("Unexpected arguments");
  }

  public async deleteTopic(id: number): Promise<void> {
    const tableData = this.getTableData();

    if (id >= 0) {
      const topic = await this.getTopic(id);
      await this.getQuizItemDao().deleteItemsByTopicId(topic.id);
      localStorage.setItem(
        this._tableName,
        JSON.stringify(
          tableData.filter((topicElement) => topicElement.id != topic.id),
        ),
      );
    } else {
      throw new Error("Index is out of bounds");
    }
  }

  public async getTopics(
    page: number,
    maxSize: number,
  ): Promise<Page<QuizModel>> {
    if (page > 0 && maxSize > 0) {
      const result: QuizModel[] = [];
      const validPageValue = page - 1;
      const availableLastIndex = maxSize * validPageValue + maxSize;
      const tableData = this.getTableData();

      for (
        let index = maxSize * validPageValue;
        index < tableData.length && index < availableLastIndex;
        index++
      ) {
        result.push(tableData[index]);
      }

      return {
        page,
        data: result,
        totalPages: Math.ceil(tableData.length / maxSize),
      };
    }

    throw new Error("Unexpected arguments");
  }

  public async getTopic(id: number): Promise<QuizModel> {
    if (id >= 0) {
      const result = this.getTableData().find((topic) => topic.id === id);

      if (result) {
        return result;
      }
    }

    throw new Error("Unexpected arguments");
  }

  public async createNewQuizTopic(name: string): Promise<QuizModel> {
    return await this.createNewTopic(name);
  }

  public async updateTopic(
    id: number,
    args: QuizTopicUpdateArgs,
  ): Promise<QuizModel> {
    const tableData = this.getTableData();

    if (id >= 0) {
      for (const element of tableData) {
        const topic = element;

        if (topic.id === id) {
          if (args.name) {
            topic.name = args.name;
          }

          localStorage.setItem(this._tableName, JSON.stringify([...tableData]));
          return topic;
        }
      }

      throw new Error("Element does not exist");
    }

    throw new Error("Unexpected arguments");
  }
}
