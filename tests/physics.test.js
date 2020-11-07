const skullJSON = require('../src/assets/PhysicsEditor/skull.json');
const ghostWarriorJSON = require('../src/assets/PhysicsEditor/ghost_warrior.json');
const { getPoints } = require('../utils/helper');

describe('physics JSON information', () => {
  it('should contain the appropriate fields', () => {
    expect(skullJSON).toHaveProperty('skull');
    expect(skullJSON.skull).toHaveProperty('fixtures');
  });

  it('should create a single array of x, y points representing the skull shape', () => {
    const expectedPoints = [
      [529.5, 70],
      [250, -0.5],
      [249, -0.5],
      [289, 1019.5],
      [427, 972.5],
      [629.5, 350],
      [39, 209.5],
      [7.5, 431],
      [289, 1019.5],
      [249, -0.5],
    ];

    const { points } = getPoints(skullJSON, 'skull');
    expect(points).toStrictEqual(expectedPoints);
  });



  it('should create circles and points for the ghost warrior shape', () => {
    const { expectedPoints, expectedCircles } = {
      expectedCircles: [
        { x: 128.26086956521746, y: 176.56521739130446, radius: 11.3876529162685 },
        { x: 138.77470355731222, y: 200.04347826086956, radius: 13.649404070685675 },
        { x: 150.00000000000009, y: 226.56521739130443, radius: 14.857098949447462 },
        { x: 112.60869565217394, y: 62.6521739130435, radius: 61.25709913499034 },
        { x: 82.60869565217388, y: 104.82608695652172, radius: 61.52672156512717 },
        { x: 87.39130434782611, y: 257.8695652173913, radius: 45.7929840095194 },
        { x: 64.34782608695649, y: 204.82608695652175, radius: 64.1354172173011 },
        { x: 88.26086956521733, y: 244.82608695652178, radius: 61.52672156512717 },
        { x: 68.26086956521736, y: 143.9565217391304, radius: 67.62625812275732 },
        { x: 104.34782608695653, y: 212.21739130434787, radius: 54.332171658481066 },
        { x: 113.04347826086962, y: 128.30434782608697, radius: 61.25709913499034 },
        { x: 112.60869565217394, y: 62.6521739130435, radius: 61.25709913499034 },
        { x: 112.60869565217394, y: 62.217391304347814, radius: 61.25709913499034 },
        { x: 113.04347826086962, y: 128.30434782608697, radius: 61.25709913499034 },
        { x: 113.04347826086962, y: 128.30434782608697, radius: 61.25709913499034 },
        { x: 113.04347826086962, y: 128.30434782608697, radius: 61.25709913499034 },
        { x: 113.04347826086962, y: 128.30434782608697, radius: 61.25709913499034 },
        { x: 113.04347826086962, y: 127.86956521739131, radius: 61.25709913499034 },
        { x: 62.173913043478336, y: 61.3478260869565, radius: 61.25709913499034 },
        { x: 122.17391304347834, y: 156.56521739130432, radius: 61.25709913499034 },
      ],
      expectedPoints: [
        [119, 185],
        [29, 187],
        [35, 249],
        [118, 186],
        [34, 250],
        [141, 246],
      ],
    };
    const { points, circles } = getPoints(ghostWarriorJSON, 'main_body');
    expect(points).toStrictEqual(expectedPoints);
    expect(circles).toStrictEqual(expectedCircles);
  })
});
