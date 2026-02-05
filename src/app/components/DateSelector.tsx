/**
 * Date input element that exposes its value as an ISO 8601 UTC string.
 * @param param0.date the date value that is selected.
 * @param param0.setDate The callback for changes in the date value.
 * @param param0.timezoneOffset The timezone offset in minutes to use for displaying the date.
 * This is the number of minutes by which the timezone is behind UTC.
 * For example, if it is 18:00 UTC and the user's current time is 13:00, the timezone offset is 5 * 60 = 300.
 */
export default function DateSelector({
  value,
  onChange,
  timezoneOffset = new Date().getTimezoneOffset(),
}: {
  value: string;
  onChange: (updater: (oldDate: string) => string) => void;
  timezoneOffset?: number;
}) {
  function isoUtcToDateTimeLocal(date: string) {
    const dateObj = new Date(date);
    dateObj.setMinutes(dateObj.getMinutes() - timezoneOffset);
    return dateObj.toISOString().slice(0, 16);
  }

  function dateTimeLocalToIsoUtc(date: string) {
    const dateObj = new Date(date + "Z");
    dateObj.setMinutes(dateObj.getMinutes() + timezoneOffset);
    return dateObj.toISOString();
  }

  return (
    <>
      <input
        type="datetime-local"
        value={isoUtcToDateTimeLocal(value)}
        onChange={(e) => {
          onChange(() => dateTimeLocalToIsoUtc(e.target.value));
        }}
      />
    </>
  );
}
