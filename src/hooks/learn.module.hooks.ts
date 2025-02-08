import {
  AnswerResult,
  AsyncData,
  QuestionData,
  ReactiveQuestionData,
  UpdateStateFunc,
} from "../types.d";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTopicId } from "./topic.module.hooks";
import { useApplicationStorage } from "./general.hooks";
import { LearnModuleContext } from "../contexts/learn.module.context";
import { UNDEFINED_QUESTION } from "../constants.d";
import { IQuizService } from "../services/quiz/quiz.service.interface";
import IStorage from "../services/storage/storage.service.interface";
import autoConfigQuizService from "../services/quiz/quiz.auto-cfg";

function generateQuestion(
  quizService: IQuizService,
  setIsLoaded: UpdateStateFunc<boolean>,
  setCurrentQuestion: UpdateStateFunc<QuestionData>,
) {
  quizService.nextQuestion().then((question) => {
    setIsLoaded(true);
    setCurrentQuestion(question);
  });
}

export function useLearnModuleContext(): AsyncData<ReactiveQuestionData> {
  return useContext(LearnModuleContext);
}

export function useQuizService(
  topicId: number,
  appStorage: IStorage,
): IQuizService {
  return useMemo(
    () => autoConfigQuizService(topicId, appStorage),
    [topicId, appStorage],
  );
}

export function useQuizData(): AsyncData<ReactiveQuestionData> {
  const topicId = useTopicId();
  const appStorage = useApplicationStorage();
  const quizService = useQuizService(topicId, appStorage);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionData>(UNDEFINED_QUESTION);
  const checkQuestionCallback = useCallback(
    async(
      answer: string
    ) => {
      setIsLoaded(false);
      setIsLoaded(true);
      return (await quizService.checkAnswer(answer));
    },
    [quizService, setIsLoaded, setCurrentQuestion],
  );
  const nextQuestionCallback = useCallback(
    () => {
      setIsLoaded(false);
      generateQuestion(quizService, setIsLoaded, setCurrentQuestion);
    },
    [setIsLoaded, setCurrentQuestion, quizService],
  );

  useEffect(
    () => generateQuestion(quizService, setIsLoaded, setCurrentQuestion),
    [quizService, setIsLoaded, setCurrentQuestion],
  );

  return { isLoaded, data: { ...currentQuestion, checkQuestionCallback, nextQuestionCallback } };
}
