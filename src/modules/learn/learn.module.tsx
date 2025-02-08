import { ReactNode, useCallback } from "react";
import {
  useLearnModuleContext,
  useQuizData,
} from "../../hooks/learn.module.hooks";
import { LearnModuleContextProvider } from "../../contexts/learn.module.context";
import { useTopicId } from "../../hooks/topic.module.hooks";
import { useNavigate } from "react-router";
import { LearnStatus } from "../../types.d";
import EntryModule from "../entry.module";
import LoaderComponent from "../../components/loader/loader.component";
import LearnComponentAnswersStage from "./stage/answer.stage.component";
import LearnComponentInputStage from "./stage/input-stage.component";
import "./learn-module.css";

import links from "../../links.d";
function LearnComponent(): ReactNode {
  const topicId = useTopicId();
  const navigate = useNavigate();
  const {
    isLoaded,
    data: { learnData, learnStatus },
  } = useLearnModuleContext();
  const goBack = useCallback(
    () => navigate(`${links.topicItemsComponent}/${topicId}`),
    [navigate, topicId],
  );

  return isLoaded ? (
    <>
      <header>
        <button onClick={goBack} id="learn-module-go-back">
          &#10092;
        </button>
      </header>
      <main id="learn-module-main-block">
        <div id="learn-item-block">
          <span>{learnData}</span>
        </div>
        {!LearnStatus.statusIncreased(LearnStatus.Memorized, learnStatus) && (
          <LearnComponentAnswersStage />
        )}
        {LearnStatus.statusIncreased(LearnStatus.Memorized, learnStatus) && (
          <LearnComponentInputStage />
        )}
      </main>
    </>
  ) : (
    <LoaderComponent />
  );
}

export default function LearnModule(): ReactNode {
  const value = useQuizData();

  return (
    <EntryModule>
      <LearnModuleContextProvider value={value}>
        <LearnComponent />
      </LearnModuleContextProvider>
    </EntryModule>
  );
}
