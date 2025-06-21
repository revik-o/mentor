import { ReactNode, useMemo } from "react";
import "./answer-button-component.css";

interface IProperties {
  key: string;
  answer: string;
  onClick: () => void;
  state?: boolean;
}

export default function AnswerButtonComponent({
  key,
  answer,
  onClick,
  state,
}: Readonly<IProperties>): ReactNode {
  const answerSignal = useMemo(() => {
    if (state !== undefined) {
      return state ? "answer-button-true" : "answer-button-false";
    }

    return "";
  }, [state]);
  return (
    <button onClick={onClick} className={`answer-button ${answerSignal}`} key={key}>
      {answer}
    </button>
  );
}
