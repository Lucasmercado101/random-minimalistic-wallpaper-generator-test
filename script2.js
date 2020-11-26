const canvasDOM = document.getElementById("canvas");
const ctx = canvasDOM.getContext("2d");
let canvas = ctx.canvas;

let { width: cWidth, height: cHeight } = canvas;

let bgr = "#222831";
let palette = ["#e8e8e8", "#f05454", "#30475e"];
let chances = [100, 100, 100];

window.addEventListener("keypress", (ev) => {
  if (ev.key.toLowerCase() === "enter") {
    generate();
  }
});

function changeBGR() {
  bgr = "#" + document.getElementById("background-color").value;
}

function generate() {
  let colors = randexec(palette, chances);

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.fillStyle = bgr;
  ctx.fillRect(0, 0, canvas.width, canvas.height); // BGR

  let times = +document.getElementById("shapes-amount").value;
  for (let i = 0; i < times; i++) {
    drawRectangleRandomly(colors[~~(Math.random() * colors.length)]);
  }
}
generate();

function drawRectangleRandomly(color) {
  let ranHeight = getRandomSize(cWidth);
  let ranWidth = getRandomSize(cWidth);
  let ranY = Math.random() * cHeight - ranHeight / 2;
  let ranX = Math.random() * cWidth - ranWidth / 2;
  let ranRotation = ~~(Math.random() * 360);

  ctx.fillStyle = color;
  drawRotatedRect(ranX, ranY, ranHeight, ranWidth, ranRotation);
}

function getRandomSize(num) {
  return Math.max(num / 10, (Math.random() * num) / 2);
}

function drawRotatedRect(x, y, width, height, degrees) {
  // first save the untranslated/unrotated context
  ctx.save();

  ctx.beginPath();
  // move the rotation point to the center of the rect
  ctx.translate(x + width / 2, y + height / 2);
  // rotate the rect
  ctx.rotate((degrees * Math.PI) / 180);

  // draw the rect on the transformed context
  // Note: after transforming [0,0] is visually [x,y]
  //       so the rect needs to be offset accordingly when drawn
  ctx.fillRect(-width / 2, -height / 2, width, height);

  // restore the context to its untranslated/unrotated state
  ctx.restore();
}
// setInterval(() => generate(), 1000);

function toImage() {
  $("#the-image").attr("src", canvas.toDataURL());
  $("#clear-image").attr("disabled", false);
  $("#save-inst").css("display", "block");
}

function randexec(arr, chances) {
  // Based on https://stackoverflow.com/a/3983830

  let ar = chances.map((percentage) => percentage / 100.0);

  // Then we get a random number and finds where it sits inside the probabilities
  // defined earlier

  var r = Math.random(); // returns [0,1]

  let result = [];
  ar.forEach((el, i) => el >= r && result.push(palette[i]));
  return result;
}

$(function () {
  $("#shapes-amount").on("input", function () {
    if (+$(this).val() > 100) {
      $(this).val(100);
    }
  });

  $("#clear-image").click(function () {
    $(this).attr("disabled", true);
    $("#save-inst").css("display", "none");
    $("#the-image").attr("src", "");
  });

  // Colors
  $(".color-input").on("input", function () {
    let indexItem = $(this).attr("data-color");
    let colorValue = "#" + $(this).val();
    if (isHexColorValid(colorValue)) {
      $(`#color-demo-${indexItem}`).css("background-color", colorValue);
      palette[indexItem] = colorValue;
    }
  });

  $(".color-chance").on("input", function () {
    let indexItem = $(this).attr("data-color");
    let value = $(this).val();
    chances[indexItem] = value;
    $(`#color-chance-label-${indexItem} p`).text(value + "%");
  });

  $("#bg-color-input").on("input", function () {
    let value = $(this).val();
    let background = "#" + value;
    if (isHexColorValid(background)) {
      bgr = background;
      $("#color-demo-bg").css("background-color", bgr);
    }
  });
});

//TODO: change the resolution of the canvas, so different wallpaper resolution
// - display text below save button "the bigger the resolution the longer this takes" and "right click and save to image" until i find a way to save canvas to image format directly
// - different shapes like circles or something

/*
#e8e8e8
#f05454
#30475e
#222831
*/

function isHexColorValid(color) {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color);
}
