import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import IndexModule from "./modules/welcom/welcome.module";
import TopicsModule from "./modules/topics/topics.module";
import TopicItemsModule from "./modules/topic-items/topic-items.module";
import LearnModule from "./modules/learn/learn.module";
import "./index.css";

const ANIMATION_DURATION = 500;

const rootElement = document.getElementById("root")!;
rootElement.style.transition = `${ANIMATION_DURATION / 1000}s`;
rootElement.style.opacity = "0";

setTimeout(() => {
  rootElement.style.opacity = "1";

  createRoot(rootElement).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexModule />} />
        <Route path="/topics" element={<TopicsModule />} />
        <Route path="/topic/:id" element={<TopicItemsModule />} />
        <Route path="/topic/learn/:id" element={<LearnModule />} />
      </Routes>
    </BrowserRouter>,
  );
}, ANIMATION_DURATION + 100);
