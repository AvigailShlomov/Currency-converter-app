export function lastWeekDate(): string {
  let lastWeekDate = new Date();
  lastWeekDate.setDate(new Date().getDate() - 7);

  return formatDate(lastWeekDate);
}

function formatDate(date: Date): string {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function convertStringToDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}
