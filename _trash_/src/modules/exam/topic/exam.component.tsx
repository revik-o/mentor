import { ReactNode, useState } from "react";
import { ReactiveExamData } from "../../../types";
import ExamTopicActionsDialogComponents from "./topic-actions-dialog.component";
import FloatingDialogComponent from "../../../components/floating-dialog/floating-dialog.component";

interface Properties {
  topicData: ReactiveExamData;
}

export default function ExamComponent({
  topicData: { id, name },
}: Readonly<Properties>): ReactNode {
  const [showTopicActionsDialog, setShowTopicActionsDialog] = useState(false);

  return (
    <>
      <div className="topic-block">
        <button onMouseUp={onMouseUpCallback}>
          <div className="topic-title">{name}</div>
        </button>
        <div className="topic-block-options" onClick={onMouseDownCallback}>
          &#8942;
        </div>
      </div>
      <FloatingDialogComponent showDialog={showTopicActionsDialog}>
        <ExamTopicActionsDialogComponents
          onClose={closeDialogCallback}
          topicId={id}
        />
      </FloatingDialogComponent>
    </>
  );
}
