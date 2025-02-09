import { ChangeEvent, ReactNode, useCallback, useState } from "react";
import { useLearnModuleContext } from "../../../hooks/learn.module.hooks";
import languageService from "../../../services/language.service";

const lang = languageService.dictionary;
const genericLang = lang.title.generic;
const inputStageLang = lang.title.module.learn.stage.input;

export default function LearnComponentInputStage(): ReactNode {
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | undefined>();
  const {
    data: { checkQuestionCallback, nextQuestionCallback },
  } = useLearnModuleContext();
  const checkAnswer = useCallback(() => {
    if (inputValue) {
      checkQuestionCallback(inputValue).then((result) => {
        setIsCorrectAnswer(result.isCorrect);
        setCorrectAnswer(result.correctAnswer);
      });
    }
  }, [inputValue, checkQuestionCallback]);
  const nextQuestion = useCallback(() => {
    nextQuestionCallback();
    setCorrectAnswer("");
    setInputValue("");
    setIsCorrectAnswer(undefined);
  }, [nextQuestionCallback]);
  const inputOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value),
    [],
  );

  return (
    <div id="answers-block">
      <span>
        {isCorrectAnswer !== undefined ? (
          <>
            {isCorrectAnswer ? "✔" : "X"} {correctAnswer}
            <br />
          </>
        ) : (
          <></>
        )}
      </span>
      <input
        placeholder={inputStageLang.inputPlaceholder}
        value={inputValue}
        onChange={inputOnChange}
      />
      <br />
      <button
        onClick={isCorrectAnswer !== undefined ? nextQuestion : checkAnswer}
        disabled={inputValue === ""}
      >
        {isCorrectAnswer !== undefined ? genericLang.next : genericLang.check}
      </button>
    </div>
  );
}
