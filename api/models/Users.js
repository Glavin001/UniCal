/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

      firstName: {
          type: 'string',
      },

      lastName: {
          type: 'string'
      },

      username: {
          type: 'string',
          unique: true,
          required: true
      },

      password: {
          type: 'string'
      },

      /**
      Main Calendar, automatically updated and synced with Self-Service Banner
      */
      mainCalendar: {
          model: 'calendars'
      },

      /**
      All Calendars associated with this user.
      */
      calendars: {
          collection: 'calendars',
          via: "owner"
      }

  }
};
