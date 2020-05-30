module.exports = function(date_time) {

    date_time.setHours(date_time.getHours() + 5);
    date_time.setMinutes(date_time.getMinutes() + 30);

    return date_time;
}