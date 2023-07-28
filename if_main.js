import { saveGame, loadGame, deleteNode, startGameSim } from "./if_generate.js";
import * as dom from "./if_dom.js";
import { nodeMap, resizeCanvas, zoom, draw } from "./if_nodemap.js";
import { gameInit, parseAction } from "./if_parser.js";

$(function () {
  ///////////////
  //Game Testing
  ///////////////
  $("#restartGameSim").click(function () {
    dom.addSimInput();
    gameInit();
    $("#classicStyleInput").focus();
  });

  $(document).on("keypress", "#classicStyleInput", function (event) {
    if (event.which == 13) {
      try {
        parseAction($("#classicStyleInput").val());
      } catch (error) {
        console.log(error);
      }
      $("#classicStyleInput").val("");
      event.preventDefault();
    }
  });

  $(document).on("click", ".modernActionButton", function (event) {
    parseAction($(event.currentTarget).attr("value"));
    event.preventDefault;
  });

  $(document).on("click", ".modernDirectionButton", function (event) {
    parseAction($(event.currentTarget).attr("value"));
    event.preventDefault;
  });

  $(document).on("click", ".gamebookDirectionButton", function (event) {
    parseAction($(event.currentTarget).attr("value"));
    event.preventDefault;
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

  /////////////////////////////////
  //Global Settings/Start Settings
  /////////////////////////////////
  $(document).on("click", "#globalActionsOpen", function () {
    $("#globalActionsDisplay").css("visibility", "visible");
  })

  $("#addGlobalAction").click(function () {
    dom.addGlobalAction();
  });

  ///////////////////////////////////
  //Help/Documentation/Game Settings
  ///////////////////////////////////
  $(document).on("click", "#helpOpen", function () {
    $("#helpDisplay").css("visibility","visible");
  });

  $(document).on("click", "#settingsOpen", function () {
    $("#settingsDisplay").css("visibility","visible");
  });

  $(document).on('click', '.popupClose', function(event) {
    if ($(event.currentTarget.parentElement).is(':visible')){
        $(event.currentTarget.parentElement).css("visibility", "hidden");
    }
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

  /////////////////////////
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
    let itemIndex = $(event.currentTarget.parentElement).index();
    let baseId = $(event.currentTarget.parentElement).attr("id");
    let listId = `${baseId}_EvoList`;
    dom.addEvo(listId, itemIndex);
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

  $("#addAction").click(function () {
    dom.addAction();
  });

  $("#winBlock").append(dom.getRequirements("win"));
  $("#loseBlock").append(dom.getRequirements("lose"));
});
