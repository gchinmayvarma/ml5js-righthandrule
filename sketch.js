let canvas;
let capture;
let ready = false;
let setting_size = true;
let a;
let godhands = [];
let detections = [];
let zoomscale = 3;
let video;
let slider_resolution;
let show_markers = true;
let animation_working = true;
let doms = [];
let animation_frame = 0;
let voal;
let readytoshow = false;
let imagesloaded = false;
let newer = 1 ; 
let mirrar = 1 ; 
function modelReady() {
  // console.log("Model ready!");
  readytoshow = true;
  let x = video.width;
  let y = video.height;
  newer = monapple.width / x;
  video.show();
  video.size(x * newer, y * newer);
  // monapple.resizeCanvas( video.width/zoomscale , video.height/zoomscale) ;
  // canvas.style("zoom" , zoomscale*100 + "%") ;
  handpose.on("predict", (results) => {
    detections = results;

    // console.log(detections);
  });
  // godhands.push(new Customhand(detections[0]));
}
let sketch = function (p) {
  p.preload = function () {
    // infoimg = monapple.loadImage("a.jpeg");
  };
  p.setup = function () {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    // canvas.id("canvas");
    canvas.position(0, 0);
    p.pixelDensity(1);
    p.frameRate(120);
    p.textAlign( p.CENTER , p.CENTER ) ; 
    // capture = p.createCapture({
    //   video: {
    //     onFrame: async () => {
    //       await hands.send({ image: capture.elt });
    //     },
    //     // width: { ideal: screen.width },
    //     height: { ideal: screen.height },
    //     facingMode: "environment",
    //   },
    //   audio: false,
    // });
    // capture.hide();
    // canvas.position(
    //   video.getBoundingClientRect().left,
    //   video.getBoundingClientRect().top
    // );
    
    video = p.createCapture(p.VIDEO); // new p5.Element(video);
    // video.hide();
    // p.resizeCanvas( video.width , video.height)  ;
    video.position(0, 0);
    // video.style("height" , "100%") ;
    // video.id("video") ;
    video.hide();
    const options = {
      flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
      maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
      detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
      scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
      iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
    };
    // voal = p.createCapture(p.VIDEO) ;
    handpose = ml5.handpose(video, options, modelReady);

    slider_resolution = p.createSlider(1, 4, 3, 0.01);
    slider_resolution.style("width", "300px");
    // slider_resolution.style('appearance', "none") ;
    // slider_resolution.style("background-color", p.color(255,0,69,50));

    slider_resolution.toxt = p.createDiv("Render Scale :");
    slider_resolution.toxt.style("color", p.color(255));
    slider_resolution.toxt.style("font-size", "20px");

    slider_curl = p.createSlider(0.5, 2, 2, 0.01);
    slider_curl.style("width", "300px");
    slider_curl.toxt = p.createDiv("Thrushold :");
    slider_curl.toxt.style("color", p.color(255));
    slider_curl.toxt.style("font-size", "20px");

    button_mirror = p.createButton("Mirror");
    button_mirror.size(200, 60);
    button_mirror.style("font-size", "24px");
    button_mirror.style("background-color", p.color(0, 162, 255));
    button_mirror.style("color", p.color(255));
    button_mirror.style("border-color", p.color(0, 162, 255));
    button_mirror.style("border-radius", "15px");

    button_mirror.mousePressed(() => {
      mirrar *= -1 ;
      video.style("transform", "scaleX(" + mirrar + ")");
      canvas.style("transform", "scaleX(" + mirrar + ")");
    });

    button_togglemark = p.createButton("Toggle Markers");
    button_togglemark.size(200, 60);
    button_togglemark.style("font-size", "24px");
    button_togglemark.style("background-color", p.color(255, 0, 69));
    button_togglemark.style("color", p.color(255));
    button_togglemark.style("border-color", p.color(255, 0, 69));
    button_togglemark.style("border-radius", "15px");

    button_togglemark.mousePressed(() => {
      show_markers = !show_markers;
      button_togglemark.toxt.html(show_markers ? "ON" : "OFF");
    });
    button_togglemark.toxt = p.createDiv(show_markers ? "ON" : "OFF");
    button_togglemark.toxt.style("color", p.color(255));
    button_togglemark.toxt.style("font-size", "20px");

    button_toggleanimation = p.createButton("Toggle Animations");
    button_toggleanimation.size(250, 60);
    button_toggleanimation.style("font-size", "24px");
    button_toggleanimation.style("background-color", p.color(255, 0, 69));
    button_toggleanimation.style("color", p.color(255));
    button_toggleanimation.style("border-color", p.color(255, 0, 69));
    button_toggleanimation.style("border-radius", "15px");

    button_toggleanimation.mousePressed(() => {
      animation_working = !animation_working;
      button_toggleanimation.toxt.html(animation_working ? "ON" : "OFF");
    });
    button_toggleanimation.toxt = p.createDiv(show_markers ? "ON" : "OFF");
    button_toggleanimation.toxt.style("color", p.color(255));
    button_toggleanimation.toxt.style("font-size", "20px");

    info = p.createDiv("MAXWELL's <br>RIGHT HAND THUMB RULE");
    info.style("color", p.color(230, 230, 255));
    info.style("font-size", "50px");
    infotext = p.createDiv(
      "An interactive Demonstration for how the flow of current is related to the magnetic field formed. <br>Show your hands on the camera and curl your fingers to view how the rule works!    <br>Be in a well lit environment and enable marker display to check if hands are being detected properly, and adjust the curl detection threshold to your liking. <br><br>The Maxwell's right hand thumb rule states that 'When the conductor is held in your right hand, such that the direction of the thumb points the direction of the current and the curled finger gives the direction of the magnetic finger. ' "
    );
    infotext.style("color", p.color(220, 220, 220));
    infotext.style("font-size", "27px");
    infoimg = monapple.createImg("a.jpeg");
    infoimg.size(infoimg.width * 1.5, infoimg.height * 1.5);
    infoimg2 = monapple.createImg("b.jpg");
    infoimg2.size(infoimg2.width * 0.75, infoimg2.height * 0.75);
    doms = [
      info,
      button_toggleanimation,
      button_togglemark,
      slider_curl,
      slider_curl.toxt,
      slider_resolution,
      slider_resolution.toxt,
    ];
    // for( let i = doms.length -1 ; i > -1 ; --i ) doms[i].hide() ;
      p.background(20, 22, 28);
  };
  p.draw = function () {
    if (!readytoshow) {
      p.background(20, 22, 28,69);
      p.textSize(20);
      p.noStroke();
      p.fill(255);
      for (let i = 0; i < 6.28; i += 3.14 / 4) {
        p.circle(
          Math.cos(i + p.frameCount / 20) * 100 + p.width / 2,
          Math.sin(i + p.frameCount / 14) * 100 + p.height / 2,
          10
        );
      }
      p.text("Loading Neural Network", p.width / 2, p.height / 2);
      return;
    }
    if (animation_working) animation_frame += 1;
    // video.position(p.mouseX,p.mouseY ) ;
    // if (video.videoWidth !== p.width)
    // p.resizeCanvas(video.videoWidth, video.videoHeight);
    if (zoomscale !== slider_resolution.value() || video.videoWidth !== 0) {
      zoomscale = slider_resolution.value();
      // video.size(1000, p.windowHeight ) ;

      let yscale = 1.2; //(p.windowHeight - 360)/ video.videoHeight ;
      // video.style("transform", `scale(1,${yscale}`);
      // clip-path: inset-rectangle(from top, from right, from bottom, from left, rounded-x, rounded-y)

      // video.style("clip-path" , "polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)") ;
      // video.position(-400,0)
      let x = p.windowWidth / video.width;
      p.resizeCanvas(
        p.windowWidth / zoomscale,
        (yscale * video.height * x) / zoomscale
      );

      canvas.style("zoom", zoomscale * 100 + "%");
      dom_stuff();
    }
    // video.size(p.mouseX , p.mouseY ) ;
    // p.image(capture, 0, 0, p.width, p.height);
    // p.translate(-p.width / 2, -p.height / 2);
    p.clear();
    // p.image(video, 0, 0, p.width, p.height);
    p.noStroke();
    p.fill(255, 0, 69);
    p.textSize(20);
    // p.text("Hello", p.mouseX, p.mouseY);
    // p.text(zoomscale, 10, 100);
    // if (detections != undefined) {
    //       if (detections.multiHandLandmarks != undefined) {
    //         if (detections.multiHandLandmarks.length < godhands.length)
    //           godhands = [];

    //         for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    //           if (!godhands[i])
    //             godhands.push(new Customhand(detections.multiHandLandmarks[i]));
    //           else godhands[i].seekhands(detections.multiHandLandmarks[i]);
    //         }
    //       }
    // }
    // if (detections.length > 0) {
    //   if (!godhands[0])
    //     godhands.push(new Customhand(detections[0]));
    //   else godhands[0].seekhands(detections[0]);
    // } else godhands = [];
    if (godhands.length > 0)
      if (detections.length > 0) godhands[0].seekhands(detections[0]);
      else {
      }
    else if (detections.length > 0)
      godhands.push(new Customhand(detections[0]));
    for (let i = godhands.length - 1; i > -1; --i) {
      godhands[i].work();
    }
    if (show_markers) {
      p.textAlign(p.BOTTOM, p.RIGHT);
      // p.text("Marker Display ON", 0 , p.height - 5);
    }
  };
};
p5.disableFriendlyErrors = true;
let monapple = new p5(sketch);

function dom_stuff() {
  // if (!readytoshow) return;
  slider_resolution.position(
    canvas.position().x + 150,
    canvas.position().y + canvas.height * zoomscale + 20
  );
  slider_resolution.toxt.position(
    canvas.position().x,
    canvas.position().y + canvas.height * zoomscale + 18
  );
  slider_curl.position(
    canvas.position().x + 117,
    canvas.position().y + canvas.height * zoomscale + 70
  );
  slider_curl.toxt.position(
    canvas.position().x,
    canvas.position().y + canvas.height * zoomscale + 68
  );
  button_mirror.position(
    canvas.position().x + monapple.windowWidth - 230 ,
    canvas.position().y + canvas.height * zoomscale 
  );
  button_togglemark.position(
    canvas.position().x,
    canvas.position().y + 80 + canvas.height * zoomscale + 30
  );
  button_togglemark.toxt.position(
    canvas.position().x + 210,
    canvas.position().y + 100 + canvas.height * zoomscale + 30
  );
  button_toggleanimation.position(
    canvas.position().x,
    canvas.position().y + 160 + canvas.height * zoomscale + 30
  );
  button_toggleanimation.toxt.position(
    canvas.position().x + 260,
    canvas.position().y + 180 + canvas.height * zoomscale + 30
  );
  info.position(
    canvas.position().x + 10,
    canvas.position().y + canvas.height * zoomscale + 280
  );
  infotext.position(
    canvas.position().x + 10,
    canvas.position().y + canvas.height * zoomscale + 420
  );
  infoimg.position(
    canvas.position().x - infoimg.width / 2 + (canvas.width * zoomscale) / 2,
    canvas.position().y + canvas.height * zoomscale + 900
  );
  infoimg2.position(
    canvas.position().x - infoimg2.width / 2 + (canvas.width * zoomscale) / 2,
    canvas.position().y + canvas.height * zoomscale + infoimg2.height - 290
  );
}
