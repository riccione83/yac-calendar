import React from 'react'

import Calendar from 'yac-calendar'
import 'yac-calendar/dist/index.css'

const App = () => {
  return (
    <Calendar
      date={new Date()}
      timeRange={{
        start: new Date(2021, 2, 24),
        end: new Date(2021, 2, 26)
      }}
      onSelectRange={(start, end) => console.info('Selected:', start, end)}
    />
  )
}

export default App
