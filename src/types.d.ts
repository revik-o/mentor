export enum LearnStatus {
  Learned = 3,
  Memorized = 2,
  InProgress = 1,
  UnTouched = 0,
}

export namespace LearnStatus {
  export function statusIncreased(
    oldStatus: LearnStatus,
    newStatus: LearnStatus,
  ): boolean {
    switch (oldStatus) {
      case LearnStatus.Learned:
        return false;
      case LearnStatus.Memorized:
        return oldStatus !== newStatus && newStatus === LearnStatus.Learned;
      case LearnStatus.InProgress:
        return (
          oldStatus !== newStatus &&
          (newStatus === LearnStatus.Learned ||
            newStatus === LearnStatus.Memorized)
        );
      default:
        return oldStatus !== newStatus;
    }
  }

  export function compare(
    status1: LearnStatus,
    status2: LearnStatus,
  ): 1 | 0 | 1 {
    return statusIncreased(status1, status2) ? 1 : status1 === status2 ? 0 : -1;
  }

  export function nextStatus(status: LearnStatus): LearnStatus {
    switch (status) {
      case LearnStatus.UnTouched:
        return LearnStatus.InProgress;
      case LearnStatus.InProgress:
        return LearnStatus.Memorized;
      default:
        return LearnStatus.Learned;
    }
  }
}

export type vocabulary = any;

export type NavigatorCallback = (endpoint: string) => void;

export type SinglePageApplicationContextType = {
  navigator: NavigatorCallback | undefined;
  topicId: number;
};

export type TopicModel = {
  id: number;
  name: string;
};

export type TopicItemModel = {
  id: number;
  topicId: number;
  learnData: string;
  meaningData: string;
  learnStatus: LearnStatus;
};

export type TopicUpdateArgs = {
  name?: string;
};

export type NewTopicItemArgs = {
  topicId: number;
  learnData: string;
  meaningData: string;
};

export type TopicItemUpdateArgs = {
  topicId?: number;
  learnData?: string;
  meaningData?: string;
  learnStatus?: LearnStatus;
};

export type UseState<T> = {
  value: T;
  updateState: (newValue: T) => void;
};

export type AsyncData<T> = {
  isLoaded: boolean;
  data: T;
};

export type Page<T> = {
  data: T[];
  page: number;
  totalPages: number;
};

export type ReactiveTopicData = {
  removeTopic: () => void;
  updateTopic: (args: TopicUpdateArgs) => void;
} & TopicModel;

export type AsyncTopicElementData = {
  progressInPercentage: AsyncData<number>;
} & ReactiveTopicData;

export type ReactiveTopicsChunkData = {
  hasNext: boolean;
  topics: ReactiveTopicData[];
  addNewTopic: (topicName: string) => void;
};

export type ReactiveTopicItemData = {
  removeItem: () => void;
  updateItem: (args: TopicUpdateArgs) => void;
} & TopicItemModel;

export type ReactiveTopicItemsChunkData = {
  topicId: number;
  hasNext: boolean;
  topicItems: ReactiveTopicItemData[];
  addNewTopicItem: (args: NewTopicItemArgs) => void;
};

export type UpdateStateFunc<T> = (newState: T | ((entity: T) => T)) => void;

export type AnswerResult = {
  isCorrect: boolean;
  correctAnswer: string;
};

export type ReactiveAnswerButton = {
  name: string;
  isTrue?: boolean;
  callback: () => void;
};

export type QuestionData = {
  itemId: number;
  learnData: string;
  learnStatus: LearnStatus;
  answers: string[];
};

export type ReactiveQuestionData = {
  checkQuestionCallback: (answer: string) => Promise<AnswerResult>;
  nextQuestionCallback: () => void;
} & QuestionData;

export type StorageRequestOptions = {
  sortBy?: string;
};
