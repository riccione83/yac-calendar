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

## Preview

![alt text](https://github.com/riccione83/yac-calendar/raw/master/example/ezgif-7-ee8485ad0ff8.gif?raw=true)
![alt text](https://github.com/riccione83/yac-calendar/raw/master/example/Screenshot.png)

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

`date` => First date to show (this will select the first month)<br>
`timeRange` => Start and End date for the selection (optional)<br>
`onSelectRange` => callback after new range selected on the calendar.<br>

## License

MIT © [Riccardo Rizzo](https://www.riccardorizzo.eu) - [riccione83](https://github.com/riccione83)
