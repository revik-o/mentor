import { ReactNode, useCallback, useState } from "react";
import { ReactiveTopicData } from "../../types.d";
import { useTopicFullInfo } from "../../hooks/topic.module.hooks";
import { useApplicationNavigator } from "../../hooks/general.hooks";
import TopicActionsDialogComponents from "./topic-actions-dialog.component";
import FloatingDialogComponent from "../../components/floating-dialog/floating-dialog.component";
import links from "../../links.d";
import "./topic-component.css";

interface Properties {
  topicData: ReactiveTopicData;
}

export default function TopicElement({
  topicData,
}: Readonly<Properties>): ReactNode {
  const navigate = useApplicationNavigator();
  const [showTopicActionsDialog, setShowTopicActionsDialog] = useState(false);
  const closeDialogCallback = useCallback(
    () => setShowTopicActionsDialog(false),
    [setShowTopicActionsDialog],
  );
  const onMouseDownCallback = useCallback(() => {
    setShowTopicActionsDialog(true);
  }, [setShowTopicActionsDialog]);
  const onMouseUpCallback = useCallback(() => {
    if (!showTopicActionsDialog) {
      navigate(`${links.topicItemsComponent}/${topicData.id}`);
    }
  }, [showTopicActionsDialog, navigate, topicData]);

  const {
    id,
    name,
    progressInPercentage: { isLoaded, data: percentage },
  } = useTopicFullInfo(topicData);

  return (
    <>
      <div className="topic-block">
        <button onMouseUp={onMouseUpCallback}>
          <div className="topic-title">{name}</div>
          {isLoaded ? (
            <div className="topic-data">
              <progress max="100" value={percentage}>
                {percentage}%
              </progress>
              <span>{percentage}%</span>
            </div>
          ) : (
            <></>
          )}
        </button>
        <div className="topic-block-options" onClick={onMouseDownCallback}>
          &#8942;
        </div>
      </div>
      <FloatingDialogComponent showDialog={showTopicActionsDialog}>
        <TopicActionsDialogComponents
          onClose={closeDialogCallback}
          topicId={id}
        />
      </FloatingDialogComponent>
    </>
  );
}
