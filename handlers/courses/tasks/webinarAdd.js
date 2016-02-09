'use strict';

const path = require('path');
const config = require('config');
const co = require('co');
const yargs = require('yargs');

const CourseGroup = require('../models/courseGroup');
const request = require('request-promise');

module.exports = function() {

  return function() {

    const argv = require('yargs')
      .usage('gulp courses:webinar:add --group js-1')
      .describe('group', 'Group slug')
      .demand(['group'])
      .argv;

    return co(function*() {
      var group = yield CourseGroup.findOne({slug: argv.group}).populate('course teacher');

      if (!group) {
        throw new Error("No group:" + argv.group);
      }

      if (group.webinarId) {
        throw new Error("Group already has webinarId!");
      }

      let auth = config.gotowebinar.auth[group.teacher.profileName];
      if (!auth) {
        throw new Error("No auth config for user:" + group.teacher.profileName);
      }

      let end = new Date(group.dateStart);
      end.setMinutes(end.getMinutes() + group.duration);

      let options = {
        url: `https://api.citrixonline.com/G2W/rest/organizers/${auth.organizerKey}/webinars`,
        json: true,
        headers: {
          'Authorization': auth.accessToken,
          'content-type': 'application/json; charset=utf-8'
        },
        body: {
          subject: group.title,
          times: [
            {
              startTime: group.dateStart.toJSON().replace('.000', ''),
              endTime: end.toJSON().replace('.000', '')
            }
          ],
          timeZone: "Europe/Moscow"
        }
      };

      let response = yield request.post(options);

      console.log(response);

      group.webinarKey = response.webinarKey;

      let webinars = yield request({
        url: `https://api.citrixonline.com/G2W/rest/organizers/${auth.organizerKey}/webinars/`,
        json: true,
        headers: {
          'Authorization': auth.accessToken
        }
      });

      let newWebinar = webinars.find(w => w.webinarKey == group.webinarKey);
      group.webinarId = newWebinar.webinarID;

      console.log("Done", newWebinar);
      yield group.persist();

    });

  };

};
