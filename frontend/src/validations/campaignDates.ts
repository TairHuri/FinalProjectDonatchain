export const formatDates = (startDateStr: string, endDsteStr: string, minutes:number=5) => {
    const now = new Date();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDsteStr);
    // if it is todayset to an hour ahead in the future
    if (startDate.getFullYear() == now.getFullYear() && startDate.getMonth() == now.getMonth() && startDate.getDate() == now.getDate()) {
        console.log('today');
        startDate.setHours(now.getHours());
        startDate.setMinutes(now.getMinutes() + minutes)
    } else {
        // set to midnight
        startDate.setHours(0);
        startDate.setMinutes(0);
    }
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    console.log(startDate, endDate);
    return {startDate, endDate}
}