
export const unixToDate = (unix_timestamp: number | string ): string => {

  if (typeof unix_timestamp == 'string') {
    unix_timestamp = parseInt(unix_timestamp)
  }

  var a = new Date(unix_timestamp * 1000);
  var year = a.getFullYear();
  var month = a.getMonth()
  var date = a.getDate();
  var time: string = year + '-' + month + '-' + date
  return time;

}

