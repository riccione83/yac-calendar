# yac-calendar

> Calendar component written in react and typescript

[![NPM](https://img.shields.io/npm/v/yac-calendar.svg)](https://www.npmjs.com/package/yac-calendar) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save yac-calendar
```

or

```bash
yarn add yac-calendar
```

## Usage

```tsx
import React, { Component } from 'react'

import Calendar from 'yac-calendar'
import 'yac-calendar/dist/index.css'

class Example extends Component {
  render() {
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
}
```

#### Props:

`date` => First date to show (this will select the first month)
`timeRange` => Start and End date for the selection (optional)
`onSelectRange` => Callback after new range selected on the calendar.
`useDoubleMonths` => Will show the component as 2 months calendar.

## License

MIT © [riccione83](https://github.com/riccione83)
