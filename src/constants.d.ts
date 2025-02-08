import {
  LearnStatus,
  QuestionData,
  ReactiveTopicData,
  ReactiveTopicItemData,
} from "./types.d";

export const DEFAULT_ANSWER_DELEY = 3000;

export const DEFAULT_LONG_CLICK_MS = 500;

export const UNDEFINED_FUNCTION = () => undefined;

export const UNDEFINED_REACTIVE_TOPIC: ReactiveTopicData = {
  id: -1,
  name: "",
  removeTopic: UNDEFINED_FUNCTION,
  updateTopic: UNDEFINED_FUNCTION,
};

export const UNDEFINED_REACTIVE_TOPIC_ITEM: ReactiveTopicItemData = {
  id: -1,
  topicId: -1,
  learnData: "",
  meaningData: "",
  learnStatus: LearnStatus.UnTouched,
  removeTopic: UNDEFINED_FUNCTION,
  updateTopic: UNDEFINED_FUNCTION,
};

export const UNDEFINED_QUESTION: QuestionData = {
  answers: [],
  itemId: -1,
  learnData: "",
  learnStatus: LearnStatus.UnTouched,
};
