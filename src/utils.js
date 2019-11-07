export function formatDate(date) {      
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return year + '/' + month + '/' + day;
}

export function parseDate(string) {
    var b = string.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2]));
}

export function getDayOfWeekName(date){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[date.getDay()];
}