import { ReactNode, useCallback, useState } from "react";
import { AppNavigatorContextProvider } from "../contexts/app.context";
import TopicItemsModule from "./quiz/topic-items/topic-items.module";
import LearnModule from "./quiz/learn/learn.module";
import IndexModule from "./welcom/welcome.module";
import TopicsModule from "./topics/topics.module";
import links from "../links.d";

interface IProperties {
  resource: string;
}

function Resources({ resource }: IProperties): ReactNode {
  switch (resource) {
    case links.topicsComponent:
      return <TopicsModule />;
    case links.topicItemsComponent:
      return <TopicItemsModule />;
    case links.learnTopicComponent:
      return <LearnModule />;
    default:
      return <IndexModule />;
  }
}

export default function SinglePageApp(): ReactNode {
  const [resource, setResource] = useState("*");
  const [topicId, setTopicId] = useState(-1);
  const appNavigateCallback = useCallback((endpoint: string) => {
    const link = endpoint.split("/");

    if (endpoint === links.topicsComponent) {
      setResource(links.topicsComponent);
    } else if (endpoint.startsWith(links.topicItemsComponent)) {
      setTopicId(parseInt(link[link.length - 1]));
      setResource(links.topicItemsComponent);
    } else if (endpoint.startsWith(links.learnTopicComponent)) {
      setTopicId(parseInt(link[link.length - 1]));
      setResource(links.learnTopicComponent);
    } else {
      setResource(endpoint);
    }
  }, []);

  return (
    <AppNavigatorContextProvider
      value={{ navigator: appNavigateCallback, topicId }}
    >
      <Resources resource={resource} />
    </AppNavigatorContextProvider>
  );
}
