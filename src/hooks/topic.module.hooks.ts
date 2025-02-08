import {
  AsyncData,
  AsyncTopicElementData,
  LearnStatus,
  ReactiveTopicData,
  ReactiveTopicsChunkData,
  TopicModel,
  TopicUpdateArgs,
  UpdateStateFunc,
} from "../types.d";
import {
  TopicModuleContext,
  TopicModuleContextType,
} from "../contexts/topic.module.context";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useApplicationStorage } from "./general.hooks";
import { UNDEFINED_REACTIVE_TOPIC } from "../constants.d";
import { useParams } from "react-router";
import IStorage from "../services/storage/storage.service.interface";

const MAX_CONTENT_SIZE = 25;

function updateTopicsSiquence(topic: TopicModel) {
  return (topics: TopicModel[]) =>
    topics.map((entity) => (entity.id === topic.id ? { ...topic } : entity));
}

function prepareRemoveTopicFunction(
  page: number,
  topic: TopicModel,
  appStorage: IStorage,
  setHasNext: UpdateStateFunc<boolean>,
  setIsLoaded: UpdateStateFunc<boolean>,
  setTopics: UpdateStateFunc<TopicModel[]>,
) {
  return () => {
    setIsLoaded(false);
    appStorage
      .getTopicDao()
      .deleteTopic(topic.id)
      .then(() =>
        appStorage
          .getTopicDao()
          .getTopics(1, MAX_CONTENT_SIZE * page)
          .then((topics) => {
            setTopics(topics.data);
            setHasNext(page < topics.totalPages);
            setIsLoaded(true);
          }),
      );
  };
}

function prepareUpdateTopicFunction(
  topic: TopicModel,
  appStorage: IStorage,
  setIsLoaded: UpdateStateFunc<boolean>,
  setTopics: UpdateStateFunc<TopicModel[]>,
) {
  return (args: TopicUpdateArgs) => {
    setIsLoaded(false);
    appStorage
      .getTopicDao()
      .updateTopic(topic.id, args)
      .then((topic) => {
        setTopics(updateTopicsSiquence(topic));
        setIsLoaded(true);
      });
  };
}

/**
 * Topic Hooks Starts from here
 */
export function useTopicId(): number {
  const { id: topicId } = useParams();

  return useMemo(() => {
    if (topicId) {
      return parseInt(topicId);
    }

    return -1;
  }, [topicId]);
}

export function useTopicModuleContext(): TopicModuleContextType {
  return useContext(TopicModuleContext);
}

export function useTopics(page: number): AsyncData<ReactiveTopicsChunkData> {
  const appStorage = useApplicationStorage();
  const [hasNext, setHasNext] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cachedTopics, setCachedTopics] = useState<TopicModel[]>([]);
  const addNewTopic = useCallback(
    (topicName: string) => {
      setIsLoaded(false);

      appStorage
        .getTopicDao()
        .createNewTopic(topicName.trim())
        .then((topic) => {
          setCachedTopics((cachedTopics) => [topic, ...cachedTopics]);
          setIsLoaded(true);
        });
    },
    [setIsLoaded, appStorage, setCachedTopics],
  );
  const topics: ReactiveTopicData[] = useMemo(
    () =>
      cachedTopics.map((topic) => ({
        ...topic,
        removeTopic: prepareRemoveTopicFunction(
          page,
          topic,
          appStorage,
          setHasNext,
          setIsLoaded,
          setCachedTopics,
        ),
        updateTopic: prepareUpdateTopicFunction(
          topic,
          appStorage,
          setIsLoaded,
          setCachedTopics,
        ),
      })),
    [page, appStorage, cachedTopics, setHasNext, setIsLoaded, setCachedTopics],
  );

  useEffect(() => {
    appStorage
      .getTopicDao()
      .getTopics(page, MAX_CONTENT_SIZE)
      .then((topics) => {
        setHasNext(page < topics.totalPages);
        setCachedTopics((cachedTopics) => [...topics.data, ...cachedTopics]);
        setIsLoaded(true);
      });
  }, [page, appStorage, setHasNext, setCachedTopics, setIsLoaded]);

  return {
    isLoaded,
    data: { hasNext, topics, addNewTopic },
  };
}

export function useTopicFullInfo(
  topic: ReactiveTopicData,
): AsyncTopicElementData {
  const appStorage = useApplicationStorage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [percentage, setPercentage] = useState(-1);

  useEffect(() => {
    appStorage
      .getTopicItemDao()
      .getAllItemsByTopicId(topic.id)
      .then((items) => {
        if (items.length > 0) {
          const learnedItems = items.filter(
            (item) => item.learnStatus === LearnStatus.Learned,
          ).length;
          setPercentage(Math.ceil((learnedItems / items.length) * 100));
        } else {
          setPercentage(0);
        }

        setIsLoaded(true);
      });
  }, [topic, appStorage, setIsLoaded, setPercentage]);

  return {
    ...topic,
    progressInPercentage: {
      isLoaded,
      data: percentage,
    },
  };
}

export function useTopicFromModuleContext(topicId: number): ReactiveTopicData {
  const topicContext = useTopicModuleContext();
  return useMemo(() => {
    const result = topicContext.data.topics.find(
      (topic) => topic.id === topicId,
    );
    return result ?? UNDEFINED_REACTIVE_TOPIC;
  }, [topicId, topicContext]);
}
