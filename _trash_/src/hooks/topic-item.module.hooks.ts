import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  AsyncData,
  NewQuizItemArgs,
  ReactiveQuizItemData,
  ReactiveQuizItemsChunkData,
  QuizItemModel,
  QuizItemUpdateArgs,
  UpdateStateFunc,
} from "../types.d";
import { useApplicationStorage } from "./general.hooks";
import { UNDEFINED_REACTIVE_TOPIC_ITEM } from "../constants.d";
import { useTopicId } from "./topic.module.hooks";
import {
  TopicItemModuleContextType,
  TopicItemsModuleContext,
} from "../contexts/topic-item.module.context";
import IStorage from "../services/storage/storage.service.interface";

const MAX_CONTENT_SIZE = 30;

function updateTopicItemsSiquence(topicItem: QuizItemModel) {
  return (topicItems: QuizItemModel[]) =>
    topicItems.map((entity) =>
      entity.id === topicItem.id ? { ...topicItem } : entity,
    );
}

function prepareRemoveTopicItemFunction(
  page: number,
  topicItem: QuizItemModel,
  appStorage: IStorage,
  setHasNext: UpdateStateFunc<boolean>,
  setIsLoaded: UpdateStateFunc<boolean>,
  setTopicItems: UpdateStateFunc<QuizItemModel[]>,
) {
  return () => {
    setIsLoaded(false);
    appStorage
      .getQuizItemDao()
      .deleteItem(topicItem.id)
      .then(() =>
        appStorage
          .getQuizItemDao()
          .getItemsByTopicId(topicItem.topicId, 1, MAX_CONTENT_SIZE * page)
          .then(({ data, totalPages }) => {
            setTopicItems(data);
            setHasNext(page < totalPages);
            setIsLoaded(true);
          }),
      );
  };
}

function prepareUpdateTopicFunction(
  topicItem: QuizItemModel,
  appStorage: IStorage,
  setIsLoaded: UpdateStateFunc<boolean>,
  setTopicItems: UpdateStateFunc<QuizItemModel[]>,
) {
  return (args: QuizItemUpdateArgs) => {
    setIsLoaded(false);

    appStorage
      .getQuizItemDao()
      .updateItem(topicItem.id, args)
      .then((topicItem) => {
        setTopicItems(updateTopicItemsSiquence(topicItem));
        setIsLoaded(true);
      });
  };
}

export function useTopicItemModuleContext(): TopicItemModuleContextType {
  return useContext(TopicItemsModuleContext);
}

export function useTopicItems(
  page: number,
): AsyncData<ReactiveQuizItemsChunkData> {
  const topicId = useTopicId();
  const appStorage = useApplicationStorage();
  const [hasNext, setHasNext] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cachedTopicItems, setCachedTopicItems] = useState<QuizItemModel[]>([]);
  const addNewTopicItem = useCallback(
    (newItem: NewQuizItemArgs) => {
      setIsLoaded(false);

      appStorage
        .getQuizItemDao()
        .createNewItem(newItem)
        .then((topicItem) => {
          setCachedTopicItems((cachedTopicItems) => [
            topicItem,
            ...cachedTopicItems,
          ]);
          setIsLoaded(true);
        });
    },
    [setIsLoaded, appStorage, setCachedTopicItems],
  );
  const topicItems: ReactiveQuizItemData[] = useMemo(
    () =>
      cachedTopicItems.map(
        (topicItem) =>
          ({
            ...topicItem,
            removeItem: prepareRemoveTopicItemFunction(
              page,
              topicItem,
              appStorage,
              setHasNext,
              setIsLoaded,
              setCachedTopicItems,
            ),
            updateItem: prepareUpdateTopicFunction(
              topicItem,
              appStorage,
              setIsLoaded,
              setCachedTopicItems,
            ),
          }) as ReactiveQuizItemData,
      ),
    [
      page,
      appStorage,
      cachedTopicItems,
      setHasNext,
      setIsLoaded,
      setCachedTopicItems,
    ],
  );

  useEffect(() => {
    appStorage.getQuizTopicDao().getTopic(topicId);
    appStorage
      .getQuizItemDao()
      .getItemsByTopicId(topicId, page, MAX_CONTENT_SIZE)
      .then((topicItems) => {
        setHasNext(page < topicItems.totalPages);
        setCachedTopicItems((cachedTopicItems) => [
          ...topicItems.data,
          ...cachedTopicItems,
        ]);
        setIsLoaded(true);
      });
  }, [page, topicId, appStorage, setHasNext, setCachedTopicItems, setIsLoaded]);

  return {
    isLoaded,
    data: {
      topicId,
      hasNext,
      topicItems,
      addNewTopicItem,
    },
  };
}

export function useTopicItemFromModuleContext(
  topicItemId: number,
): ReactiveQuizItemData {
  const topicContext = useTopicItemModuleContext();

  return useMemo(() => {
    const result = topicContext.data.topicItems.find(
      (topic) => topic.id === topicItemId,
    );
    return result ?? UNDEFINED_REACTIVE_TOPIC_ITEM;
  }, [topicItemId, topicContext]);
}
