import { ChangeEvent, ReactNode, useCallback, useState } from "react";
import { useLearnModuleContext } from "../../../hooks/learn.module.hooks";

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
            {isCorrectAnswer ? "✔" : "x"} {correctAnswer}
            <br />
          </>
        ) : (
          <></>
        )}
      </span>
      <input
        placeholder={"!!!TODO!!! Answer..."}
        value={inputValue}
        onChange={inputOnChange}
      />
      <br />
      <button
        onClick={isCorrectAnswer !== undefined ? nextQuestion : checkAnswer}
        disabled={inputValue === ""}
      >
        !!!TODO!!! {isCorrectAnswer !== undefined ? "Next" : "Check"}
      </button>
    </div>
  );
}
