// Generated by CoffeeScript 2.5.1
var bgr, canvas, canvasDOM, chances, changeBGR, ctx, generate, isHexColorValid, palette, randexec, shape;

import {
  drawRectangleRandomly,
  drawCircleRandomly
} from "./shapes.js";

canvasDOM = document.getElementById("canvas");

ctx = canvasDOM.getContext("2d");

canvas = ctx.canvas;

shape = "rectangles";

bgr = "#222831";

palette = ["#e8e8e8", "#f05454", "#30475e"];

chances = [100, 100, 100];

changeBGR = function() {
  return bgr = "#" + document.getElementById("background-color").value;
};

randexec = function(chances) {
  var ar, r, result;
  ar = chances.map((percentage) => {
    return percentage / 100.0;
  });
  
  // Then we get a random number and finds where it sits inside the probabilities
  // defined earlier
  r = Math.random(); // returns [0,1]
  result = [];
  ar.forEach((el, i) => {
    return el >= r && result.push(palette[i]);
  });
  return result;
};

generate = function() {
  var colors, times;
  colors = randexec(chances);
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.fillStyle = bgr;
  ctx.fillRect(0, 0, canvas.width, canvas.height); // BGR
  times = +document.getElementById("shapes-amount").value;
  for (let i = 0; i < times; i++) {
    let color = colors[~~(Math.random() * colors.length)];
    switch (shape){
      case "rectangles":
        drawRectangleRandomly(color);
        break
      case "circles":
        drawCircleRandomly(color);
        break
      default:
        throw Error();
    }
        
  };
};

generate();

window.addEventListener("keypress", function(ev) {
  if (ev.key.toLowerCase() === "enter") {
    return generate();
  }
});

// setInterval(() => generate(), 1000) 
$(function() {
  $("#shapes-amount").on("input", function() {
    if (+$(this).val() > 100) {
      return $(this).val(100);
    }
  });
  $("#clear-image").click(function() {
    $(this).attr("disabled", true);
    $("#save-inst").css("display", "none");
    return $("#the-image").attr("src", "");
  });
  $('#shape-type').on('change', function() {
    return shape = $("#shape-type option:selected").text().toLowerCase();
  });
  $(".color-input").on("input", function() {
    var colorValue, indexItem;
    indexItem = $(this).attr("data-color");
    colorValue = "#" + $(this).val();
    if (isHexColorValid(colorValue)) {
      $(`#color-demo-${indexItem}`).css("background-color", colorValue);
      return palette[indexItem] = colorValue;
    }
  });
  $(".color-chance").on("input", function() {
    var indexItem, value;
    indexItem = $(this).attr("data-color");
    value = $(this).val();
    chances[indexItem] = value;
    return $(`#color-chance-label-${indexItem} p`).text(value + "%");
  });
  $("#bg-color-input").on("input", function() {
    var background, value;
    value = $(this).val();
    background = "#" + value;
    if (isHexColorValid(background)) {
      bgr = background;
      return $("#color-demo-bg").css("background-color", bgr);
    }
  });
  $("#to-image").click(function() {
    $("#the-image").attr("src", canvas.toDataURL());
    $("#clear-image").attr("disabled", false);
    return $("#save-inst").css("display", "block");
  });
  $("#generate-new").click(generate);
  $("#canvas-height").on("input", function() {
    return $("#canvas").attr("height", $(this).val());
  });
  return $("#canvas-width").on("input", function() {
    return $("#canvas").attr("width", $(this).val());
  });
});


// TODO: change the resolution of the canvas, so different wallpaper resolution
//  - display text below save button "the bigger the resolution the longer this takes" and "right click and save to image" until i find a way to save canvas to image format directly
//  - change the variation in size
//  - Fit the whole canvas without overflow
/*
#e8e8e8
#f05454
#30475e
#222831
 */
isHexColorValid = function(color) {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color);
};
