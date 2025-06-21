import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useApplicationStorage } from "./general.hooks";
import {
  AsyncData,
  ExamModel,
  ReactiveExamData,
  ReactiveExamsChunkData,
} from "../types.d";
import {
  ExamModuleContext,
  ExamModuleContextType,
} from "../contexts/exam.module.context";

const MAX_CONTENT_SIZE = 25;

export function useExamTopicsContext(): ExamModuleContextType {
  return useContext(ExamModuleContext);
}

export function useExamTopics(page: number): AsyncData<ReactiveExamsChunkData> {
  const appStorage = useApplicationStorage();
  const [hasNext, setHasNext] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cachedExams, setCachedExams] = useState<ExamModel[]>([]);
  const addNewTopic = useCallback(
    (topicName: string) => {
      setIsLoaded(false);

      appStorage
        .getQuizTopicDao()
        .createNewQuizTopic(topicName.trim())
        .then((topic) => {
          setCachedExams((cachedTopics) => [topic, ...cachedTopics]);
          setIsLoaded(true);
        });
    },
    [appStorage],
  );
  const topics: ReactiveExamData[] = useMemo(() => {
    const result = cachedExams.map(
      (topic) =>
        ({
          ...topic,
          removeExam: () => {},
          updateExam: () => {},
        }) as ReactiveExamData,
    );
    setIsLoaded(true);
    return result;
  }, [cachedExams]);

  useEffect(() => {
    appStorage
      .getExamTopicDao()
      .getTopics(page, MAX_CONTENT_SIZE)
      .then((topics) => {
        setHasNext(page < topics.totalPages);
        setCachedExams(topics.data);
      });
  }, [appStorage, page]);

  return {
    isLoaded,
    data: {
      addNewTopic,
      hasNext,
      topics,
    },
  };
}
