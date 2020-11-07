const getPoints = (json, key) => {
  const points = [];
  const circles = [];
  for (var i = 0; i < json[key].fixtures.length; i++) {
    if (json[key].fixtures[i].circle) {
      circles.push({
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
  };
};

module.exports = {
  getPoints,
};
