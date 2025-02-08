import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  AsyncData,
  NewTopicItemArgs,
  ReactiveTopicItemData,
  ReactiveTopicItemsChunkData,
  TopicItemModel,
  TopicItemUpdateArgs,
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

function updateTopicItemsSiquence(topicItem: TopicItemModel) {
  return (topicItems: TopicItemModel[]) =>
    topicItems.map((entity) =>
      entity.id === topicItem.id ? { ...topicItem } : entity,
    );
}

function prepareRemoveTopicItemFunction(
  page: number,
  topicItem: TopicItemModel,
  appStorage: IStorage,
  setHasNext: UpdateStateFunc<boolean>,
  setIsLoaded: UpdateStateFunc<boolean>,
  setTopicItems: UpdateStateFunc<TopicItemModel[]>,
) {
  return () => {
    setIsLoaded(false);
    appStorage
      .getTopicItemDao()
      .deleteItem(topicItem.id)
      .then(() =>
        appStorage
          .getTopicItemDao()
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
  topicItem: TopicItemModel,
  appStorage: IStorage,
  setIsLoaded: UpdateStateFunc<boolean>,
  setTopicItems: UpdateStateFunc<TopicItemModel[]>,
) {
  return (args: TopicItemUpdateArgs) => {
    setIsLoaded(false);

    appStorage
      .getTopicItemDao()
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
): AsyncData<ReactiveTopicItemsChunkData> {
  const topicId = useTopicId();
  const appStorage = useApplicationStorage();
  const [hasNext, setHasNext] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cachedTopicItems, setCachedTopicItems] = useState<TopicItemModel[]>(
    [],
  );
  const addNewTopicItem = useCallback(
    (newItem: NewTopicItemArgs) => {
      setIsLoaded(false);

      appStorage
        .getTopicItemDao()
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
  const topicItems: ReactiveTopicItemData[] = useMemo(
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
          }) as ReactiveTopicItemData,
      ),
    [
      appStorage,
      cachedTopicItems,
      setHasNext,
      setIsLoaded,
      setCachedTopicItems,
    ],
  );

  useEffect(() => {
    appStorage.getTopicDao().getTopic(topicId);
    appStorage
      .getTopicItemDao()
      .getItemsByTopicId(topicId, page, MAX_CONTENT_SIZE)
      .then((topicItems) => {
        setHasNext(page < topicItems.totalPages);
        setCachedTopicItems((cachedTopicItems) => [
          ...topicItems.data,
          ...cachedTopicItems,
        ]);
        setIsLoaded(true);
      });
  }, [appStorage, setHasNext, setCachedTopicItems, setIsLoaded]);

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
): ReactiveTopicItemData {
  const topicContext = useTopicItemModuleContext();

  return useMemo(() => {
    const result = topicContext.data.topicItems.find(
      (topic) => topic.id === topicItemId,
    );
    return result ?? UNDEFINED_REACTIVE_TOPIC_ITEM;
  }, [topicContext]);
}
