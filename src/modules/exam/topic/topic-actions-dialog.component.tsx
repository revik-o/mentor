import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from "react";
import { useTopicFromModuleContext } from "../../../hooks/topic.module.hooks";
import languageService from "../../../services/language.service";
import ConfirmationComponent from "../../../components/confirmation/confirmation.component";
import "./topic-actions-dialog-component.css";

const lang = languageService.dictionary;
const genericLang = lang.title.generic;
const topicActionsDialogLang = lang.title.module.topics.actions;

enum DialogActivity {
  TopicActionsDialog,
  DeleteTopicConfirmationDialog,
  UpdateTopicNameDialog,
}

interface MainProperties {
  topicId: number;
  onClose?: () => void;
}

interface ActionDialogProperties {
  topicId: number;
  onClose?: () => void;
  returnToActivity: (activity: DialogActivity) => void;
}

function UpdateTopicNameDialog({
  topicId,
  returnToActivity,
  onClose,
}: Readonly<ActionDialogProperties>): ReactNode {
  const { updateTopic, name } = useTopicFromModuleContext(topicId);
  const [newName, setNewName] = useState(name);
  const onCancel = useCallback(
    () => returnToActivity(DialogActivity.TopicActionsDialog),
    [returnToActivity],
  );
  const onUpdate = useCallback(() => {
    updateTopic({ name: newName });
    if (onClose) {
      onClose();
    } else {
      onCancel();
    }
  }, [onClose, onCancel, newName, updateTopic]);
  const onInputUpdate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setNewName(event.target.value),
    [setNewName],
  );
  return (
    <div>
      <header>
        <h2>{topicActionsDialogLang.update.header}</h2>
      </header>
      <section>
        <input value={newName} onChange={onInputUpdate} />
      </section>
      <footer>
        <button onClick={onUpdate}>
          {topicActionsDialogLang.update.button}
        </button>
        <button onClick={onCancel}>{genericLang.cancel}</button>
      </footer>
    </div>
  );
}

function DeleteTopicConfirmationDialog({
  topicId,
  returnToActivity,
  onClose,
}: Readonly<ActionDialogProperties>): ReactNode {
  const { removeTopic } = useTopicFromModuleContext(topicId);
  const onYes = useCallback(() => {
    removeTopic();

    if (onClose) {
      onClose();
    }
  }, [removeTopic, onClose]);
  const onNo = useCallback(
    () => returnToActivity(DialogActivity.TopicActionsDialog),
    [returnToActivity],
  );

  return <ConfirmationComponent onNo={onNo} onYes={onYes} />;
}

function TopicActionsMenu({
  onClose,
  returnToActivity,
}: Readonly<ActionDialogProperties>): ReactNode {
  const closeDialogCallback = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);
  const onClickUpdate = useCallback(
    () => returnToActivity(DialogActivity.UpdateTopicNameDialog),
    [returnToActivity],
  );
  const onClickDelete = useCallback(
    () => returnToActivity(DialogActivity.DeleteTopicConfirmationDialog),
    [returnToActivity],
  );
  const onClickExportData = useCallback(() => {
    /// TODO
  }, []);

  return (
    <div className="topic-actions">
      <header>
        <h2>{topicActionsDialogLang.main.header}</h2>
      </header>
      <footer>
        <button onClick={onClickUpdate}>
          {topicActionsDialogLang.main.buttons.update}
        </button>
        <br />
        <button onClick={onClickDelete}>
          {topicActionsDialogLang.main.buttons.delete}
        </button>
        <br />
        <button onClick={onClickExportData}>
          {topicActionsDialogLang.main.buttons.exportData}
        </button>
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

export default function ExamTopicActionsDialogComponents(
  properties: Readonly<MainProperties>,
): ReactNode {
  const [dialogActivity, setDialogActivity] = useState(
    DialogActivity.TopicActionsDialog,
  );
  const activityProperties = useMemo(
    () => ({ returnToActivity: setDialogActivity, ...properties }),
    [setDialogActivity, properties],
  );

  switch (dialogActivity) {
    case DialogActivity.UpdateTopicNameDialog:
      return <UpdateTopicNameDialog {...activityProperties} />;
    case DialogActivity.DeleteTopicConfirmationDialog:
      return <DeleteTopicConfirmationDialog {...activityProperties} />;
    default:
      return <TopicActionsMenu {...activityProperties} />;
  }
}
