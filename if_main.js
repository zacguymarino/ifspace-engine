import { saveGame, loadGame, deleteNode, startGameSim, saveGlobalActions, saveInitItems, saveMonitors, saveGlobalWin, saveGlobalLose } from "./if_generate.js";
import * as dom from "./if_dom.js";
import { nodeMap, resizeCanvas, zoom, draw } from "./if_nodemap.js";
import { gameInit, parseAction, previousInput } from "./if_parser.js";

$(function () {
  ///////////////
  //Game Testing
  ///////////////
  $("#restartGameSim").click(function () {
    dom.addSimInput();
    gameInit();
    $("#classicStyleInput").focus();
  });

  $(document).on("keydown", "#classicStyleInput", function (event) {
    if (event.which == 13) {
      try {
        parseAction($("#classicStyleInput").val());
      } catch (error) {
        console.log(error);
      }
      $("#classicStyleInput").val("");
      event.preventDefault();
    }
    if (event.which == 38) {
      $("#classicStyleInput").val(previousInput);
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
    dom.handleGlobalCheckboxes("actions");
  })

  $(document).on("click", "#initItemsOpen", function () {
    $("#initItemsDisplay").css("visibility", "visible");
    dom.handleGlobalCheckboxes("items");
  })

  $(document).on("click", "#monitorsOpen", function () {
    $("#monitorsDisplay").css("visibility", "visible");
    dom.handleGlobalCheckboxes("monitors");
  })

  $(document).on("click", "#conDepOpen", function () {
    $("#conDepDisplay").css("visibility", "visible");
  })

  $(document).on("click", "#conWitOpen", function () {
    $("#conWitDisplay").css("visibility", "visible");
  })

  $(document).on("click", "#takesOpen", function () {
    $("#takesDisplay").css("visibility", "visible");
  })

  $(document).on("click", "#dropsOpen", function () {
    $("#dropsDisplay").css("visibility", "visible");
  })

  $(document).on("click", "#ignorablesOpen", function () {
    $("#ignorablesDisplay").css("visibility", "visible");
  })

  $(document).on("click", "#looksOpen", function () {
    $("#looksDisplay").css("visibility", "visible");
  })

  $(document).on("click", "#examinesOpen", function () {
    $("#examinesDisplay").css("visibility", "visible");
  })

  $(document).on("click", "#winOpen", function () {
    $("#globalWinDisplay").css("visibility", "visible");
    dom.handleGlobalCheckboxes("win");
  })

  $(document).on("click", "#loseOpen", function () {
    $("#globalLoseDisplay").css("visibility", "visible");
    dom.handleGlobalCheckboxes("lose");
  })

  $("#addGlobalAction").click(function () {
    dom.addGlobalAction();
  });

  $("#addInitItem").click(function () {
    dom.addInitItem();
  });

  $(document).on("click", ".addInitEvoItems", function (event) {
    let itemIndex = $(event.currentTarget.parentElement).index() + 1;
    let baseId = $(event.currentTarget.parentElement).attr("id");
    let listId = `${baseId}_EvoList`;
    dom.addInitEvo(listId, itemIndex);
  });

  $("#addMonitor").click(function () {
    dom.addMonitor();
  });

  $("#addGlobalWin").click(function () {
    dom.addGlobalWin();
  });

  $("#addGlobalLose").click(function () {
    dom.addGlobalLose();
  });

  dom.loadDefaultCommands();

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
    let hideCheckboxes = ["initItemsDisplay", "globalActionsDisplay", "monitorsDisplay", "globalWinDisplay", "globalLoseDisplay"];
    let parent = event.currentTarget.parentElement;
    if ($(parent).is(':visible')){
      if (hideCheckboxes.includes(parent.id)) {
        $(parent).find(".notBox").css("visibility", "hidden");
        saveGlobalActions();
        saveInitItems();
        saveMonitors();
        saveGlobalWin();
        saveGlobalLose();
      }
      $(parent).css("visibility", "hidden");
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

  $(document).on("click", ".addEvoInvalid", function (event) {
    let listId = "evoListInvalids";
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

  $(document).on("click", ".toggleNots", function (event) {
    let eventId = event.currentTarget.id;
    let baseId = eventId.slice(0, eventId.lastIndexOf('_'));
    let status;
    if ($(`#${eventId}`).is(":checked")) {
      status = true;
    } else {
      status = false;
    }
    dom.showHideNotBoxes(baseId, status);
  });

  $(document).on("change", "#gameStyle", function(event) {
    dom.changeStyle(event.currentTarget.value);
  })

  $(document).on("click", ".showHideReqs", function(event) {
    if ($(event.currentTarget).text() == String.fromCharCode(9660)) {
      $(event.currentTarget).html(String.fromCharCode(9650));
      $(event.currentTarget).closest(".requirements").find(".thisBlock").css("display", "block");
    } else if ($(event.currentTarget).text() == String.fromCharCode(9650)) {
      $(event.currentTarget).html(String.fromCharCode(9660));
      $(event.currentTarget).closest(".requirements").find(".thisBlock").css("display", "none");
    }
  });
});
