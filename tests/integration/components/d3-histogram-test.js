import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('d3-histogram', 'Integration | Component | d3 histogram', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{d3-histogram}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#d3-histogram}}
      template block text
    {{/d3-histogram}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
