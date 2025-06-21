import { createContext } from "react";
import { UNDEFINED_FUNCTION } from "../constants.d";
import { AsyncData, ReactiveExamsChunkData, UpdateStateFunc } from "../types.d";

export type ExamModuleContextType = {
  page: {
    value: number;
    changePage: UpdateStateFunc<number>;
  };
} & AsyncData<ReactiveExamsChunkData>;

export const ExamModuleContext = createContext<ExamModuleContextType>({
  isLoaded: false,
  data: { hasNext: false, addNewTopic: UNDEFINED_FUNCTION, topics: [] },
  page: { changePage: UNDEFINED_FUNCTION, value: 1 },
});

export const ExamModuleContextProvider = ExamModuleContext.Provider;
