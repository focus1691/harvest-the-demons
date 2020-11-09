const getPoints = (json, key) => {
  const density = json[key].density;
  const restitution = json[key].restitution;
  const friction = json[key].friction;
  const points = [];
  const circles = [];
  for (var i = 0; i < json[key].fixtures.length; i++) {
    if (json[key].fixtures[i].circle) {
      circles.push({
        label: fixtures[i].label,
        isSensor: fixtures[i].isSensor,
        x: json[key].fixtures[i].circle.x,
        y: json[key].fixtures[i].circle.y,
        radius: json[key].fixtures[i].circle.radius,
      });
    } else {
      
      for (var j = 0; j < json[key].fixtures[i].vertices.length; j++) {
        for (var k = 0; k < json[key].fixtures[i].vertices[j].length; k++) {
          points.push([json[key].fixtures[i].vertices[j][k].x, json[key].fixtures[i].vertices[j][k].y]);
        }
      }
    }
  }
  return {
    points,
    circles,
    fixtureOptions: {
      density,
      restitution,
      friction,
    },
  };
};

module.exports = {
  getPoints,
};
