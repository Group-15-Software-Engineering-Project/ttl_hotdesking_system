import * as React from "react";
import { ViewState, EditingState, IntegratedEditing } from "@devexpress/dx-react-scheduler";
import { getDifferenceInDays, verify } from "./Misc";
import {
    Scheduler,
    WeekView,
    Toolbar,
    DateNavigator,
    Appointments,
    AppointmentTooltip,
    ConfirmationDialog,
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

export default class MeetingScheduler extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            dayLimit: 14,
            data: this.props.appointments,
            currentDate: this.props.currentWeek,
            visible: false,
            appointmentMeta: {
                target: null,
                data: {},
            },
        };
        this.commitChanges = this.commitChanges.bind(this);

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
            if (diff <= this.state.dayLimit && diff >= 0) {
                this.setState({ currentDate });
                this.props.weekChange(currentDate);
            }
        };
    }

    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            let { data } = state;

            if (deleted !== undefined) {
                data = data.filter((appointment) => appointment.id !== deleted);
                fetch(`/api/appointments/${deleted}`, {
                    method: "DELETE",
                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Failed to delete appointment.");
                        else alert("Successfully deleted.");
                    })
                    .catch(alert);
            }
            return { data };
        });
    }
    abs = (num) => {
        return num < 0 ? -num : num;
    };

    componentDidMount = () => {
        fetch(`/api/adminOptions/${"Meeting_Room_Booking_Range"}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to retrieve option`);
                return res.json();
            })
            .then((res) => this.setState({ dayLimit: res.option.value * 7 }))
            .catch(console.error);
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
                <EditingState onCommitChanges={this.commitChanges} />
                <IntegratedEditing />
                <ConfirmationDialog />

                <Toolbar />
                <DateNavigator />
                <Appointments appointmentComponent={Appointment} />
                <AppointmentTooltip
                    showDeleteButton={verify(true)}
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
