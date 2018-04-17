import React from 'react'
import Calendar from 'material-ui/DatePicker/Calendar'
// import to override the render of Calendar
import CalendarActionButtons from 'material-ui/DatePicker/CalendarActionButtons';
import CalendarMonth from 'material-ui/DatePicker/CalendarMonth';
import CalendarToolbar from 'material-ui/DatePicker/CalendarToolbar';
import DateDisplay from 'material-ui/DatePicker/DateDisplay';
import SlideInTransitionGroup from 'material-ui/internal/SlideIn';
import transitions from 'material-ui/styles/transitions';
import EventListener from 'react-event-listener';
import Divider from 'material-ui/Divider'
import {
  localizedWeekday,
} from 'material-ui/DatePicker/dateUtils';

import Loader from '../../components/Loader/ContentLoader'
import NoResultFound from '../../components/NoResultFoundCard'
import { isInCurrentMonth } from '../../libs/helpers/common'

const daysArray = [...Array(7)];
// overrides the handleTouchTapDay of calendar plugin
function handleTouchTapDay() {
  // prevents the date selection so that always the current date is set to the present day date
}

function handleMonthChange(months) {
  const startDate = this.props.utils.addMonths(this.state.displayDate, months)
  // logic to get end Date of month
  this.setState({
    transitionDirection: months >= 0 ? 'left' : 'right',
    displayDate: startDate,
  })
  this.callBack(startDate)
}

function callBack(startDate) {
  const { onMonthChange } = this.props
  let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
  if (isInCurrentMonth(startDate)) {
    endDate = new Date()
  }
  onMonthChange(startDate, endDate)
}

// extends the Calendar component
export default class CustomCalendar extends Calendar {
  constructor(props) {
    super(props)
    this.handleTouchTapDay = handleTouchTapDay.bind(this)
    this.handleMonthChange = handleMonthChange.bind(this)
    this.callBack = callBack.bind(this)
  }

  // same as render of calendar component, some designing purpose customization has added
  render() {
    const { prepareStyles } = this.context.muiTheme;
    const { hideCalendarDate } = this.props;
    const toolbarInteractions = this.getToolbarInteractions();
    const isLandscape = this.props.mode === 'landscape';
    const { calendarTextColor } = this.context.muiTheme.datePicker;

    const styles = {
      root: {
        color: calendarTextColor,
        userSelect: 'none',
        width: (!hideCalendarDate && isLandscape) ? 479 : 288,
      },
      calendar: {
        display: 'flex',
        flexDirection: 'column',
      },
      calendarContainer: {
        display: 'flex',
        alignContent: 'space-between',
        justifyContent: 'space-between',
        flexDirection: 'column',
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'proxima_novasemibold',
        letterSpacing: '1.5px',
        transition: transitions.easeOut(),
      },
      yearContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        marginTop: 10,
        overflow: 'hidden'
      },
      weekTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontWeight: '500',
        height: 20,
        lineHeight: '15px',
        opacity: '0.5',
        textAlign: 'center',
        padding: '0px 12px'
      },
      weekTitleDay: {
        width: 42,
      },
      transitionSlide: {
        height: 190,
      },
    };

    const weekTitleDayStyle = prepareStyles(styles.weekTitleDay);

    const {
      cancelLabel,
      DateTimeFormat,
      firstDayOfWeek,
      locale,
      okLabel,
      onClickCancel, // eslint-disable-line no-unused-vars
      onClickOk, // eslint-disable-line no-unused-vars
      utils,
      isFetching,
      isError
    } = this.props;
    /* eslint-disable react/no-array-index-key */
    return (
      <div style={prepareStyles(styles.root)}>
        <EventListener
          target="window"
          onKeyDown={this.handleWindowKeyDown}
        />
        {!hideCalendarDate &&
          <DateDisplay
            DateTimeFormat={DateTimeFormat}
            disableYearSelection={this.props.disableYearSelection}
            onClickMonthDay={this.handleTouchTapDateDisplayMonthDay}
            onClickYear={this.handleTouchTapDateDisplayYear}
            locale={locale}
            monthDaySelected={this.state.displayMonthDay}
            mode={this.props.mode}
            selectedDate={this.state.selectedDate}
          />
        }
        <div style={prepareStyles(styles.calendar)}>
          {this.state.displayMonthDay &&
            <div style={prepareStyles(styles.calendarContainer)}>
              <div className={'calendarHeader'}>
                <CalendarToolbar
                  DateTimeFormat={DateTimeFormat}
                  locale={locale}
                  displayDate={this.state.displayDate}
                  onMonthChange={this.handleMonthChange}
                  prevMonth={toolbarInteractions.prevMonth}
                  nextMonth={toolbarInteractions.nextMonth}
                />
              </div>
              <div style={{ margin: '15px 20px 45px 20px', opacity: '0.5' }}>
                <Divider />
              </div>
              <div style={prepareStyles(styles.weekTitle)}>
                {daysArray.map((event, i) => (
                  <span key={i} style={weekTitleDayStyle}>
                    {localizedWeekday(DateTimeFormat, locale, i, firstDayOfWeek)}
                  </span>
                ))}
              </div>
              <SlideInTransitionGroup
                direction={this.state.transitionDirection}
                style={styles.transitionSlide}
              >
                <div className={'calendarDays'} style={{ padding: '0px 12px' }}>
                  {
                    isError
                    ? <NoResultFound zDepth={0} style={{ backgroundColor: 'none' }} text="Oops, Something went wrong" />
                    : isFetching
                      ? <Loader zDepth={0} style={{ backgroundColor: 'none' }} progressColor="white" />
                      : <CalendarMonth
                        DateTimeFormat={DateTimeFormat}
                        locale={locale}
                        displayDate={this.state.displayDate}
                        firstDayOfWeek={this.props.firstDayOfWeek}
                        key={this.state.displayDate.toDateString()}
                        minDate={this.getMinDate()}
                        maxDate={this.getMaxDate()}
                        onClickDay={this.handleTouchTapDay}
                        ref="calendar"
                        selectedDate={this.state.selectedDate}
                        shouldDisableDate={this.props.shouldDisableDate}
                        utils={utils}
                      />
                  }
                </div>
              </SlideInTransitionGroup>
            </div>
          }
          {!this.state.displayMonthDay &&
            <div style={prepareStyles(styles.yearContainer)}>
              {this.yearSelector()}
            </div>
          }
          {okLabel &&
            <CalendarActionButtons
              autoOk={this.props.autoOk}
              cancelLabel={cancelLabel}
              okLabel={okLabel}
              onClickCancel={onClickCancel}
              onClickOk={onClickOk}
            />
          }
        </div>
      </div>
    );
  }
}
