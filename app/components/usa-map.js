import Ember from 'ember';
import d3 from 'npm:d3';
import topojson  from 'npm:topojson';
import _ from 'npm:lodash';
const { get, set, computed } = Ember;

export default Ember.Component.extend({
  tagName: 'svg',
  height: 500,
  attributeBindings: ['height', 'width'],
  rRange: [5, 13],
  projection: computed('height', 'width', function() {
    let width = get(this, 'width');
    let height = get(this, 'height');
    return d3.geo.albersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);
  }),
  highlightedClusters: computed('highlighted', function() {
   let array = _.chain(get(this, 'highlighted'))
      .map('cluster')
      .uniq()
      .value();
    return new Set(array);
  }),
  mapData: computed('data', function() {
    let data = get(this, 'data');
    let projection = get(this, 'projection');

    data = data.map((datum) => {
      let coords = get(datum, 'coords');
      set(datum, 'cluster', get(coords, 'cluster'));
      set(datum, 'coords', projection([coords.long, coords.lat]));
      return datum;
    });

    get(this, 'voronoi')(data)
      .forEach((d) => set(d, 'point.cell', d));

    return data;
  }),
  voronoi: computed('height', 'width', function() {
    let height = get(this, 'height');
    let width = get(this, 'width');
    return d3.geom.voronoi()
      .x((d) => get(d, 'coords')[0])
      .y((d) => get(d, 'coords')[1])
      .clipExtent([[0,0], [width, height]]);
  }),
  path: computed('projection', function() {
    let projection = get(this, 'projection');

    return d3.geo.path()
      .projection(projection);
  }),
  statePath: computed('map', function() {
    let map = get(this, 'map');
    let mesh = topojson.mesh(map, get(map, 'objects.states'), (a, b) => a !== b)
    let path = get(this, 'path');
    return path(mesh);
  }),
  countryPath: computed('map', function() {
    let map = get(this, 'map');
    let features = topojson.feature(map, get(map, 'objects.land'))
    let path = get(this, 'path');
    return path(features);
  }),
  yTotalExtent: computed('data', function() {
    let map = _.map(get(this, 'data'), 'total')
    return d3.extent(map);
  }),
  rScale: computed('yTotalExtent', function() {
    return d3.scale.linear()
      .range(get(this, 'rRange'))
      .domain(get(this, 'yTotalExtent'))
  }),
  mouseLeave() {
    set(this, 'cluster', null);
  }
});
