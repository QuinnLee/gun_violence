import Ember from 'ember';
import _ from 'npm:lodash';
import moment from 'npm:moment';

const { get, set, RSVP, $ } = Ember;

const DATA_URL = 'https://raw.githubusercontent.com/QuinnLee/gun_violence/master/data/data.json';
const LOCATION_URL = 'https://raw.githubusercontent.com/QuinnLee/gun_violence/master/data/location_clustered.json'
const USA_MAP = 'https://raw.githubusercontent.com/QuinnLee/gun_violence/master/data/us.json';

export default Ember.Route.extend({
  model() {
    const requests = {
      data: $.getJSON(DATA_URL),
      locationCoords: $.getJSON(LOCATION_URL),
      map:  $.getJSON(USA_MAP)
    };

    return RSVP.hash(requests).then((model) => {
      let { data, locationCoords, map } = model;

      data = _.map(data, (datum) => {
        let { date, article, location, dead, injured } = datum;
        let coords = get(locationCoords, location) || locationCoords[location]; //lawl st.louis...
        let cluster = get(coords, 'cluster');
        let total  = dead + injured;

        date = new Date(date);
        return {
          date,
          location,
          coords,
          dead,
          injured,
          total,
          cluster,
          article,
          moment: moment(date)
        };
      });

      return { data, map };
    });
  }
});
