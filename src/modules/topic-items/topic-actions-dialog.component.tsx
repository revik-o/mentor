import { ReactNode, useCallback, useMemo, useState } from "react";
import { useTopicItemFromModuleContext } from "../../hooks/topic-item.module.hooks";
import ConfirmationComponent from "../../components/confirmation/confirmation.component";
import languageService from "../../services/language.service";

const lang = languageService.dictionary;
const genericLang = lang.title.generic;

enum DialogActivity {
  TopicItemActionsDialog,
  DeleteTopicItemConfirmationDialog,
}

interface Properties {
  topicItemId: number;
  onClose?: () => void;
}

interface ActionDialogProperties {
  topicItemId: number;
  onClose?: () => void;
  returnToActivity: (activity: DialogActivity) => void;
}

function DeleteTopicItemConfirmationDialog({
  topicItemId,
  returnToActivity,
  onClose,
}: Readonly<ActionDialogProperties>): ReactNode {
  const { removeItem } = useTopicItemFromModuleContext(topicItemId);
  const onYes = useCallback(() => {
    removeItem();

    if (onClose) {
      onClose();
    }
  }, [removeItem, onClose]);
  const onNo = useCallback(
    () => returnToActivity(DialogActivity.TopicItemActionsDialog),
    [returnToActivity],
  );

  return <ConfirmationComponent onNo={onNo} onYes={onYes} />;
}

function TopicItemActionsMenu({
  onClose,
  returnToActivity,
}: Readonly<ActionDialogProperties>): ReactNode {
  const closeDialogCallback = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);
  const onClickDelete = useCallback(
    () => returnToActivity(DialogActivity.DeleteTopicItemConfirmationDialog),
    [returnToActivity],
  );

  return (
    <div className="topic-item-actions">
      <header>
        <h2>!!!TODO!!! Topic item actions title</h2>
      </header>
      <footer>
        <button onClick={onClickDelete}>!!!TODO!!! Delete topic</button>
        <br />
        {onClose && (
          <button className="cancel-btn" onClick={closeDialogCallback}>
            {genericLang.cancel}
          </button>
        )}
      </footer>
    </div>
  );
}

export default function TopicItemActionsDialogComponents(
  properties: Readonly<Properties>,
): ReactNode {
  const [dialogActivity, setDialogActivity] = useState(
    DialogActivity.TopicItemActionsDialog,
  );
  const activityProperties = useMemo(
    () => ({ returnToActivity: setDialogActivity, ...properties }),
    [setDialogActivity, properties],
  );

  switch (dialogActivity) {
    case DialogActivity.DeleteTopicItemConfirmationDialog:
      return <DeleteTopicItemConfirmationDialog {...activityProperties} />;
    default:
      return <TopicItemActionsMenu {...activityProperties} />;
  }
}
