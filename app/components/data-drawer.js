import Ember from 'ember';
import d3 from 'npm:d3';
import _ from 'npm:lodash';

const { get, computed } = Ember;

export default Ember.Component.extend({
  dateRange: computed('filteredData', 'data', function() {
    let data = get(this, 'filteredData') || get(this, 'data');
    return d3.extent(data, (d) => get(d, 'date'));
  }),
  displayDateRange: computed('dateRange', function() {
    let dateRange = get(this, 'dateRange');
    if(dateRange[0] === dateRange[1]) { return `On ${moment(dateRange[1]).format('MMMM Do YYYY')}`; }
    return `From ${moment(dateRange[0]).format('MMMM Do YYYY')} to ${moment(dateRange[1]).format('MMMM Do YYYY')}`;
  }),
  displayCount: computed('filteredData', 'data',  function() {
    let data = get(this, 'filteredData') || get(this, 'data');
    let count = data.length;

    if(count === 1) {
      return 'was 1 Mass shooting';
    } else {
      return `were ${count} Mass shootings`;
    }
  }),
  deadCount: computed('filteredData', 'data',  function() {
    let data = get(this, 'filteredData') || get(this, 'data');
    let count = _.reduce(data, (memo, d) => memo + get(d, 'dead'), 0)
    if(count === 1) {
      return '1 person ';
    } else {
      return `${count} people`;
    }
  }),
  injuredCount: computed('filteredData', 'data',  function() {
    let data = get(this, 'filteredData') || get(this, 'data');
    let count = _.reduce(data, (memo, d) => memo + get(d, 'injured'), 0)
    if(count === 1) {
      return '1 person ';
    } else {
      return `${count} people`;
    }
  })
});
