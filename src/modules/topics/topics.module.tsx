import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  useTopicModuleContext,
  useTopics,
} from "../../hooks/topic.module.hooks";
import { TopicModuleContextProvider } from "../../contexts/topic.module.context";
import { bindOnEndScroll } from "../../utils/bind.utils";
import FloatingDialogComponent from "../../components/floating-dialog/floating-dialog.component";
import CreateTopicDialogComponent from "./create-topic-dialog.component";
import LoaderComponent from "../../components/loader/loader.component";
import TopicElement from "./topic.component";
import EntryModule from "../entry.module";
import "./topics-module.css";

interface TopicPageContextProperties {
  children: ReactNode;
}

function TopicModuleContext({
  children,
}: Readonly<TopicPageContextProperties>): ReactNode {
  const [page, setPage] = useState(1);
  const asyncTopicsData = useTopics(page);

  useEffect(
    () => bindOnEndScroll(() => setPage((page) => page + 1)),
    [setPage],
  );

  return (
    <EntryModule>
      <TopicModuleContextProvider
        value={{
          ...asyncTopicsData,
          page: { changePage: setPage, value: page },
        }}
      >
        {children}
      </TopicModuleContextProvider>
    </EntryModule>
  );
}

function TopicsComponents(): ReactNode {
  const {
    isLoaded,
    data: { topics },
  } = useTopicModuleContext();
  const [showAddNewTopicDialog, setShowAddNewTopicDialog] = useState(false);
  const addNewTopicCallback = useCallback(
    () => setShowAddNewTopicDialog(true),
    [setShowAddNewTopicDialog],
  );
  const uploadVocabularyCallback = useCallback(() => {
    // TODO
  }, []);
  const closeDialogCallback = useCallback(
    () => setShowAddNewTopicDialog(false),
    [setShowAddNewTopicDialog],
  );

  if (isLoaded) {
    return topics.length > 0 ? (
      <main id="topics-block">
        <FloatingDialogComponent showDialog={showAddNewTopicDialog}>
          <CreateTopicDialogComponent onClose={closeDialogCallback} />
        </FloatingDialogComponent>
        <button id="add-new-topics" onClick={addNewTopicCallback}>
          +
        </button>
        <button
          id="topics-module-upload-vocabulary"
          onClick={uploadVocabularyCallback}
        >
          !!!TODO!!! Upload Vocabulary
        </button>
        <div id="topic-list">
          {topics.map((topic) => (
            <TopicElement key={topic.id} topicData={topic} />
          ))}
        </div>
      </main>
    ) : (
      <CreateTopicDialogComponent />
    );
  }

  return <LoaderComponent />;
}

export default function TopicsModule(): ReactNode {
  return (
    <TopicModuleContext>
      <TopicsComponents />
    </TopicModuleContext>
  );
}
