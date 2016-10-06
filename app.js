import cytoscape from 'cytoscape';
import $ from 'jquery';
import _ from 'lodash';

const cy = cytoscape({
  container: document.getElementById('cy'), // container to render in

  // elements: [ // list of graph elements to start with
  //   { // node a
  //     data: { id: 'a' }
  //   },
  //   { // node b
  //     data: { id: 'b' }
  //   },
  //   { // edge ab
  //     data: { id: 'ab', source: 'a', target: 'b' }
  //   }
  // ],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }

});


// ---------------
// -- ADD TEST ---
// ---------------
const count = 100;  // Modify this number
const nodeRange = _.range(0, count - 1);
const linkRange = _.range(0, count - 2);

const nodesToAdd = _.map(nodeRange, val => {
	return {
		group: "nodes",
		data: {
			id: val,
			myLabel: val % 2 === 0 ? "Even" : "Odd",
			weight: val * 10
		}, 
		position: { x: 100 + (val * 35), y: 100 + (val * 35) }
	};
});

const edgesToAdd = _.map(linkRange, val => {
	return {
		group: "edges",
		data: {
			source: val,
			target: val + 1,
			myLabel: val % 2 === 0 ? "Even" : "Odd",
			weight: val * 10
		}
	};
});

// Time to add nodes and links
console.time('Add total');

console.time('Add nodes');
cy.add(nodesToAdd);
console.timeEnd('Add nodes');

console.time('Add edges');
cy.add(edgesToAdd);	
console.timeEnd('Add edges');

console.timeEnd('Add total');


// -------------------
// --- SELECT TEST ---
// -------------------

// Single look-up (performant)
console.time('Look up single node by ID');
const node6 = cy.getElementById(6);
console.timeEnd('Look up single node by ID');

// Look-up by string data prop
console.time('Look up nodes by string prop');
const evenNodes = cy.nodes("[myLabel='Even']");
console.timeEnd('Look up nodes by string prop');

// Look-up by value
console.time('Look up nodes by value prop');
const heavyEdges = cy.edges("[weight>100]");
console.timeEnd('Look up nodes by value prop');

// Destroy after 5 seconds -- should probably do on something like componentWillUnmount() in React
// setTimeout(_ => cy.destroy(), 5000);

// Set scratch pad data for temp data
// console.log('cy.scratch()', cy.scratch());
// console.log('set cy.scratch()', cy.scratch('test1', { some: 'val' }));
// console.log('get cy.scratch()', cy.scratch('test1'));

// --------------
// --- Events ---
// --------------
cy.on('click', 'node', { myBoundData: 123 }, clickCallback);

function clickCallback(evt) {
	console.log('evt', evt.data.myBoundData);
}

cy.promiseOn('click', 'edge').then(evt => console.log('click promise resolved', evt));

// ----------------
// -- Animations --
// ----------------
// cy.animate({
//   fit: {
//     eles: node6,
//     padding: 20
//   },
//   easing: 'ease-in-out-quad'
// }, {
//   duration: 800
// })
// .delay(500)
// .animate({
//   fit: {
//     eles: cy.getElementById(3),
//     padding: 20
//   },
//   easing: 'ease-out-sine'
// }, {
//   duration: 1000
// });

// ---------------
// --- Layouts ---
// ---------------
// http://js.cytoscape.org/#layouts

const layoutOptions = {
  name: 'concentric',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  height: undefined, // height of layout area (overrides container height)
  width: undefined, // width of layout area (overrides container width)
  concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
  	return node._private.data.myLabel === 'Even' ? 2 : 1;
  },
  levelWidth: function( nodes ){ // the variation of concentric values in each level
  	return nodes.maxDegree() / 4;
  },
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
};

// cy.layout(layoutOptions1);
cy.layout(layoutOptions);




