import Ember from 'ember';
import d3 from 'npm:d3';
const { get, set, computed } = Ember;

export default Ember.Component.extend({
  tagName: 'g',
  classNameBindings: ['isHighlighted:highlighted-circle'],
  isHighlighted: computed('datum.cluster', 'highlightedClusters', function() {
    let cluster = get(this, 'datum.cluster');
    return get(this, 'highlightedClusters').has(cluster);
  }),
  transform: computed('datum.coords', function() {
    let coords = get(this, 'datum.coords');
    return `translate(${coords})`;
  }),
  r: computed('datum.total', 'rScale', function() {
    let scale = get(this, 'rScale');
    return scale(get(this, 'datum.total'));
  }),
  arc: computed('r', function() {
    return d3.svg.arc()
      .outerRadius(get(this, 'r'))
      .innerRadius(0);
  }),
  voronoiPath: computed('datum.cell', function() {
    let cell = get(this, 'datum.cell');
    if(cell) {
      return cell.length ? "M" + cell.join("L") + "Z" : null;
    } else {
      return null;
    }
  }),
  pie: computed('datum.pie', function() {
    let layout = d3.layout.pie()
      .sort(null)
      .value((d) => get(d, 'value'));
    let pie = layout(get(this, 'datum.pie'));
    let arc = get(this, 'arc');

    return pie.map((d) => {
      return { 'className': `pie ${get(d, 'data.type')}`, path: arc(d) };
    });
  }),
  mouseEnter() {
    let cluster = get(this, 'datum.cluster');
    set(this, 'cluster', cluster);
  }
});
