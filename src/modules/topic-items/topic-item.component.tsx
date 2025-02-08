import { ReactNode, useCallback, useState } from "react";
import { ReactiveTopicItemData } from "../../types";
import FloatingDialogComponent from "../../components/floating-dialog/floating-dialog.component";
import TopicItemActionsDialogComponents from "./topic-actions-dialog.component";

interface Properties {
  topicItemData: ReactiveTopicItemData;
}

export default function TopicItemElement({
  topicItemData: { learnData, meaningData, id },
}: Readonly<Properties>): ReactNode {
  const [showTopicItemActionsDialog, setShowTopicItemActionsDialog] =
    useState(false);
  const closeDialogCallback = useCallback(
    () => setShowTopicItemActionsDialog(false),
    [setShowTopicItemActionsDialog],
  );
  const onMouseUpCallback = useCallback(
    () => setShowTopicItemActionsDialog(true),
    [setShowTopicItemActionsDialog],
  );

  return (
    <>
      <button className="topic-item-block" onMouseUp={onMouseUpCallback}>
        <div className="topic-item-title">{learnData}</div>
        <div className="topic-item-meaning">{meaningData}</div>
      </button>
      <FloatingDialogComponent showDialog={showTopicItemActionsDialog}>
        <TopicItemActionsDialogComponents
          onClose={closeDialogCallback}
          topicItemId={id}
        />
      </FloatingDialogComponent>
    </>
  );
}
