import * as Yup from "yup";

const MAX_HOUR = 23;
const MAX_MINUTE = 59;
const MIN_VALUE = 0;

export const operationalWindowCreateValidation = Yup.object({
  dayOfWeek: Yup.string().required('Day of week is required'),
  startHour: Yup.number()
    .required('Start hour is required')
    .min(MIN_VALUE, 'Hour must be between 0 and 23')
    .max(MAX_HOUR, 'Hour must be between 0 and 23')
    .integer('Must be an integer'),
  startMinute: Yup.number()
    .required('Start minute is required')
    .min(MIN_VALUE, 'Minute must be between 0 and 59')
    .max(MAX_MINUTE, 'Minute must be between 0 and 59')
    .integer('Must be an integer'),
  endHour: Yup.number()
    .required('End hour is required')
    .min(MIN_VALUE, 'Hour must be between 0 and 23')
    .max(MAX_HOUR, 'Hour must be between 0 and 23')
    .integer('Must be an integer'),
  endMinute: Yup.number()
    .required('End minute is required')
    .min(MIN_VALUE, 'Minute must be between 0 and 59')
    .max(MAX_MINUTE, 'Minute must be between 0 and 59')
    .integer('Must be an integer')
});