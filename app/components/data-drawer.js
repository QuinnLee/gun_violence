import Ember from 'ember';
import d3 from 'npm:d3';
import _ from 'npm:lodash';
import moment from 'npm:moment';

const { get, computed } = Ember;

export default Ember.Component.extend({
  dateRange: computed('filteredData', 'data', function() {
    let data = get(this, 'filteredData') || get(this, 'data');
    return d3.extent(data, (d) => get(d, 'date'));
  }),
  displayDateRange: computed('dateRange', function() {
    let dateRange = get(this, 'dateRange');
    if(dateRange[0] === dateRange[1]) { return `<p> On <u>${moment(dateRange[1]).format('MMMM Do YYYY')}</u></p>`; }
    return `<p> From <u>${moment(dateRange[0]).format('MMMM Do YYYY')}</u> to <u>${moment(dateRange[1]).format('MMMM Do YYYY')}</u></p>`;
  }),
  displayCount: computed('filteredData', 'data',  function() {
    let data = get(this, 'filteredData') || get(this, 'data');
    let count = data.length;

    if(count === 1) {
      return '<p> there was <u>1</u> Mass shooting</p>';
    } else {
      return `<p> there were <u>${count}</u> Mass shootings</p>`;
    }
  }),
  deadCount: computed('filteredData', 'data',  function() {
    let data = get(this, 'filteredData') || get(this, 'data');
    let count = _.reduce(data, (memo, d) => memo + get(d, 'dead'), 0);
    if(count === 1) {
      return '<p> <u class="dead--copy">1</u> person died </p>';
    } else {
      return `<p> <u class="dead--copy">${count}</u> people </p>`;
    }
  }),
  injuredCount: computed('filteredData', 'data',  function() {
    let data = get(this, 'filteredData') || get(this, 'data');
    let count = _.reduce(data, (memo, d) => memo + get(d, 'injured'), 0);
    if(count === 1) {
      return '<p><u class="injured--copy">1</u> person got injured</p>';
    } else {
      return `<p><u class="injured--copy">${count}</u> people got injured</p>`;
    }
  })
});
