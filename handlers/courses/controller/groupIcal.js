'use strict';

var path = require('path');
var config = require('config');
var fs = require('mz/fs');

/*
 BEGIN:VCALENDAR
 VERSION:2.0
 METHOD:PUBLIC
 X-WR-CALNAME:Courses
 X-WR-RELCALID:Courses
 PRODID:-//javascript//NONSGML v1.0//EN
 BEGIN:VTIMEZONE
 TZID:Europe/Moscow
 X-LIC-LOCATION:Europe/Moscow
 BEGIN:STANDARD
 TZOFFSETFROM:+0300
 TZOFFSETTO:+0300
 TZNAME:MSK
 DTSTART:19700101T000000
 END:STANDARD
 END:VTIMEZONE
 BEGIN:VEVENT
 UID:js-20160214-1930
 DTSTART;TZID=Europe/Moscow:20160215T193000
 DURATION:PT1H30M
 RRULE:FREQ=WEEKLY;UNTIL=20160415T183000Z;WKST=MO;BYDAY=MO,TH
 ORGANIZER;CN=Ilya Kantor:MAILTO:iliakan@javascript.ru
 SUMMARY:JavaScript/DOM/Интерфейсы
 END:VEVENT
 END:VCALENDAR
 */

exports.get = function*() {

  let group = this.groupBySlug;
  this.type = 'text/calendar; charset=utf-8';

  this.body = this.render('ical', { group });

};

