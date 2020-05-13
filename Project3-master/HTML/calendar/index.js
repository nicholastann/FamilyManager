console.log("here");
console.log(eventList);
$(document).ready(function() {
		
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        defaultDate: '2020-04-01',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: eventList
        // events: [
        //     {
        //         title: 'Alllll Day Event',
        //         start: '2020-04-03T20:45:00'
        //     },
        //     {
        //         title: 'Long Event',
        //         start: '2020-04-04T13:00:00'
        //     },
        //     {
        //         id: 999,
        //         title: 'Repeating Event',
        //         start: '2016-12-09T16:00:00'
        //     },
        //     {
        //         id: 999,
        //         title: 'Repeating Event',
        //         start: '2016-12-16T16:00:00'
        //     },
        //     {
        //         title: 'Conference',
        //         start: '2016-12-11',
        //         end: '2016-12-13'
        //     },
        //     {
        //         title: 'Meeting',
        //         start: '2016-12-12T10:30:00',
        //         end: '2016-12-12T12:30:00'
        //     },
        //     {
        //         title: 'Lunch',
        //         start: '2016-12-12T12:00:00'
        //     },
        //     {
        //         title: 'Meeting',
        //         start: '2016-12-12T14:30:00'
        //     },
        //     {
        //         title: 'Happy Hour',
        //         start: '2016-12-12T17:30:00'
        //     },
        //     {
        //         title: 'Dinner',
        //         start: '2016-12-12T20:00:00'
        //     },
        //     {
        //         title: 'Birthday Party',
        //         start: '2016-12-13T07:00:00'
        //     },
        //     {
        //         title: 'Click for Google',
        //         url: 'https://google.com/',
        //         start: '2016-12-28'
        //     }
        // ]
    });

    // var cal = document.getElementsByClassName('fc-view-container')
    // cal[0].style.backgroundColor = 'white';
    
});