import { createContext } from "react";
import { AsyncData, LearnStatus, ReactiveQuestionData } from "../types.d";
import { UNDEFINED_FUNCTION } from "../constants.d";

export const LearnModuleContext = createContext<
  AsyncData<ReactiveQuestionData>
>({
  isLoaded: false,
  data: {
    answers: [],
    checkQuestionCallback: UNDEFINED_FUNCTION,
    itemId: -1,
    learnData: "",
    learnStatus: LearnStatus.UnTouched,
  },
});

export const LearnModuleContextProvider = LearnModuleContext.Provider;
