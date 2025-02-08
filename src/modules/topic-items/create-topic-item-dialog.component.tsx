import { ChangeEvent, ReactNode, useCallback, useState } from "react";
import { useTopicItemModuleContext } from "../../hooks/topic-item.module.hooks";
import languageService from "../../services/language.service";
import { validateInput } from "../../utils/validation.utils";

const lang = languageService.dictionary;
const genericLang = lang.title.generic;

interface Properties {
  onClose?: () => void;
}

export default function CreateTopicItemDialogComponent({
  onClose,
}: Readonly<Properties>): ReactNode {
  const {
    data: { topicId, addNewTopicItem },
  } = useTopicItemModuleContext();
  const [newTopicItemLearn, setNewTopicItemLearn] = useState("");
  const [newTopicItemMeaning, setNewTopicItemMeaning] = useState("");
  const newTopicItemLearnOnChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setNewTopicItemLearn(event.target.value),
    [setNewTopicItemLearn],
  );
  const newTopicItemMeaningOnChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setNewTopicItemMeaning(event.target.value),
    [setNewTopicItemMeaning],
  );
  const onAddNewTopicCallback = useCallback(() => {
    addNewTopicItem({
      learnData: newTopicItemLearn.trim(),
      meaningData: newTopicItemMeaning.trim(),
      topicId,
    });
    if (onClose) {
      onClose();
    }
  }, [
    topicId,
    addNewTopicItem,
    newTopicItemLearn,
    newTopicItemMeaning,
    onClose,
  ]);
  const closeDialogCallback = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="create-new-topic-item">
      <header>
        <h2>!!!TODO!!! New Topic Item</h2>
      </header>
      <section key="new-topic-item-info">
        <input
          type="text"
          placeholder={"!!!TODO!!! What you want learn"}
          value={newTopicItemLearn}
          onChange={newTopicItemLearnOnChangeCallback}
        />
        <input
          type="text"
          placeholder={"!!!TODO!!! Meaning for learn section"}
          value={newTopicItemMeaning}
          onChange={newTopicItemMeaningOnChangeCallback}
        />
      </section>
      <footer>
        <button
          onClick={onAddNewTopicCallback}
          disabled={
            !validateInput(newTopicItemLearn) ||
            !validateInput(newTopicItemMeaning)
          }
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
