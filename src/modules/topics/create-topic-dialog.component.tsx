import { ChangeEvent, ReactNode, useCallback, useState } from "react";
import { useTopicModuleContext } from "../../hooks/topic.module.hooks";
import languageService from "../../services/language.service";
import { validateInput } from "../../utils/validation.utils";
import "./create-topic-dialog-component.css";

const lang = languageService.dictionary;
const genericLang = lang.title.generic;
const createTopicDialogLang = lang.title.module.topics.crateTopicDialog;

interface Properties {
  onClose?: () => void;
}

export default function CreateTopicDialogComponent({
  onClose,
}: Readonly<Properties>): ReactNode {
  const {
    data: { addNewTopic },
  } = useTopicModuleContext();
  const [newTopicName, setNewTopicName] = useState("");
  const newTopicNameOnChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setNewTopicName(event.target.value),
    [setNewTopicName],
  );
  const onAddNewTopicCallback = useCallback(() => {
    addNewTopic(newTopicName);
    if (onClose) {
      onClose();
    }
  }, [addNewTopic, newTopicName, onClose]);
  const closeDialogCallback = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="create-new-topic">
      <header>
        <h2>{createTopicDialogLang.header}</h2>
      </header>
      <section key="new-topic-info">
        <input
          type="text"
          placeholder={createTopicDialogLang.inputPlaceholder}
          value={newTopicName}
          onChange={newTopicNameOnChangeCallback}
        />
      </section>
      <footer>
        <button
          onClick={onAddNewTopicCallback}
          disabled={!validateInput(newTopicName)}
        >
          {genericLang.ok}
        </button>
        {onClose && (
          <button className="cancel-btn" onClick={closeDialogCallback}>
            {genericLang.cancel}
          </button>
        )}
      </footer>
    </div>
  );
}
