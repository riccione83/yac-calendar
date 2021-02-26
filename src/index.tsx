import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import addMonths from 'date-fns/addMonths'
import isSameDay from 'date-fns/isSameDay'
import isWithinInterval from 'date-fns/isWithinInterval'
import React, { useMemo, useState } from 'react'
import styles from './styles.module.css'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

interface Props {
  date: Date
  timeRange?: { start: Date; end: Date }
  onSelectRange: (start: Date, end: Date) => void
}

const Calendar: React.FC<Props> = ({
  date,
  timeRange,
  onSelectRange
}: Props) => {
  const [currentDate, setDate] = useState<Date>(date)

  const [internalRange, setInternalRange] = useState<{
    start?: Date
    end?: Date
  }>({ start: timeRange?.start, end: timeRange?.end })

  const [usePreselection, setPreselection] = useState<{
    start?: Date
    end?: Date
  }>({ start: timeRange?.start, end: timeRange?.end })

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  function _addMonths(date: Date, months: number) {
    return addMonths(date, months)
  }

  const previousMonth = () => {
    const newDate = _addMonths(currentDate, -1)
    setDate(newDate)
  }

  const nextMonth = () => {
    const newDate = _addMonths(currentDate, +1)
    setDate(newDate)
  }

  const handleDayClick = (date: Date) => {
    if (internalRange.start && internalRange.end) {
      setInternalRange({ start: date })
      setPreselection({ start: date })
    } else if (usePreselection.start && usePreselection.end) {
      setInternalRange({
        start: usePreselection.start,
        end: usePreselection.end
      })
      setPreselection({})
      onSelectRange(usePreselection.start, usePreselection.end)
    }
  }

  const handleMouseOver = (date: Date) => {
    if (usePreselection.start && !!internalRange.start && !internalRange.end) {
      const start = date > internalRange.start ? internalRange.start : date
      const end = date > internalRange.start ? date : internalRange.start
      setPreselection({ start: start, end: end })
    }
  }

  const getClassForDate = (date: Date) => {
    if (usePreselection.start && usePreselection.end) {
      if (
        usePreselection.start.getTime() !== usePreselection.end.getTime() &&
        isSameDay(date, usePreselection.start)
      ) {
        return classNames(styles.date_pre_selected_start)
      }

      if (
        usePreselection.start.getTime() !== usePreselection.end.getTime() &&
        isSameDay(date, usePreselection.end)
      ) {
        return classNames(styles.date_pre_selected_end)
      }

      if (
        isWithinInterval(date, {
          start: usePreselection.start,
          end: usePreselection.end
        })
      ) {
        return classNames(styles.date_pre_selected)
      }
    } else if (internalRange.start && internalRange.end) {
      if (
        internalRange.start.getTime() === internalRange.end.getTime() &&
        isSameDay(date, internalRange.start)
      ) {
        return classNames(styles.date_selected_single)
      }

      if (
        internalRange.start.getTime() !== internalRange.end.getTime() &&
        isSameDay(date, internalRange.start)
      ) {
        return classNames(styles.date_selected_first)
      }

      if (
        internalRange.start.getTime() !== internalRange.end.getTime() &&
        isSameDay(date, internalRange.end)
      ) {
        return classNames(styles.date_selected_last)
      }

      if (
        internalRange.start.getTime() !== internalRange.end.getTime() &&
        isWithinInterval(date, {
          start: internalRange.start,
          end: internalRange.end
        })
      ) {
        return classNames(styles.date_selected)
      }

      if (isSameDay(date, new Date())) {
        return classNames(styles.today)
      }
    }
    return ''
  }

  const renderDays = useMemo(() => {
    const days: { day: number; data: Date; className: string }[] = []

    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate()

    const prevLastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    )
    const firstDayIndex = currentDate

    const lastDayIndex = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDay()

    const nextDays = 7 - lastDayIndex - 1

    for (let x = firstDayIndex.getDay(); x > 0; x--) {
      const _day = new Date(
        prevLastDay.getFullYear(),
        prevLastDay.getMonth(),
        prevLastDay.getDate() - x + 1
      )

      days.push({
        day: prevLastDay.getDate() - x + 1,
        data: _day,
        className: classNames('prev-date', getClassForDate(_day))
      })
    }

    for (let i = 1; i <= lastDay; i++) {
      const _day = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      )
      days.push({
        day: i,
        data: _day,
        className:
          i === new Date().getDate() &&
          currentDate.getMonth() === new Date().getMonth()
            ? classNames('today', getClassForDate(_day))
            : classNames('', getClassForDate(_day))
      })
    }

    for (let j = 1; j <= nextDays; j++) {
      const _day = new Date(
        _addMonths(currentDate, +1).getFullYear(),
        _addMonths(currentDate, +1).getMonth(),
        j
      )
      days.push({
        day: j,
        data: _day,
        className: classNames('next-date', getClassForDate(_day))
      })
    }

    return days
  }, [currentDate, internalRange, usePreselection])

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.month}>
          <FontAwesomeIcon
            icon={faAngleLeft}
            onClick={() => previousMonth()}
            size={'3x'}
            style={{ cursor: 'pointer' }}
          />
          <div className={styles.date}>
            <h1>{months[currentDate.getMonth()]}</h1>
            <p>{currentDate.getFullYear()}</p>
          </div>
          <FontAwesomeIcon
            icon={faAngleRight}
            onClick={() => nextMonth()}
            size={'3x'}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className={styles.weekdays}>
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className={styles.days}>
          {renderDays.map((day) => (
            <div
              key={day.data.toString()}
              className={day.className}
              onClick={() => handleDayClick(day.data)}
              onMouseOver={() => timeRange?.start && handleMouseOver(day.data)}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar
