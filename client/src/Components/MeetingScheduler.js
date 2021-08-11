import * as React from "react";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { getDifferenceInDays } from "./Misc";
import {
    Scheduler,
    WeekView,
    Toolbar,
    DateNavigator,
    Appointments,
    AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import "../public/css/main.css";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    timeTableCell: {
        height: "30px",
        "&:hover": {
            backgroundColor: "inherit",
        },
    },
    timeLabel: {
        height: "30px",
        lineHeight: "29.4px",
        "&:first-child": {
            height: "15px",
        },
        "&:last-child": {
            height: "15px",
        },
    },
});

const TimeTableCell = (props) => {
    const classes = useStyles();
    return (
        <WeekView.TimeTableCell {...props} tabindex="-1" className={classes.timeTableCell} />
    );
};
const TimeLabel = (props) => {
    const classes = useStyles();
    return <WeekView.TimeScaleLabel {...props} className={classes.timeLabel} />;
};
const TickCell = (props) => {
    const classes = useStyles();
    return <WeekView.TimeScaleTickCell {...props} className={classes.timeTableCell} />;
};

function hashColor(str) {
    let p = 31;
    let m = 1e9 + 9;
    let power_of_p = 1;
    let hash_val = 0;

    for (let i = 0; i < str.length; i++) {
        hash_val = (hash_val + (str[i].charCodeAt() - "a".charCodeAt() + 1) * power_of_p) % m;
        power_of_p = (power_of_p * p) % m;
    }
    return hash_val % 256;
}

const view = [
    {
        type: "week",
        name: "Numeric Mode",
        maxAppointmentsPerCell: 1,
    },
];
const Appointment = ({ children, style, ...restProps }) => {
    return (
        <Appointments.Appointment
            {...restProps}
            style={{
                ...style,
                backgroundColor: `hsl(${hashColor(children[1].props.data.title)} 50% 50%)`,
                borderRadius: "8px",
            }}>
            {children}
        </Appointments.Appointment>
    );
};

const dayLimit = 14;

export default class MeetingScheduler extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.appointments,
            currentDate: this.props.currentWeek,
            visible: false,
            appointmentMeta: {
                target: null,
                data: {},
            },
        };
        this.toggleVisibility = () => {
            const { visible: tooltipVisibility } = this.state;
            this.setState({ visible: !tooltipVisibility });
        };
        this.onAppointmentMetaChange = ({ data, target }) => {
            this.setState({ appointmentMeta: { data, target } });
        };
        this.currentDateChange = (currentDate) => {
            let thisWeek = new Date();
            while (thisWeek.getDay() !== 0) {
                thisWeek = new Date(
                    thisWeek.getFullYear(),
                    thisWeek.getMonth(),
                    thisWeek.getDate() - 1
                );
            }
            let diff = getDifferenceInDays(currentDate, thisWeek);
            if (diff <= dayLimit && diff >= 0) {
                this.setState({ currentDate });
                this.props.weekChange(currentDate);
            }
        };
    }
    abs = (num) => {
        return num < 0 ? -num : num;
    };

    render() {
        const { data, currentDate } = this.state;

        return (
            <Scheduler data={data} height={632} view={view}>
                <ViewState
                    currentDate={currentDate}
                    onCurrentDateChange={(e) => {
                        this.currentDateChange(e);
                    }}
                />
                <WeekView
                    displayName
                    startDayHour={"9:00"}
                    endDayHour={"17:30"}
                    timeTableCellComponent={TimeTableCell}
                    timeScaleLabelComponent={TimeLabel}
                    timeScaleTickCellComponent={TickCell}
                />

                <Toolbar />
                <DateNavigator />
                <Appointments appointmentComponent={Appointment} />
                <AppointmentTooltip
                    showCloseButton
                    visible={this.state.visible}
                    onVisibilityChange={this.toggleVisibility}
                    appointmentMeta={this.state.appointmentMeta}
                    onAppointmentMetaChange={this.onAppointmentMetaChange}
                />
            </Scheduler>
        );
    }
}
