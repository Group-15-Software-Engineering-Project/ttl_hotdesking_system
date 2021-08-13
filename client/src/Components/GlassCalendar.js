import React, { useState } from "react";
// import { CircleFlag } from "react-circle-flags";

import "../public/css/GlassCalendarStyles.css";

const months = {
    gb: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    pl: [
        "Sty.",
        "Lut.",
        "Mar.",
        "Kwi.",
        "Maj",
        "Cze.",
        "Lip.",
        "Sie.",
        "Wrz.",
        "Paź.",
        "Lis.",
        "Gru.",
    ],
    jp: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
    ],
    cn: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
    ],
    sa: [
        "يناير",
        "فبراير",
        "مارس",
        "إبريل",
        "مايو",
        "يونيه",
        "يوليه",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
    ],
    kr: [
        "일월",
        "이월",
        "삼월",
        "사월",
        "오월",
        "유월",
        "칠월",
        "팔월",
        "구월",
        "시월",
        "십일월",
        "십이월",
    ],
    ie: ["Ean", "Fea", "Mar", "Abr", "Bea", "Mei", "Iúl", "Lún", "Mnf", "Drf", "Sam", "Nol"],
};
const weekdays = {
    gb: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pl: ["Pn.", "Wt.", "Śr.", "Cz.", "Pt.", "Sb.", "Nd."],
    jp: ["月", "火", "水", "木", "金", "土", "日"],
    cn: ["一", "二", "三", "四", "五", "六", "日"],
    sa: ["الأثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعه", "السبت", "الأحد"],
    kr: ["월", "화", "수", "목", "금", "토", "일"],
    ie: ["Ln", "Mt", "Cd", "Dr", "Ao", "St", "Dm"],
};

const countries = ["gb", "pl", "cn", "jp", "kr"];

const convertToArabicNumerals = (number) => {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩".split("");
    let output = "";
    for (let char of String(number).split("")) {
        output += arabicNumbers[parseInt(char)];
    }
    return output;
};

function GlassCalendar(props) {
    const [langIndex, updateIndex] = useState(0);
    const [language, changeLanguage] = useState(countries[langIndex]);
    const [currentMonth, updateMonth] = useState(new Date().getMonth());
    const [currentYear, updateYear] = useState(new Date().getFullYear());
    const [startOfWeek, updateStartOfWeek] = useState("mon");
    const [dayHighlight, setDayHighlight] = useState(0);
    const [view, changeView] = useState("daysInMonth");
    const [today] = useState(new Date());

    const dismount = () => {
        console.log("dismounted");
    };

    const arrayRotate = (arr, rotation) => {
        let array = arr.slice();
        if (rotation < 0) {
            for (let i = 0; i > rotation; i--) {
                array.push(array.shift());
            }
        } else {
            for (let i = 0; i < rotation; i++) {
                array.unshift(array.pop());
            }
        }
        return array;
    };
    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    };
    const trimToLength3 = (value) => {
        return value.substring(0, 3);
    };

    const dayIndex = (day) => {
        if (day.toLowerCase().includes("none")) return 7;
        else if (day.toLowerCase().includes("all")) return 1234560;
        let days = day.toLowerCase().split(" ").filter(onlyUnique).filter(trimToLength3);

        if (days.indexOf("sun") !== -1) {
            days.push(days.splice(days.indexOf("sun"), 1)[0]);
        }

        let output = 0;
        for (let d of days)
            switch (d) {
                case "mon":
                    output = output * 10 + 1;
                    break;
                case "tue":
                    output = output * 10 + 2;
                    break;
                case "wed":
                    output = output * 10 + 3;
                    break;
                case "thu":
                    output = output * 10 + 4;
                    break;
                case "fri":
                    output = output * 10 + 5;
                    break;
                case "sat":
                    output = output * 10 + 6;
                    break;
                case "sun":
                    output = output * 10;
                    break;
                default:
                    console.error(
                        "Illegal argument:",
                        "'" + day + "'",
                        "passed into BigCalendar"
                    );
                    return 7;
            }
        return output;
    };
    React.useEffect(() => {
        loadLanguageProps();
        if (props.weekStart) {
            if (dayIndex(props.weekStart) < 7) updateStartOfWeek(props.weekStart);
        }
        if (props.highlight) {
            setDayHighlight(dayIndex(props.highlight));
        }
    }, []);

    const loadLanguageProps = () => {
        if (props.customLanguages) {
            if (Array.isArray(props.customLanguages)) {
                for (let language of props.customLanguages) {
                    if (language.weekdays && language.months && language.countryCode)
                        if (language.weekdays.length === 7 && language.months.length === 12) {
                            countries.push(language.countryCode);
                            weekdays[language.countryCode] = language.weekdays;
                            months[language.countryCode] = language.months;
                            continue;
                        }
                    console.error("The following has inconsistent data:", language);
                }
            } else {
                console.error("customLanguages is not an array.", props.customLanguages);
            }
        }
    };
    const previousMonth = () => {
        let month = currentMonth;
        let year = currentYear;
        if (month === 11) {
            year = currentYear - 1 < 1970 ? 1970 : currentYear - 1;
        }
        if (!(currentMonth === 0 && currentYear === 1970)) {
            month = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
        }
        updateMonth(month);
        updateYear(year);
        if (props.onMonthChange) props.onMonthChange(new Date(year, month, 1, 12, 0));
    };
    const nextMonth = () => {
        let month = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
        let year = currentYear;
        if (month === 0) {
            year++;
        }
        updateMonth(month);
        updateYear(year);

        if (props.onMonthChange) props.onMonthChange(new Date(year, month, 1, 12, 0));
    };
    const selectCell = (cell) => {
        if (deselectCell(cell)) cell.classList.add("selected-calendar-cell");
    };
    const deselectCell = (cell) => {
        let previousSelected = document.querySelector(".calendar-cell.selected-calendar-cell");
        if (cell === previousSelected) {
            //TODO change calendar view into the selected day.
            console.log("Selected Cell has been Clicked!");
            return false;
        }
        if (previousSelected) previousSelected.classList.remove("selected-calendar-cell");
        return true;
    };
    const isSameDay = (day1, day2) => {
        return (
            day1.getDate() === day2.getDate() &&
            day1.getMonth() === day2.getMonth() &&
            day1.getFullYear() === day2.getFullYear()
        );
    };
    const getDayData = (date) => {
        return {
            weekday: date.getDay(),
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
        };
    };

    const getDaysInMonth = (month, year, weekStart) => {
        let days = [[]];
        let day = 1;
        let date = new Date(year, month, day);
        let dayData = [];

        //Getting info about current month
        while (date.getMonth() === month) {
            dayData.push(getDayData(date));
            date = new Date(year, month, ++day, 12, 0);
        }

        //Fill out days
        for (let d of dayData) {
            let currentDayIndex = (7 - weekStart + d.weekday) % 7;
            let currentDate = new Date(year, month, d.day);
            if (!days[days.length - 1][currentDayIndex] && d.weekday !== weekStart) {
                days[days.length - 1][currentDayIndex] = (
                    <div
                        key={String(currentDate)}
                        title={`${
                            weekdays[language][currentDayIndex]
                        } ${currentDate.getDate()} ${
                            months[language][currentDate.getMonth()]
                        } ${currentDate.getFullYear()}`}
                        tabIndex="0"
                        date={new Date(currentYear, currentMonth, d.day, 12, 0)}
                        className={`calendar-cell current-month-day${
                            isSameDay(today, new Date(year, month, d.day))
                                ? " today"
                                : String(dayHighlight).includes(d.weekday)
                                ? " calendar-day-highlight"
                                : ""
                        } ${
                            props.tileClass
                                ? props.tileClass(
                                      new Date(currentYear, currentMonth, d.day, 12, 0)
                                  )
                                : ""
                        } ${props.selectionClass ? props.selectionClass : ""}`}
                        onClick={(e) => {
                            selectCell(e.target);
                            if (props.onDaySelect)
                                props.onDaySelect(new Date(e.target.getAttribute("date")));
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") e.target.click();
                        }}>
                        {d.day}
                    </div>
                );
            } else {
                days.push([]);
                days[days.length - 1][currentDayIndex] = (
                    <div
                        key={String(new Date(year, month, d.day))}
                        tabIndex="0"
                        date={new Date(currentYear, currentMonth, d.day, 12, 0)}
                        className={`calendar-cell current-month-day${
                            isSameDay(today, new Date(year, month, d.day))
                                ? " today"
                                : String(dayHighlight).includes(d.weekday)
                                ? " calendar-day-highlight"
                                : ""
                        } ${
                            props.tileClass
                                ? props.tileClass(
                                      new Date(currentYear, currentMonth, d.day, 12, 0)
                                  )
                                : ""
                        } ${props.selectionClass ? props.selectionClass : ""}`}
                        onClick={(e) => {
                            selectCell(e.target);
                            if (props.onDaySelect)
                                props.onDaySelect(new Date(e.target.getAttribute("date")));
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") e.target.click();
                        }}>
                        {d.day}
                    </div>
                );
            }
        }
        //Check first array for emptiness
        if (days[0].length === 0) days.splice(0, 1);

        for (let i = 0; i < days[0].length; i++) {
            if (!days[0][i]) days[0][i] = 0;
        }
        //Fill out last array with missing days
        while (days[days.length - 1].length !== 7) {
            days[days.length - 1].push(0);
        }

        //Ensure there are 6 arrays for size consistency
        while (days.length < 6) {
            days.push([0, 0, 0, 0, 0, 0, 0]);
        }

        //Get days of previous month
        let daysLastMonth = new Date(year, month, 0).getDate();
        for (let i = days[0].lastIndexOf(0); i >= 0; i--) {
            days[0][i] = (
                <div
                    key={String(new Date(year, month, daysLastMonth))}
                    date={new Date(year, month, daysLastMonth, 12, 0)}
                    className={`calendar-cell other-month-day`}>
                    {daysLastMonth--}
                </div>
            );
        }

        //Get days of next month
        let nextMonthDay = 1;
        for (let week = 3; week < days.length; week++) {
            for (let d = 0; d < days[week].length; d++) {
                if (days[week][d] === 0)
                    days[week][d] = (
                        <div
                            key={String(new Date(year, month, nextMonthDay))}
                            date={new Date(year, month, nextMonthDay, 12, 0)}
                            className={`calendar-cell other-month-day`}>
                            {nextMonthDay++}
                        </div>
                    );
            }
        }

        //Disable
        if (props.disableTile) {
            for (let i in days) {
                for (let j in days[i]) {
                    if (props.disableTile(new Date(days[i][j].props.date))) {
                        days[i][j] = (
                            <div
                                key={String(new Date(days[i][j].props.date))}
                                date={new Date(days[i][j].props.date)}
                                className={`calendar-cell other-month-day`}>
                                {new Date(days[i][j].props.date).getDate()}
                            </div>
                        );
                    }
                }
            }
        }
        return days;
    };

    const calendarNav = () => {
        return (
            <div key="calendar-navigation-bar" className="calendar-row calendar-nav">
                <div
                    key="calendar-nav-prev-month"
                    className="calendar-cell prev-month"
                    tabIndex="0"
                    onClick={() => {
                        previousMonth();
                        deselectCell();
                    }}
                    onKeyPress={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            previousMonth();
                            deselectCell();
                        }
                    }}></div>
                {!props.hideYearButtons ? (
                    <div
                        key="calendar-nav-prev-year"
                        className="calendar-cell prev-year "
                        tabIndex="0"
                        onKeyPress={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                                updateYear(currentYear - 1 < 1970 ? 1970 : currentYear - 1);
                            }
                        }}
                        onClick={() =>
                            updateYear(currentYear - 1 < 1970 ? 1970 : currentYear - 1)
                        }></div>
                ) : (
                    <div className="calendar-cell" />
                )}
                <div
                    key="calendar-nav-month-display"
                    className="calendar-cell calendar-nav-month">
                    {months[language][currentMonth]}
                </div>
                {!props.hideLanguageToggle ? (
                    <div
                        key="calendar-nav-flag-toggle"
                        className="calendar-cell center-content flag-toggle"
                        tabIndex="0"
                        onKeyPress={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                                changeLanguage(countries[(langIndex + 1) % countries.length]);
                                updateIndex((langIndex + 1) % countries.length);
                            }
                        }}
                        onClick={() => {
                            changeLanguage(countries[(langIndex + 1) % countries.length]);
                            updateIndex((langIndex + 1) % countries.length);
                        }}>
                        {/* <CircleFlag
                            style={{
                                height: "1.2em",
                                width: "1.2em",
                            }}
                            countryCode={language}></CircleFlag> */}
                    </div>
                ) : (
                    <div className="calendar-cell" />
                )}
                <div key="calendar-nav-year-display" className="calendar-cell">
                    {currentYear}
                </div>
                {!props.hideYearButtons ? (
                    <div
                        key="calendar-nav-next-year"
                        className="calendar-cell next-year"
                        tabIndex="0"
                        onKeyPress={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                                updateYear(currentYear + 1);
                            }
                        }}
                        onClick={() => updateYear(currentYear + 1)}></div>
                ) : (
                    <div className="calendar-cell" />
                )}
                <div
                    key="calendar-nav-next-month"
                    className="calendar-cell next-month"
                    tabIndex="0"
                    onClick={() => {
                        nextMonth();
                        deselectCell();
                    }}
                    onKeyPress={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            nextMonth();
                            deselectCell();
                        }
                    }}></div>
            </div>
        );
    };
    const calendarWeekdays = (weekStart) => {
        let highlight = String(dayHighlight);
        return (
            <div key="calendar-weekday-names" className="calendar-row calendar-weekdays">
                {arrayRotate(weekdays[language], -weekStart + 1).map((x, i) => {
                    return (
                        <div
                            key={`calendar-weekday-${x}`}
                            className={`calendar-cell${
                                highlight.includes(
                                    dayIndex(arrayRotate(weekdays["gb"], 1 - weekStart)[i])
                                )
                                    ? " calendar-day-highlight"
                                    : ""
                            }`}>
                            {x}
                        </div>
                    );
                })}
            </div>
        );
    };
    const fillCalendarDaysInMonth = (weeks, calendar) => {
        for (let week of weeks) {
            calendar.push(
                <div key={`calendar-week-${weeks.indexOf(week)}`} className="calendar-row">
                    {week.map((day) => {
                        return day;
                    })}
                </div>
            );
        }
    };
    const daysInMonthLayout = (month, year) => {
        let weekStart = dayIndex(startOfWeek);
        let calendar = [];
        calendar.push(calendarNav());
        calendar.push(calendarWeekdays(weekStart));
        fillCalendarDaysInMonth(getDaysInMonth(month, year, weekStart), calendar);
        return (
            <div key="calendar-wrapper" className={`calendar-wrapper`}>
                {calendar}
            </div>
        );
    };
    return (
        <div style={{ fontSize: `${String(props.size).replaceAll(/[^0-9.]/giu, "")}em` }}>
            {daysInMonthLayout(currentMonth, currentYear)}
        </div>
    );
}

export default GlassCalendar;
