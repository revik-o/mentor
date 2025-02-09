import { ReactNode, useCallback, useState } from "react";
import { ReactiveTopicData } from "../../types.d";
import { useTopicFullInfo } from "../../hooks/topic.module.hooks";
import { useApplicationNavigator } from "../../hooks/general.hooks";
import { isNotLongClick, onLongClick } from "../../utils/behavior.utils";
import TopicActionsDialogComponents from "./topic-actions-dialog.component";
import FloatingDialogComponent from "../../components/floating-dialog/floating-dialog.component";
import links from "../../links.d";
import "./topic-component.css";

interface Properties {
  topicData: ReactiveTopicData;
}

let mouseButtonClicked = Date.now();

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
    mouseButtonClicked = Date.now();
    onLongClick(mouseButtonClicked, () => setShowTopicActionsDialog(true));
  }, [setShowTopicActionsDialog]);
  const onMouseUpCallback = useCallback(() => {
    if (isNotLongClick(mouseButtonClicked)) {
      navigate(`${links.topicItemsComponent}/${topicData.id}`);
    }
  }, [navigate, topicData]);

  const {
    id,
    name,
    progressInPercentage: { isLoaded, data: percentage },
  } = useTopicFullInfo(topicData);

  return (
    <>
      <button
        className="topic-block"
        onMouseDown={onMouseDownCallback}
        onMouseUp={onMouseUpCallback}
      >
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
      <FloatingDialogComponent showDialog={showTopicActionsDialog}>
        <TopicActionsDialogComponents
          onClose={closeDialogCallback}
          topicId={id}
        />
      </FloatingDialogComponent>
    </>
  );
}
