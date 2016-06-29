import Ember from 'ember';
import d3 from 'npm:d3';
import _ from 'npm:lodash';

const { computed, get, set } = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  height: 200,
  ticks: 48,
  attributeBindings: ['height', 'width'],
  margin: 30,
  rectHeight: computed('height', 'margin', function() {
    let margin = get(this, 'margin');
    let height = get(this, 'height');
    return height - margin ;
  }),
  rectWidth: computed('width', 'margin', function() {
    let margin = get(this, 'margin');
    let width = get(this, 'width');
    return width - margin ;
  }),
  gTransform: computed('margin', function() {
    let margin = get(this, 'margin');
    return `translate(${margin},${margin})`;
  }),
  xAxisTransform: computed('margin', 'height', function() {
    let margin = get(this, 'margin');
    let height = get(this, 'height');
    return `translate(0,${height - margin * 2})`;
  }),
  xExtent: computed('data', 'x', function() {
    return d3.extent(get(this, 'data'), (d) => get(d, get(this, 'x')));
  }),
  yExtent: computed('data', 'y', function() {
    let extents = _.flatMapDeep(get(this, 'y'), (y) => {
      return d3.extent(get(this, 'data'), (d) => get(d, y));
    });
    return d3.extent(extents);
  }),
  xScale: computed('xExtent','width', function() {
    let margin = get(this, 'margin');
    return d3.time.scale()
      .domain(get(this, 'xExtent'))
      .range([0, get(this, 'width') - 2 * margin])
      .clamp(true);
  }),
  yScale: computed('yExtent', 'height', function() {
    let margin = get(this, 'margin');
    return d3.scale.linear()
      .domain(get(this, 'yExtent'))
      .range([get(this, 'height') - 2 * margin, 0])
      .clamp(true);
  }),
  xAxis: computed('xScale', function() {
    let xScale = get(this, 'xScale');
    return d3.svg.axis()
      .scale(xScale)
      .orient("bottom");
  }),
  yAxis: computed('yScale', function() {
    let yScale = get(this, 'yScale');
    return d3.svg.axis()
      .ticks(3)
      .scale(yScale)
      .orient("left");
  }),
  selectedDate: computed('date', 'data', function() {
    let date = get(this, 'date');
    let data = get(this, 'data');

    let bisector = d3.bisector((d) => get(d, 'date')).left
    let i = bisector(data, date, 1);
    let d0 = data[i - 1]
    let d1 = data[i]
    return date - get(d0, 'date') > get(d1, 'date') - date ? d1 : d0;
  }),
  hoverCircles: computed('selectedDate', 'yScale', 'xScale', 'y',  function() {
    let y = get(this, 'y');
    let d = get(this, 'selectedDate');
    let yScale = get(this, 'yScale');
    let xScale = get(this, 'xScale');

    if(!d) { return null };
    return _.flatMapDeep(y, (yValue) => {
      let x =  xScale(get(d, 'date'));
      let y =  yScale(get(d, yValue));

      return { className: yValue, translate: `translate(${x},${y})` };
    });
  }),
  highlightedData: computed('highlighted', 'xScale','height', 'margin', function() {
    let highlighted = get(this, 'highlighted');
    let xScale = get(this, 'xScale');
    let margin = get(this, 'margin');
    let height = get(this, 'height');

    if(!highlighted) { return null };
    return _.map(highlighted, (d) => {
      let x =  xScale(get(d, 'date'));
      return { x1: x, x2: x, y1: 0, y2: height - margin *2, className: 'selected' }
    });
  }),
  lines: computed('yScale', 'xScale', 'x', 'y', 'data', function() {
    let yScale = get(this, 'yScale');
    let xScale = get(this, 'xScale');
    let x = get(this, 'x');
    let y = get(this, 'y');
    let data = get(this, 'data');

    return _.flatMapDeep(y, (yValue) => {
      let line = d3.svg.line()
        .x((d) => xScale(get(d, x)))
        .y((d) => yScale(get(d, yValue)));

      return { className: yValue, path: line(data) };
    });
  }),
  mouseOut() {
    set(this, 'date', null);
  },
  didInsertElement() {
    this._super(...arguments);
    d3.select('g.axis--x')
      .call(get(this, 'xAxis'));

    d3.select('g.axis--y')
      .call(get(this, 'yAxis'))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

    let xScale = get(this, 'xScale')
    let emberComponent = this;
    d3.select('rect.d3-line--rect')
      .on('mousemove', function() {
        let date = new Date(xScale.invert(d3.mouse(this)[0]));
        emberComponent.set('date', date);
      })
      .on('mouseout', function() {
        emberComponent.set('date', null);
      });
  },
});
