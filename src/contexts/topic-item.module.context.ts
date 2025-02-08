import { createContext } from "react";
import {
  AsyncData,
  ReactiveTopicItemsChunkData,
  UpdateStateFunc,
} from "../types";
import { UNDEFINED_FUNCTION } from "../constants.d";

export type TopicItemModuleContextType = {
  page: {
    value: number;
    changePage: UpdateStateFunc<number>;
  };
} & AsyncData<ReactiveTopicItemsChunkData>;

export const TopicItemsModuleContext =
  createContext<TopicItemModuleContextType>({
    isLoaded: false,
    data: {
      hasNext: false,
      addNewTopicItem: UNDEFINED_FUNCTION,
      topicItems: [],
      topicId: -1,
    },
    page: { changePage: UNDEFINED_FUNCTION, value: 1 },
  });

export const TopicItemsModuleContextProvider = TopicItemsModuleContext.Provider;
