import { createContext } from "react";
import {
  AsyncData,
  ReactiveTopicsChunkData,
  UpdateStateFunc,
} from "../types.d";
import { UNDEFINED_FUNCTION } from "../constants.d";

export type TopicModuleContextType = {
  page: {
    value: number;
    changePage: UpdateStateFunc<number>;
  };
} & AsyncData<ReactiveTopicsChunkData>;

export const TopicModuleContext = createContext<TopicModuleContextType>({
  isLoaded: false,
  data: { hasNext: false, addNewTopic: UNDEFINED_FUNCTION, topics: [] },
  page: { changePage: UNDEFINED_FUNCTION, value: 1 },
});

export const TopicModuleContextProvider = TopicModuleContext.Provider;
