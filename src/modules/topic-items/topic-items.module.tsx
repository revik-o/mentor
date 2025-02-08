import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  useTopicItemModuleContext,
  useTopicItems,
} from "../../hooks/topic-item.module.hooks";
import { bindOnEndScroll } from "../../utils/bind.utils";
import { TopicItemsModuleContextProvider } from "../../contexts/topic-item.module.context";
import { useNavigate } from "react-router";
import EntryModule from "../entry.module";
import LoaderComponent from "../../components/loader/loader.component";
import FloatingDialogComponent from "../../components/floating-dialog/floating-dialog.component";
import CreateTopicItemDialogComponent from "./create-topic-item-dialog.component";
import TopicItemElement from "./topic-item.component";
import links from "../../links.d";
import "./topic-items-module.css";

interface TopicItemsModuleContextProperties {
  children: ReactNode;
}

function TopicItemsModuleContext({
  children,
}: Readonly<TopicItemsModuleContextProperties>): ReactNode {
  const [page, setPage] = useState(1);
  const items = useTopicItems(1);

  useEffect(
    () => bindOnEndScroll(() => setPage((page) => page + 1)),
    [setPage],
  );

  return (
    <EntryModule>
      <TopicItemsModuleContextProvider
        value={{ ...items, page: { changePage: setPage, value: page } }}
      >
        {children}
      </TopicItemsModuleContextProvider>
    </EntryModule>
  );
}

function TopicItemsComponents(): ReactNode {
  const navigate = useNavigate();
  const {
    isLoaded,
    data: { topicId, topicItems },
  } = useTopicItemModuleContext();
  const [showAddNewTopicItemDialog, setShowAddNewTopicItemDialog] =
    useState(false);
  const addNewTopicItemCallback = useCallback(
    () => setShowAddNewTopicItemDialog(true),
    [setShowAddNewTopicItemDialog],
  );
  const startLearnCallback = useCallback(
    () => navigate(`${links.learnTopicComponent}/${topicId}`),
    [navigate, topicId],
  );
  const goBackCallback = useCallback(
    () => navigate(links.topicsComponent),
    [navigate],
  );
  const closeDialogCallback = useCallback(
    () => setShowAddNewTopicItemDialog(false),
    [setShowAddNewTopicItemDialog],
  );

  if (isLoaded) {
    return topicItems.length > 0 ? (
      <main id="topic-item-block">
        <FloatingDialogComponent showDialog={showAddNewTopicItemDialog}>
          <CreateTopicItemDialogComponent onClose={closeDialogCallback} />
        </FloatingDialogComponent>
        <button id="add-new-topic-item" onClick={addNewTopicItemCallback}>
          +
        </button>
        <button id="topic-items-module-go-back" onClick={goBackCallback}>
          &#10092;
        </button>
        {topicItems.length >= 3 && (
          <button id="start-learn-topic-button" onClick={startLearnCallback}>
            !!!TODO!!! Start learn
          </button>
        )}
        <div id="topic-item-list">
          {topicItems.map((topic) => (
            <TopicItemElement key={topic.id} topicItemData={topic} />
          ))}
        </div>
      </main>
    ) : (
      <CreateTopicItemDialogComponent />
    );
  }

  return <LoaderComponent />;
}

export default function TopicItemsModule(): ReactNode {
  return (
    <TopicItemsModuleContext>
      <TopicItemsComponents />
    </TopicItemsModuleContext>
  );
}
