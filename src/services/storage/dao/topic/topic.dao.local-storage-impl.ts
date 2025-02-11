import {
  Page,
  TopicModel,
  TopicType,
  TopicUpdateArgs,
} from "../../../../types.d";
import IStorage from "../../storage.service.interface";
import ExamItemLocalStorageDao from "../exam-item/exam-item.dao.local-storage-impl";
import QuizItemDaoLocalStorageImpl from "../quiz-item/quiz-item.dao.local-storage-impl";
import ITopicDao from "./topic.dao.interface";

export default class TopicDaoLocalStorageImpl implements ITopicDao {
  private readonly _tableName = "topic_table";

  public constructor(private readonly _storage: IStorage) {}

  private getQuizItemDao(): QuizItemDaoLocalStorageImpl {
    return this._storage.getQuizItemDao() as unknown as QuizItemDaoLocalStorageImpl;
  }

  private getExamItemDao(): ExamItemLocalStorageDao {
    return this._storage.getExamItemDao() as unknown as ExamItemLocalStorageDao;
  }

  private getTableData(): TopicModel[] {
    const strTableData = localStorage.getItem(this._tableName);

    if (strTableData) {
      return JSON.parse(strTableData) as TopicModel[];
    }

    const emptyResult: TopicModel[] = [];
    localStorage.setItem(this._tableName, JSON.stringify(emptyResult));
    return emptyResult;
  }

  private async createNewTopic(
    name: string,
    type: TopicType,
  ): Promise<TopicModel> {
    if (name) {
      const tableData = this.getTableData();
      const newTopic: TopicModel = {
        id: tableData.length === 0 ? 0 : tableData[0].id + 1,
        type,
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

      if (topic.type === TopicType.Quiz) {
        await this.getQuizItemDao().deleteItemsByTopicId(topic.id);
      } else {
        await this.getExamItemDao().deleteItemsByTopicId(topic.id);
      }

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
  ): Promise<Page<TopicModel>> {
    if (page > 0 && maxSize > 0) {
      const result: TopicModel[] = [];
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

  public async getTopic(id: number): Promise<TopicModel> {
    if (id >= 0) {
      const result = this.getTableData().find((topic) => topic.id === id);

      if (result) {
        return result;
      }
    }

    throw new Error("Unexpected arguments");
  }

  public async createNewQuizTopic(name: string): Promise<TopicModel> {
    return await this.createNewTopic(name, TopicType.Quiz);
  }

  public async createNewExamTopic(name: string): Promise<TopicModel> {
    return await this.createNewTopic(name, TopicType.Exam);
  }

  public async updateTopic(
    id: number,
    args: TopicUpdateArgs,
  ): Promise<TopicModel> {
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
