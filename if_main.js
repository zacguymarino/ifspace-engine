import { saveGame, loadGame, deleteNode, startGameSim } from "./if_generate.js";
import * as dom from "./if_dom.js";
import { nodeMap, resizeCanvas, zoom, draw } from "./if_nodemap.js";
import { gameInit, parseAction } from "./if_parser.js";

$(function () {
  ///////////////
  //Game Testing
  ///////////////
  $("#restartGameSim").click(function () {
    gameInit();
  });

  $("#inputActionSim").keypress(function (e) {
    if (e.which == 13) {
      // I've added a try catch to the below because without it the game is running the action but not clearing the input field value. :TODO cleared.
      try {
        parseAction($("#inputActionSim").val());
      } catch (error) {
        console.log(error);
      }
      $("#inputActionSim").val("");
      e.preventDefault();
    }
  });

  //////////////////////////////
  //Game loading/saving/deleting
  //////////////////////////////
  $("#saveGame").click(function () {
    saveGame();
  });

  $(document).on("click", "#loadGame", function (event) {
    loadGame(gameTitle);
  });

  $(document).on("click", "#deleteNode", function () {
    deleteNode();
  });

  /////////////////////
  //Node Map Controls
  /////////////////////
  $(document).on("click", ".zoom", function (event) {
    let baseId = $(event.currentTarget).attr("id");
    zoom(baseId);
  });

  $("#zIndex").on("change", function (event) {
    draw();
  });

  //////////////////////////
  //DOM and DOM Generation
  /////////////////////////
  nodeMap();

  $(document).on("click", "#testGame", function () {
    startGameSim();
    $("html, body").animate(
      {
        scrollTop: $("#gameSim").offset().top,
      },
      500
    );
  });

  $(window).on("resize", function (event) {
    resizeCanvas();
  });

  $(document).on("click", ".removeObject", function (event) {
    let baseId = $(event.currentTarget.parentElement).attr("id");
    dom.removeObject(baseId);
  });

  $(document).on("click", ".addEvoItems", function (event) {
    let baseId = $(event.currentTarget.parentElement).attr("id");
    let listId = `${baseId}_EvoList`;
    dom.addEvo(listId);
  });

  $(document).on("click", ".addEvoDes", function (event) {
    let listId = "evoListDescriptions";
    dom.addEvo(listId);
  });

  $(document).on("click", ".removeEvo", function (event) {
    let baseId = $(event.currentTarget.parentElement).attr("id");
    let listId = $(event.currentTarget.parentElement.parentElement).attr("id");
    dom.removeEvo(listId, baseId);
  });

  $(document).on("click", ".blockBtn", function (event) {
    let baseId = $(event.currentTarget).attr("id");
    dom.showHide(baseId);
  });

  $(document).on("click", "#directions", function (event) {
    let inputs = $(event.currentTarget).find("input");
    dom.directions(inputs);
  });

  $("#addItem").click(function () {
    dom.addItem();
  });

  $("#addContainer").click(function () {
    dom.addContainer();
  });

  $(".addAction").click(function () {
    dom.addAction();
  });

  $("#winBlock").append(dom.getRequirements("win"));
  $("#loseBlock").append(dom.getRequirements("lose"));
});
