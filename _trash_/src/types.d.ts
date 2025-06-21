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
    return newStatus > oldStatus;
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

  export function previousStatus(status: LearnStatus): LearnStatus {
    switch (status) {
      case LearnStatus.Learned:
        return LearnStatus.Memorized;
      case LearnStatus.Memorized:
        return LearnStatus.InProgress;
      default:
        return status;
    }
  }
}

export type vocabulary = any;

export type NavigatorCallback = (endpoint: string) => void;

export type SinglePageApplicationContextType = {
  navigator: NavigatorCallback | undefined;
  topicId: number;
};

export type QuizModel = {
  id: number;
  name: string;
};

export type ExamModel = {
  id: number;
  name: string;
};

export type QuizItemModel = {
  id: number;
  topicId: number;
  learnData: string;
  meaningData: string;
  learnStatus: LearnStatus;
};

export type ExamItemModel = {
  id: number;
  topicId: number;
  question: string;
  answers: string[];
  learnStatus: LearnStatus;
};

export type QuizTopicUpdateArgs = {
  name?: string;
};

export type ExamTopicUpdateArgs = {
  name?: string;
};

export type NewQuizItemArgs = {
  topicId: number;
  learnData: string;
  meaningData: string;
};

export type NewExamItemArgs = {
  topicId: number;
  question: string;
  answers: string[];
};

export type QuizItemUpdateArgs = {
  topicId?: number;
  learnData?: string;
  meaningData?: string;
  learnStatus?: LearnStatus;
};

export type ExamItemUpdateArgs = {
  topicId?: number;
  question?: string;
  answers: string[];
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
  updateTopic: (args: QuizTopicUpdateArgs) => void;
} & QuizModel;

export type ReactiveExamData = {
  removeExam: () => void;
  updateExam: (args: ExamItemUpdateArgs) => void;
} & ExamModel;

export type AsyncTopicElementData = {
  progressInPercentage: AsyncData<number>;
} & ReactiveTopicData;

export type ReactiveTopicsChunkData = {
  hasNext: boolean;
  topics: ReactiveTopicData[];
  addNewTopic: (topicName: string) => void;
};

export type ReactiveQuizItemData = {
  removeItem: () => void;
  updateItem: (args: QuizTopicUpdateArgs) => void;
} & QuizItemModel;

export type ReactiveQuizItemsChunkData = {
  topicId: number;
  hasNext: boolean;
  topicItems: ReactiveQuizItemData[];
  addNewTopicItem: (args: NewQuizItemArgs) => void;
};

export type ReactiveExamsChunkData = {
  hasNext: boolean;
  topics: ReactiveExamData[];
  addNewTopic: (topicName: string) => void;
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
