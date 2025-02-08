import { useCallback, useEffect, useState } from "react";
import { useLearnModuleContext } from "../../../hooks/learn.module.hooks";
import { ReactiveAnswerButton } from "../../../types.d";
import AnswerButtonComponent from "../answer-button.component";

function updateAnswerState(
  arrayPtr: ReactiveAnswerButton[],
  buttonTitle: string,
  isTrue?: boolean,
) {
  const answerSequense = arrayPtr;

  for (const buttonData of answerSequense) {
    if (buttonData.name === buttonTitle) {
      buttonData.isTrue = isTrue;
      break;
    }
  }

  return answerSequense;
}

export default function LearnComponentAnswersStage() {
  const {
    data: { answers, checkQuestionCallback, nextQuestionCallback },
  } = useLearnModuleContext();
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | undefined>();
  const [reactiveAnswers, setReactiveAnswers] = useState<
    ReactiveAnswerButton[]
  >([]);
  const [showNextButton, setShowNextButton] = useState(false);
  const nextQuestionButtonCallback = useCallback(() => {
    setIsCorrectAnswer(undefined);
    setShowNextButton(false);
    nextQuestionCallback();
  }, [nextQuestionCallback, setShowNextButton]);

  useEffect(() => {
    function answerBatton(answer: string) {
      checkQuestionCallback(answer).then((result) => {
        setIsCorrectAnswer(result.isCorrect);
        setShowNextButton(true);
        setReactiveAnswers((reactiveAnswers) => {
          let updatedButtonsState = updateAnswerState(
            [...reactiveAnswers],
            result.correctAnswer,
            true,
          );

          if (!result.isCorrect) {
            updatedButtonsState = updateAnswerState(
              updatedButtonsState,
              answer,
              false,
            );
          }

          return updatedButtonsState;
        });
      });
    }

    setReactiveAnswers(
      answers.map(
        (answer) =>
          ({
            name: answer,
            callback: () => answerBatton(answer),
          }) as ReactiveAnswerButton,
      ),
    );
  }, [answers, setIsCorrectAnswer, setShowNextButton, setReactiveAnswers]);

  return answers.length > 1 ? (
    <>
      <div id="answer-result-block">
        {isCorrectAnswer !== undefined ? (
          <>{isCorrectAnswer ? "✔" : "x"}</>
        ) : (
          <></>
        )}
      </div>
      <div id="answers-block">
        {reactiveAnswers.map(({ name, callback, isTrue }) => (
          <>
            <AnswerButtonComponent
              key={name}
              answer={name}
              onClick={callback}
              state={isTrue}
            />
            <br />
          </>
        ))}
        {showNextButton && (
          <button onClick={nextQuestionButtonCallback}>!!!TODO!!! Next</button>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
