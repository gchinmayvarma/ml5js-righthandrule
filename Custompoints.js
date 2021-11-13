class Custompoint {
  constructor(x, y, z) {
    this.purex = this.x = x;
    this.purey = this.y = y;
    this.purez = this.z = z;
  }
  seekpos(x, y, z) {
    this.purex = x;
    this.purey = y;
    this.purez = z;
  }
  display() {
    // monapple.circle(this.x, this.y, 14);
    // monapple.push() ;
    // monapple.translate(this.x,this.y,this.z) ;
    // monapple.sphere(14) ;
    // monapple.pop() ;
    monapple.circle(this.x, this.y, 14);
  }
  work() {
    this.x = monapple.lerp(this.x, this.purex, Lerpspeed);
    this.y = monapple.lerp(this.y, this.purey, Lerpspeed);
    this.z = monapple.lerp(this.z, this.purez, Lerpspeed);
  }
}
let Lerpspeed = 0.7;
class Customhand {
  constructor(handpoints) {
    this.points = [];
    this.avgpoint = new Custompoint(0, 0, 0);
    let i = 0;
    for (; i < handpoints.landmarks.length; ++i) {
      this.addpoint(
        handpoints.landmarks[i][0]*newer/zoomscale,
        handpoints.landmarks[i][1]*newer/zoomscale,
        -handpoints.landmarks[i][2]*newer/zoomscale
      );
      this.avgpoint.x += this.points[i].x;
      this.avgpoint.y += this.points[i].y;
      this.avgpoint.z += this.points[i].z;
    }
    this.avgpoint.x /= i;
    this.avgpoint.y /= i; //handpoints.length;
    this.avgpoint.z /= i; //handpoints.length;

    this.thetax = 0;
    this.thetay = 0;
    this.ac = 0;
  }
  seekhands(handpoints) {
    let i = 0;
    for (; i < handpoints.landmarks.length; ++i) {
      this.points[i].seekpos(
        handpoints.landmarks[i][0]*newer/zoomscale,
        handpoints.landmarks[i][1]*newer/zoomscale,
        -handpoints.landmarks[i][2]*newer/zoomscale
      );
      this.avgpoint.x += this.points[i].x;
      this.avgpoint.y += this.points[i].y;
      this.avgpoint.z += this.points[i].z;
    }
    this.avgpoint.x /= i;
    this.avgpoint.y /= i;
    this.avgpoint.z /= i;
  }
  addpoint(x, y, z) {
    this.points.push(new Custompoint(x, y, z));
  }
  display_skeleton() {
    this.drawLines([0, 5, 9, 13, 17, 0]); //palm
    this.drawLines([0, 1, 2, 3, 4]); //thumb
    this.drawLines([5, 6, 7, 8]); //index finger
    this.drawLines([9, 10, 11, 12]); //middle finger
    this.drawLines([13, 14, 15, 16]); //ring finger
    this.drawLines([17, 18, 19, 20]); //pinky
  }
  drawLines(index) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = this.points[index[j]].x;
      let y = this.points[index[j]].y;
      let z = this.points[index[j]].z;

      let _x = this.points[index[j + 1]].x;
      let _y = this.points[index[j + 1]].y;
      let _z = this.points[index[j + 1]].z;
      monapple.line(x, y, _x, _y);
    }
  }
  display_field() {
    monapple.stroke(0, 0, 255, this.ac);
    monapple.strokeWeight(4);
    monapple.noFill();
    let a = this.points[5];
    let b = this.points[17];
    let x = (a.x + b.x) / 2;
    let y = (a.y + b.y) / 2;
    let len = monapple.dist(a.x, a.y, b.x, b.y) * 1.5;
    let theta = monapple.PI / 2 - monapple.atan((a.x - b.x) / (a.y - b.y));
    let d = 6.28 / 5;
    monapple.push();
    monapple.translate(x, y);
    monapple.rotate(theta - 3.14 / 2);
    monapple.strokeWeight(2);
    for (let len = 100; len < 400; len += 40) {
      monapple.stroke(0, 0, 255, this.ac);
      monapple.noFill();

      monapple.ellipse(0, 0, 2 * len * sin(theta), 2 * len * cos(theta));
      monapple.fill(0, 0, 255, this.ac);
      monapple.noStroke();
      for (let i = (animation_frame / 80 - len) % d; i < 6.28; i += d) {
        // monapple.push();
        monapple.circle(
          -len * sin(theta) * cos(i),
          -len * cos(theta) * sin(i),
          10
        );
        // monapple.pop();
      }
    }
    monapple.pop();
    monapple.textSize(40);
    monapple.text("B", x + 400, y);
  }
  display_fielda() {
    //   let c = this.points[9];
    //   let a = this.points[0];
    //   // let b =
    //   monapple.stroke(0, 0, 255);
    //   monapple.noFill();
    //   monapple.ellipse(c.x, c.y, 100, 100);
    // #3d arccos[(xa * xb + ya * yb + za * zb) / (√(xa2 + ya2 + za2) * √(xb2 + yb2 + zb2))]
    // #2d arccos[(xa * xb + ya * yb) / (√(xa2 + ya2) * √(xb2 + yb2))]
    // let theta = acos( (a.x *
    let a = this.points[5];
    let b = this.points[17];
    let len = 400;
    let theta = monapple.atan((a.x - b.x) / (a.y - b.y));

    let x1 = a.x + len * cos(theta);
    let y1 = a.y + len * sin(theta);
    let x2 = a.x - len * cos(theta);
    let y2 = a.y - len * sin(theta);
    monapple.ellipse(
      (x1 + x2) / 2,
      (y1 + y2) / 2,
      100 * cos(theta),
      sin(theta) * 100
    );
  }
  display_wire() {
    monapple.stroke(0, 255, 0, this.ac);
    monapple.strokeWeight(4);
    let a = this.points[5];
    let b = this.points[17];
    let x = (a.x + b.x) / 2;
    let y = (a.y + a.y) / 2;
    let len = monapple.dist(a.x, a.y, b.x, b.y) * 2;
    let theta = monapple.PI / 2 - monapple.atan((a.x - b.x) / (a.y - b.y));
    // let theta1 = monapple.PI / 2 - monapple.atan((a.z - b.z) / (a.x - b.x));
    monapple.line(
      x + len * cos(theta),
      y + len * sin(theta),
      x - len * cos(theta),
      y - len * sin(theta)
    );

    monapple.noStroke();
    monapple.fill(0, 255, 0, this.ac);
    monapple.textSize(30);
    monapple.text("I", x - 0.8 * len * cos(theta), y - 0.7 * len * sin(theta));
    for (let j = 0; j < 5; ++j) {
      let i = monapple.map((j + animation_frame / 10) % 5, 0, 5, 1, -1);
      if (a.y > b.y) i *= -1;
      monapple.push();
      monapple.translate(x + i * len * cos(theta), y + i * len * sin(theta));
      monapple.rotate(theta + 3.14 / 6);
      if (a.y > b.y) monapple.rotate(3.14);
      Triangle(monapple, 10);
      monapple.pop();
    }

    // monapple.line(a.x + (a.x - b.x), a.y - (a.y - b.y), b.x, b.y);
  }
  work() {
    for (let i = this.points.length - 1; i > -1; --i) {
      this.points[i].work();
    }
    if (show_markers) {
      monapple.stroke(255);
      monapple.strokeWeight(3);
      this.display_skeleton();
      // monapple.strokeWeight(2);
      for (let i = this.points.length - 1; i > -1; --i) {
        // monapple.stroke(255);
        monapple.fill(255, 0, 69);
        monapple.noStroke();
        this.points[i].display();
        monapple.fill(255);
        monapple.stroke(0, 0, 255);
        monapple.strokeWeight(1);
        monapple.textSize(16);
        monapple.text(i, this.points[i].x, this.points[i].y);
      }
    }
    if (
      monapple.dist(
        this.avgpoint.x,
        this.avgpoint.y,
        this.avgpoint.z,
        this.points[0].x,
        this.points[0].y,
        this.points[0].z
      ) <
      slider_curl.value() *
        monapple.dist(
          this.points[0].x,
          this.points[0].y,
          this.points[0].z,
          this.points[17].x,
          this.points[17].y,
          this.points[17].z
        )
    ) {
      // this.display_field()
      // monapple.fill(0, 255, 0);
      this.ac = monapple.lerp(this.ac, 255, 0.08);
    } else {
      this.ac = monapple.lerp(this.ac, 0, 0.1);
    }
    // monapple.fill(0, 0, 255);
    // this.avgpoint.display();
    // monapple.noFill();
    // monapple.stroke(55, 50, 255);
    this.display_wire();
    // monapple.stroke(255, 0, 10);
    // monapple.strokeWeight(4);
    this.display_field();
  }
}

function cos(theta) {
  return monapple.cos(theta);
}
function sin(theta) {
  return monapple.sin(theta);
}
function Triangle(g, a) {
  let b = 0.866 * a;
  g.triangle(0, -b, -a, b, a, b);
}
