import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import addMonths from 'date-fns/addMonths'
import isSameDay from 'date-fns/isSameDay'
import isWithinInterval from 'date-fns/isWithinInterval'
import React, { useState } from 'react'
import styles from './styles.module.css'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

interface Props {
  date: Date
  timeRange?: TimeRange
  onSelectRange: (start: Date, end: Date) => void
  useDoubleMonths?: boolean
}

interface TimeRange {
  start?: Date
  end?: Date
}
const Calendar: React.FC<Props> = ({
  date,
  timeRange,
  useDoubleMonths,
  onSelectRange
}: Props) => {
  const [currentDate, setDate] = useState<Date>(date)
  const [internalRange, setInternalRange] = useState<TimeRange>(timeRange || {})
  const [usePreselection, setPreselection] = useState<TimeRange>(
    timeRange || {}
  )

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

  const previousMonth = () => {
    const newDate = addMonths(currentDate, -1)
    setDate(newDate)
  }

  const nextMonth = () => {
    const newDate = addMonths(currentDate, +1)
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
    /* Preselection active */
    if (usePreselection.start && usePreselection.end) {
      if (usePreselection.start.getTime() !== usePreselection.end.getTime()) {
        if (isSameDay(date, usePreselection.start)) {
          return classNames(styles.date_pre_selected_start)
        } else if (isSameDay(date, usePreselection.end)) {
          return classNames(styles.date_pre_selected_end)
        } else if (
          isWithinInterval(date, {
            start: usePreselection.start,
            end: usePreselection.end
          })
        ) {
          return classNames(styles.date_pre_selected)
        }
      }
    } else if (internalRange.start && internalRange.end) {
      /* Preselection has been completed and the range is selected */
      if (
        internalRange.start.getTime() === internalRange.end.getTime() &&
        isSameDay(date, internalRange.start)
      ) {
        return classNames(styles.date_selected_single)
      } else if (
        internalRange.start.getTime() !== internalRange.end.getTime()
      ) {
        if (isSameDay(date, internalRange.start)) {
          return classNames(styles.date_selected_first)
        } else if (isSameDay(date, internalRange.end)) {
          return classNames(styles.date_selected_last)
        } else if (
          isWithinInterval(date, {
            start: internalRange.start,
            end: internalRange.end
          })
        ) {
          return classNames(styles.date_selected)
        }
      }
    }

    if (isSameDay(date, new Date())) {
      return classNames(styles.today)
    }

    return ''
  }

  const renderDays = (
    date: Date,
    renderPrevMonth: boolean,
    renderNextMonth: boolean
  ) => {
    const days: { day: string; data: Date; className: string }[] = []

    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate()

    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0)
    const firstDayIndex = date

    const lastDayIndex = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
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
        day: renderPrevMonth ? `${prevLastDay.getDate() - x + 1}` : '',
        data: _day,
        className: renderPrevMonth
          ? classNames(styles.prev_date, getClassForDate(_day))
          : classNames(styles.day_disabled)
      })
    }

    for (let i = 1; i <= lastDay; i++) {
      const _day = new Date(date.getFullYear(), date.getMonth(), i)
      days.push({
        day: `${i}`,
        data: _day,
        className:
          i === new Date().getDate() &&
          date.getMonth() === new Date().getMonth()
            ? classNames('today', getClassForDate(_day))
            : classNames('', getClassForDate(_day))
      })
    }

    if (renderNextMonth) {
      for (let j = 1; j <= nextDays; j++) {
        const _day = new Date(
          addMonths(date, +1).getFullYear(),
          addMonths(date, +1).getMonth(),
          j
        )
        days.push({
          day: `${j}`,
          data: _day,
          className: classNames('next-date', getClassForDate(_day))
        })
      }
    }

    return days
  }

  console.info(!useDoubleMonths)

  return (
    <div className={styles.container}>
      <div
        className={useDoubleMonths ? styles.calendar_multiple : styles.calendar}
      >
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
          {!useDoubleMonths ? (
            <FontAwesomeIcon
              icon={faAngleRight}
              onClick={() => nextMonth()}
              size={'3x'}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <div />
          )}
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
          {renderDays(currentDate, true, !useDoubleMonths).map((day) => (
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

      {useDoubleMonths && (
        <div
          className={
            useDoubleMonths ? styles.calendar_multiple : styles.calendar
          }
        >
          <div className={styles.month}>
            <div />
            <div className={styles.date}>
              <h1>{months[addMonths(currentDate, 1).getMonth()]}</h1>
              <p>{addMonths(currentDate, 1).getFullYear()}</p>
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
            {renderDays(addMonths(currentDate, 1), false, true).map((day) => (
              <div
                key={day.data.toString()}
                className={day.className}
                onClick={() => handleDayClick(day.data)}
                onMouseOver={() =>
                  timeRange?.start && handleMouseOver(day.data)
                }
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
