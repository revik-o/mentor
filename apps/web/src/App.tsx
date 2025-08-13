import './App.css'
import { useCallback, useState, type ReactNode } from 'react'
import { ActivityContextProvider } from './contexts/activity.context'
import { MainPage } from './page/main/Main.page'
import TopicPage from './page/topic/Topic.page'
import { ExamPage } from './page/exam/Exam.page'

function ActivityComponent({ activity }: { activity: string }): ReactNode {
  switch (activity) {
    case '/':
      return <MainPage />
    case '/topic':
      return <TopicPage />
    case '/exam':
      return <ExamPage />
    default:
      return <div>Not Found</div>
  }
}

function App() {
  const [activity, setActivity] = useState('/')
  const [params, setParams] = useState(new Map<string, object>())
  const setParam = useCallback(([key, value]: [string, object]) =>
    setParams(prev => new Map(prev).set(key, value))
  , [setParams])

  return <ActivityContextProvider value={{activity, setActivity, params, setParam}}>
    <ActivityComponent activity={activity} />
  </ActivityContextProvider>
}

export default App
