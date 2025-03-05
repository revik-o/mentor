import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import IndexModule from "./modules/welcome/welcome.module";
import TopicsModule from "./modules/topics/topics.module";
import SinglePageApp from "./modules/single-page-app.module";
import TopicItemsModule from "./modules/quiz/topic-items/topic-items.module";
import LearnModule from "./modules/quiz/learn/learn.module";
import links from "./links.d";
import "./index.css";
import ExamItemsModule from "./modules/exam/topic-items/topic-items.module";

const ANIMATION_DURATION = 500;

const rootElement = document.getElementById("root")!;
rootElement.style.transition = `${ANIMATION_DURATION / 1000}s`;
rootElement.style.opacity = "0";

setTimeout(() => {
  rootElement.style.opacity = "1";

  createRoot(rootElement).render(
    <BrowserRouter>
      <Routes>
        <Route path={links.topicsComponent} element={<TopicsModule />} />
        <Route
          path={`${links.topicItemsComponent}/:id`}
          element={<TopicItemsModule />}
        />
        <Route
          path={`${links.learnTopicComponent}/:id`}
          element={<LearnModule />}
        />
        <Route path={links.singlePageApp} element={<SinglePageApp />} />
        <Route path={links.examComponent} element={<ExamItemsModule />} />
        <Route path="*" element={<IndexModule />} />
      </Routes>
    </BrowserRouter>,
  );
}, ANIMATION_DURATION + 100);
