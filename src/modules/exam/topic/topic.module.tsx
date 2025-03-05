import { ReactNode, useCallback, useEffect, useState } from "react";
import { bindOnEndScroll } from "../../../utils/bind.utils";
import {
  useExamTopics,
  useExamTopicsContext,
} from "../../../hooks/exam.module.hooks";
import { ExamModuleContextProvider } from "../../../contexts/exam.module.context";
import EntryModule from "../../entry.module";
import LoaderComponent from "../../../components/loader/loader.component";
import FloatingDialogComponent from "../../../components/floating-dialog/floating-dialog.component";
import ExamComponent from "./exam.component";

interface TopicItemsModuleContextProperties {
  children: ReactNode;
}

function ExamTopicsModuleContext({
  children,
}: Readonly<TopicItemsModuleContextProperties>): ReactNode {
  const [page, setPage] = useState(1);
  const topics = useExamTopics(1);

  useEffect(
    () => bindOnEndScroll(() => setPage((page) => page + 1)),
    [setPage],
  );

  return (
    <EntryModule>
      <ExamModuleContextProvider
        value={{ ...topics, page: { changePage: setPage, value: page } }}
      >
        {children}
      </ExamModuleContextProvider>
    </EntryModule>
  );
}

function TopicsComponents(): ReactNode {
  const {
    isLoaded,
    data: { topics },
  } = useExamTopicsContext();
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
          {topicsModuleLang.buttons.uploadVocabulary}
        </button>
        <div id="topic-list">
          {topics.map((topic) => (
            <ExamComponent key={topic.id} topicData={topic} />
          ))}
        </div>
      </main>
    ) : (
      <CreateTopicDialogComponent />
    );
  }

  return <LoaderComponent />;
}

export default function ExamTopicModule(): ReactNode {
  return (
    <ExamTopicsModuleContext>
      <TopicsComponents />
    </ExamTopicsModuleContext>
  );
}
