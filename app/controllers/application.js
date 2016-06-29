import Ember from 'ember';
import d3 from 'npm:d3';
import _ from 'npm:lodash';
import moment from 'npm:moment';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  width: 760,
  cluster: null,
  date: null,
  data: computed.alias('model.data'),
  map: computed.alias('model.map'),
  y: ['totalDead', 'totalInjured'],
  mapY: ['dead', 'injured'],
  x: 'date',
  filteredData: computed('cluster', 'date', 'data', function() {
    let cluster = get(this, 'cluster');
    let date = get(this, 'date');
    var data = get(this, 'data');

    if(!date && !cluster) { return null; }

    if(date) {
      date = moment(date);
      data = _.filter(data, (d) => get(d, 'moment').isSame(date,"week"));
    }
    if(cluster) {
      data = _.filter(data, (d) => get(d, 'cluster') === cluster);
    }
    return data;
  }),
  groupedByDate: computed('data', function() {
    let data = get(this, 'data');
    return _.chain(data)
    .groupBy('date')
    .map((values, key) => {
      let totalDead = _.sumBy(values, 'dead');
      let totalInjured = _.sumBy(values, 'injured');

      return { totalDead, totalInjured, values: values, date: new Date(key) };
    })
    .value();
  }),
  groupByLocation: computed('data', function() {
    let data = get(this, 'data');
    return  _.chain(data)
      .groupBy('cluster')
      .map((values) => {
        let firstValue = _.maxBy(values, 'total');
        let totalDead = _.sumBy(values, 'dead');
        let totalInjured = _.sumBy(values, 'injured');

        let total = totalDead + totalInjured;
        let pie = [{ type: 'dead', value: totalDead }, { type: 'injured', value: totalInjured}];

        return {
          totalDead,
          totalInjured,
          values: values,
          date: get(firstValue, 'date'),
          total,
          pie,
          location: get(firstValue, 'location'),
          coords: get(firstValue, 'coords'),
        };
      })
      .value()
  })
});
