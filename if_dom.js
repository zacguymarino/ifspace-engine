import { currentNode } from "./if_nodemap.js";
import { gameStyle, globalActions } from "./if_generate.js";

function loadDomGlobalActions() {
  let actions = globalActions;
  for (let i = 0; i < actions.length; i++) {
    addGlobalAction();
    let baseId = `global_action_${i + 1}`;
    $(`#${baseId}_Actions`).val(actions[i].actions);
    $(`#${baseId}_Max`).val(actions[i].max);
    $(`#${baseId}_Costs`).val(actions[i].costs);
    $(`#${baseId}_Drops`).val(actions[i].drops);
    $(`#${baseId}_Visibility`).val(actions[i].visibility);
    $(`#${baseId}_Response`).val(actions[i].response);
    $(`#${baseId}_Fail`).val(actions[i].fail);
    $(`#${baseId}_Points`).val(actions[i].points);
    $(`#${baseId}_Items`).val(actions[i].reqItems);
    $(`#${baseId}_Containers`).val(actions[i].reqContainers);
    $(`#${baseId}_Local`).val(actions[i].reqLocal);
    $(`#${baseId}_Global`).val(actions[i].reqGlobal);
    $(`#${baseId}_preAction`).val(actions[i].preAction);
    $(`#${baseId}_Visits`).val(actions[i].locVisits);
    $(`#${baseId}_preNode`).val(actions[i].preNode);
    $(`#${baseId}_Evos`).val(actions[i].itemEvos);
  }
}

function loadDomFromNode(node) {
  let name = node.name;
  let location = node.location;
  let visibility = node.visibility;
  let points = node.points;
  let nodeDirections = node.directions;
  let descriptions = node.description;
  let items = node.items;
  let containers = node.containers;
  let actions = node.actions;
  let win = node.win;
  let lose = node.lose;
  let hint = node.hint;

  //clear current dynamic dom elements
  let dirInputs = $("#directions").find("input");
  for (let input of dirInputs) {
    $(input).prop("checked", false);
  }
  $("#editDirections").empty();
  $("#evoListDescriptions").empty();
  $("#itemList").empty();
  $("#containerList").empty();
  $("#actionList").empty();
  $("#globalActionsList").empty();

  //add node elements
  $("#location").html(location.toString());

  $("#name").val(name);

  if (visibility === "true") {
    $("#visibility").prop("checked", true);
  } else {
    $("#visibility").prop("checked", false);
  }

  $("#points").val(points);

  for (let i = 0; i < nodeDirections.length; i++) {
    let checkbox = nodeDirections[i].direction;
    $(`#${checkbox}`).prop("checked", true);
  }
  directions(dirInputs);
  for (let i = 0; i < nodeDirections.length; i++) {
    let checkbox = nodeDirections[i].direction;
    $(`#${checkbox}_Location`).val(nodeDirections[i].location);
    $(`#${checkbox}_Alternatives`).val(nodeDirections[i].alternatives);
    if (nodeDirections[i].exclude === "true") {
      $(`#${checkbox}_Exclude`).prop("checked", true);
    } else {
      $(`#${checkbox}_Exclude`).prop("checked", false);
    }
    $(`#${checkbox}_Items`).val(nodeDirections[i].reqItems);
    $(`#${checkbox}_Containers`).val(nodeDirections[i].reqContainers);
    $(`#${checkbox}_Local`).val(nodeDirections[i].reqLocal);
    $(`#${checkbox}_Global`).val(nodeDirections[i].reqGlobal);
    $(`#${checkbox}_preAction`).val(nodeDirections[i].preAction);
    $(`#${checkbox}_Visits`).val(nodeDirections[i].locVisits);
    $(`#${checkbox}_preNode`).val(nodeDirections[i].preNode);
    $(`#${checkbox}_Evos`).val(nodeDirections[i].itemEvos);
  }

  $("#defaultDes").val(descriptions.defaultDes);
  $("#basicDes").val(descriptions.basicDes);
  if ("evos" in descriptions) {
    for (let i = 0; i < descriptions.evos.length; i++) {
      addEvo("evoListDescriptions", null);
      let baseId = `evoDes_${i + 1}`;
      $(`#${baseId}_Items`).val(descriptions.evos[i].reqItems);
      $(`#${baseId}_Containers`).val(descriptions.evos[i].reqContainers);
      $(`#${baseId}_Local`).val(descriptions.evos[i].reqLocal);
      $(`#${baseId}_Global`).val(descriptions.evos[i].reqGlobal);
      $(`#${baseId}_preAction`).val(descriptions.evos[i].preAction);
      $(`#${baseId}_Visits`).val(descriptions.evos[i].locVisits);
      $(`#${baseId}_preNode`).val(descriptions.evos[i].preNode);
      $(`#${baseId}_Evos`).val(descriptions.evos[i].itemEvos);
      $(`#${baseId}_Des`).val(descriptions.evos[i].evoDes);
    }
  }

  for (let i = 0; i < items.length; i++) {
    addItem();
    let baseId = `item_${i + 1}`;
    $(`#${baseId}_Name`).val(items[i].name);
    $(`#${baseId}_Des`).val(items[i].description);
    $(`#${baseId}_Points`).val(items[i].points);
    $(`#${baseId}_Items`).val(items[i].reqItems);
    $(`#${baseId}_Containers`).val(items[i].reqContainers);
    $(`#${baseId}_Local`).val(items[i].reqLocal);
    $(`#${baseId}_Global`).val(items[i].reqGlobal);
    $(`#${baseId}_preAction`).val(items[i].preAction);
    $(`#${baseId}_Visits`).val(items[i].locVisits);
    $(`#${baseId}_preNode`).val(items[i].preNode);
    $(`#${baseId}_EvoList`).val(items[i].itemEvos);
    for (let j = 0; j < items[i].evos.length; j++) {
      addEvo(`${baseId}_EvoList`, i+1);
      let baseEvoId = `evoItems_${i + 1}_${j + 1}`;
      $(`#${baseEvoId}_Items`).val(items[i].evos[j].reqItems);
      $(`#${baseEvoId}_Containers`).val(items[i].evos[j].reqContainers);
      $(`#${baseEvoId}_Local`).val(items[i].evos[j].reqLocal);
      $(`#${baseEvoId}_Global`).val(items[i].evos[j].reqGlobal);
      $(`#${baseEvoId}_preAction`).val(items[i].evos[j].preAction);
      $(`#${baseEvoId}_Visits`).val(items[i].evos[j].locVisits);
      $(`#${baseEvoId}_preNode`).val(items[i].evos[j].preNode);
      $(`#${baseEvoId}_Evos`).val(items[i].evos[j].itemEvos);
      $(`#${baseEvoId}_Des`).val(items[i].evos[j].evoDes);
    }
  }

  for (let i = 0; i < containers.length; i++) {
    addContainer();
    let baseId = `container_${i + 1}`;
    $(`#${baseId}_Name`).val(containers[i].name);
    $(`#${baseId}_Capacity`).val(containers[i].capacity);
    $(`#${baseId}_Illegal`).val(containers[i].illegal);
    $(`#${baseId}_Complete`).val(containers[i].complete);
    $(`#${baseId}_Points`).val(containers[i].points);
    $(`#${baseId}_Items`).val(containers[i].reqItems);
    $(`#${baseId}_Containers`).val(containers[i].reqContainers);
    $(`#${baseId}_Local`).val(containers[i].reqLocal);
    $(`#${baseId}_Global`).val(containers[i].reqGlobal);
    $(`#${baseId}_preAction`).val(containers[i].preAction);
    $(`#${baseId}_Visits`).val(containers[i].locVisits);
    $(`#${baseId}_preNode`).val(containers[i].preNode);
    $(`#${baseId}_Evos`).val(containers[i].itemEvos);
  }

  $("#invalidAction").val(actions.invalid);
  if ("actions" in actions) {
    for (let i = 0; i < actions.actions.length; i++) {
      addAction();
      let baseId = `action_${i + 1}`;
      $(`#${baseId}_Actions`).val(actions.actions[i].actions);
      $(`#${baseId}_Max`).val(actions.actions[i].max);
      $(`#${baseId}_Costs`).val(actions.actions[i].costs);
      $(`#${baseId}_Drops`).val(actions.actions[i].drops);
      $(`#${baseId}_Visibility`).val(actions.actions[i].visibility);
      $(`#${baseId}_Response`).val(actions.actions[i].response);
      $(`#${baseId}_Fail`).val(actions.actions[i].fail);
      $(`#${baseId}_Points`).val(actions.actions[i].points);
      $(`#${baseId}_Items`).val(actions.actions[i].reqItems);
      $(`#${baseId}_Containers`).val(actions.actions[i].reqContainers);
      $(`#${baseId}_Local`).val(actions.actions[i].reqLocal);
      $(`#${baseId}_Global`).val(actions.actions[i].reqGlobal);
      $(`#${baseId}_preAction`).val(actions.actions[i].preAction);
      $(`#${baseId}_Visits`).val(actions.actions[i].locVisits);
      $(`#${baseId}_preNode`).val(actions.actions[i].preNode);
      $(`#${baseId}_Evos`).val(actions.actions[i].itemEvos);
    }
  }

  $("#winDes").val(win.description);
  $("#win_Items").val(win.reqItems);
  $("#win_Containers").val(win.reqContainers);
  $("#win_Local").val(win.reqLocal);
  $("#win_Global").val(win.reqGlobal);
  $("#win_preAction").val(win.preAction);
  $("#win_Visits").val(win.locVisits);
  $("#win_preNode").val(win.preNode);
  $("#win_Evos").val(win.itemEvos);

  $("#loseDes").val(lose.description);
  $("#lose_Items").val(lose.reqItems);
  $("#lose_Containers").val(lose.reqContainers);
  $("#lose_Local").val(lose.reqLocal);
  $("#lose_Global").val(lose.reqGlobal);
  $("#lose_preAction").val(lose.preAction);
  $("#lose_Visits").val(lose.locVisits);
  $("#lose_preNode").val(lose.preNode);
  $("#lose_Evos").val(lose.itemEvos);

  $("#hint").val(hint);
}

function directions(inputs) {
  for (let input of inputs) {
    let inputId = $(input).attr("id");
    let nextLoc;
    let curLoc = currentNode.split(",");
    switch (inputId) {
      case "N":
        nextLoc = `${curLoc[0]},${+curLoc[1] + 1},${curLoc[2]}`;
        break;
      case "NE":
        nextLoc = `${+curLoc[0] + 1},${+curLoc[1] + 1},${curLoc[2]}`;
        break;
      case "E":
        nextLoc = `${+curLoc[0] + 1},${curLoc[1]},${curLoc[2]}`;
        break;
      case "SE":
        nextLoc = `${+curLoc[0] + 1},${+curLoc[1] - 1},${curLoc[2]}`;
        break;
      case "S":
        nextLoc = `${curLoc[0]},${+curLoc[1] - 1},${curLoc[2]}`;
        break;
      case "SW":
        nextLoc = `${+curLoc[0] - 1},${+curLoc[1] - 1},${curLoc[2]}`;
        break;
      case "W":
        nextLoc = `${+curLoc[0] - 1},${curLoc[1]},${curLoc[2]}`;
        break;
      case "NW":
        nextLoc = `${+curLoc[0] - 1},${+curLoc[1] + 1},${curLoc[2]}`;
        break;
      case "Up":
        nextLoc = `${curLoc[0]},${curLoc[1]},${+curLoc[2] + 1}`;
        break;
      case "Down":
        nextLoc = `${curLoc[0]},${curLoc[1]},${+curLoc[2] - 1}`;
        break;
      default:
        nextLoc = "";
        break;
    }
    if ($(input).is(":checked")) {
      if (!$(`#${inputId}_Edit`).length) {
        let newDivId = `${inputId}_Edit`;
        let newDivStart = `<div class='blockElements blockElementSizer' id='${newDivId}'>`;
        let newDivEnd = "</div>";
        let direction = `<span class='centerText'><b>${inputId}</b></span>`;
        let divLocLabel = `<label class='tooltip'>
                                    <b>Location</b>
                                    <span class='tooltiptext'>Location of the destination node (defaults to direction clicked, but may be edited)</span>
                                    </label>`;
        let divLoc = `<input value='${nextLoc}' id='${inputId}_Location' type='text'>`;
        let divAltLabel = `<label class='tooltip'>
                                    <b>Alternatives</b>
                                    <span class='tooltiptext'>Comma separated alternatives to "go ${inputId}"" (e.g. "follow narrow path, take narrow path, take path, etc.")</span>
                                    </label>`;
        let divAlt = `<input id='${inputId}_Alternatives' type='text'>`;
        let excludeDefaults = `<label class='pure-checkbox tooltip'>
                                    Exclude Defaults
                                    <span class='tooltiptext'>If checked, the default "go ${inputId}" (and equivalents) will not work</span>
                                    </label>
                                    <input type='checkbox' id='${inputId}_Exclude'/>`;
        let requirements = getRequirements(inputId);

        let html =
          newDivStart +
          direction +
          divLocLabel +
          divLoc +
          divAltLabel +
          divAlt +
          excludeDefaults +
          requirements +
          newDivEnd;

        $("#editDirections").append(html);
      }
    } else {
      $(`#${inputId}_Edit`).remove();
    }
  }
}

function addItem() {
  let length = $("#itemList").children().length;
  let itemId;
  if (length >= 1) {
    let lastId = +$("#itemList").children().last().attr("id").split("_")[1];
    itemId = `item_${lastId + 1}`;
  } else {
    itemId = "item_1";
  }
  let newDivStart = `<div class='blockElements' id='${itemId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = "<button class='removeObject'>Remove Item</button>";
  let nameLabel = `<label class='tooltip'>
                    Name
                    <span class='tooltiptext'>Comma separated names of item [first option has requirement precedence] (e.g. lantern, light, torch)</span>
                    </label>`;
  let name = `<input type='text' id='${itemId}_Name'>`;
  let desLabel = `<label class='tooltip'>
                    Description
                    <span class='tooltiptext'>Description of item (for "examine {item}" or "look {item}" command)</span>
                    </label>`;
  let des = `<textarea id='${itemId}_Des' rows='3' cols='23'></textarea>`;
  let pointsLabel = `<label class='tooltip'>
                        Points
                        <span class='tooltiptext'>Number of points awarded for getting this item [default of 0]</span>
                        </label>`;
  let points = `<input type='text' id='${itemId}_Points'>`;
  let requirements = getRequirements(itemId);
  let evoButton = "<button class='addEvoItems'>Add Evolution</button>";
  let evoListDiv = `<div id='${itemId}_EvoList'></div>`;
  let html =
    newDivStart +
    rmvButton +
    nameLabel +
    name +
    desLabel +
    des +
    pointsLabel +
    points +
    requirements +
    evoButton +
    evoListDiv +
    newDivEnd;

  $("#itemList").append(html);
}

function addContainer() {
  let length = $("#containerList").children().length;
  let containerId;
  if (length >= 1) {
    let lastId = +$("#containerList")
      .children()
      .last()
      .attr("id")
      .split("_")[1];
    containerId = `container_${lastId + 1}`;
  } else {
    containerId = "container_1";
  }
  let newDivStart = `<div class='blockElements blockElementSizer' id='${containerId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = "<button class='removeObject'>Remove Container</button>";
  let nameLabel = `<label class='tooltip'>
                    Name
                    <span class='tooltiptext'>Comma separated names of this container [first option has requirement precedence] (e.g. box, bin, cardboard box)</span>
                    </label>`;
  let name = `<input type='text' id='${containerId}_Name'>`;
  let capLabel = `<label class='tooltip'>
                    Capacity
                    <span class='tooltiptext'>Max number of items the container can hold (leave empty for no limit)</span>
                    </label>`;
  let cap = `<input type='text' id='${containerId}_Capacity'>`;
  let completeLabel = `<label class='tooltip'>
                    Completed Contents
                    <span class='tooltiptext'>Either a number OR a comma separated list of items - Returns true if contents are >=
                    the number OR if every listed item is present</span>
                    </label>`;
  let complete = `<input type='text' id='${containerId}_Complete'>`;
  let illegalLabel = `<label class='tooltip'>
                    Illegal Items
                    <span class='tooltiptext'>Comma separated list of items which may not be deposited into container</span>
                    </label>`;
  let illegal = `<input type='text' id='${containerId}_Illegal'>`;
  let pointsLabel = `<label class='tooltip'>
                    Points
                    <span class='tooltiptext'>Points awarded for this container being 'complete' [default of 0]</span>
                    </label>`;
  let points = `<input type='text' id='${containerId}_Points'>`;
  let requirements = getRequirements(containerId);
  let html =
    newDivStart +
    rmvButton +
    nameLabel +
    name +
    capLabel +
    cap +
    completeLabel +
    complete +
    illegalLabel +
    illegal +
    pointsLabel +
    points +
    requirements +
    newDivEnd;

  $("#containerList").append(html);
}

function addGlobalAction() {
  let length = $("#globalActionList").children().length;
  let actionId;
  if (length >= 1) {
    let lastId = +$("#globalActionList").children().last().attr("id").split("_")[1];
    actionId = `global_action_${lastId + 1}`;
  } else {
    actionId = "global_action_1";
  }
  let newDivStart = `<div class='popupBlockElements' id='${actionId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = `<button class='removeObject'>Remove Action</button>`;
  let actionLabel = `<label class='tooltip'>
                        Action(s)
                        <span class='tooltiptext'>Comma separated list of accepted action(e.g. crush egg, smash egg) [Ignores: a, an, the, to, for, at]</span>
                        </label>`;
  let actions = `<input type='text' id='${actionId}_Actions'>`;
  let maxLabel = `<label class='tooltip'>
                    Max Uses
                    <span class='tooltiptext'>A number for the maximum number of times this action can be called [leave blank for no maximum]</span>
                    </label>`;
  let max = `<input type='text' id='${actionId}_Max'>`;
  let costsLabel = `<label class='tooltip'>
                    Costs
                    <span class='tooltiptext'>Comma separated list of items which are spent/destroyed to perform this action</span>
                    </label>`;
  let costs = `<input type='text' id='${actionId}_Costs'>`;
  let dropsLabel = `<label class='tooltip'>
                    Drops
                    <span class='tooltiptext'>Comma separated list of items which are dropped to perform this action</span>
                    </label>`;
  let drops = `<input type='text' id='${actionId}_Drops'>`;
  let visibilityLabel = `<label class='tooltip'>
                        Visibility
                        <span class='tooltiptext'>Selection for how this action affects this node's visibility</span>
                        </label>`;
  let visibility = `<select id='${actionId}_Visibility'>
                        <option value='none' seleted='selected'>No change</option>
                        <option value='on'>On</option>
                        <option value='off'>Off</option>
                        <option value='switch'>Switch</option>
                        </select>`;
  let responseLabel = `<label class='tooltip'>
                        Action Response
                        <span class='tooltiptext'>Text displayed after successfully calling this action (e.g. The egg is now broken.)</span>
                        </label>`;
  let response = `<textarea id='${actionId}_Response' rows='3' cols='23'></textarea>`;
  let failLabel = `<label class='tooltip'>
                        Fail Response
                        <span class='tooltiptext'>Text displayed after not meeting the action requirements (e.g. This door requires a key.)</span>
                        </label>`;
  let fail = `<textarea id='${actionId}_Fail' rows='3' cols='23'></textarea>`;
  let pointsLabel = `<label class='tooltip'>
                    Points
                    <span class='tooltiptext'>Points awarded for successfully calling this action [default of 0]</span>
                    </label>`;
  let points = `<input type='text' id='${actionId}_Points'>`;
  let requirements = getRequirements(actionId);

  let html =
    newDivStart +
    rmvButton +
    actionLabel +
    actions +
    maxLabel +
    max +
    costsLabel +
    costs +
    dropsLabel +
    drops +
    visibilityLabel +
    visibility +
    responseLabel +
    response +
    failLabel +
    fail +
    pointsLabel +
    points +
    requirements +
    newDivEnd;

  $("#globalActionList").append(html);
}

function addAction() {
  let length = $("#actionList").children().length;
  let actionId;
  if (length >= 1) {
    let lastId = +$("#actionList").children().last().attr("id").split("_")[1];
    actionId = `action_${lastId + 1}`;
  } else {
    actionId = "action_1";
  }
  let newDivStart = `<div class='blockElements' id='${actionId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = `<button class='removeObject'>Remove Action</button>`;
  let actionLabel = `<label class='tooltip'>
                        Action(s)
                        <span class='tooltiptext'>Comma separated list of accepted action(e.g. crush egg, smash egg) [Ignores: a, an, the, to, for, at]</span>
                        </label>`;
  let actions = `<input type='text' id='${actionId}_Actions'>`;
  let maxLabel = `<label class='tooltip'>
                    Max Uses
                    <span class='tooltiptext'>A number for the maximum number of times this action can be called [leave blank for no maximum]</span>
                    </label>`;
  let max = `<input type='text' id='${actionId}_Max'>`;
  let costsLabel = `<label class='tooltip'>
                    Costs
                    <span class='tooltiptext'>Comma separated list of items which are spent/destroyed to perform this action</span>
                    </label>`;
  let costs = `<input type='text' id='${actionId}_Costs'>`;
  let dropsLabel = `<label class='tooltip'>
                    Drops
                    <span class='tooltiptext'>Comma separated list of items which are dropped to perform this action</span>
                    </label>`;
  let drops = `<input type='text' id='${actionId}_Drops'>`;
  let visibilityLabel = `<label class='tooltip'>
                        Visibility
                        <span class='tooltiptext'>Selection for how this action affects this node's visibility</span>
                        </label>`;
  let visibility = `<select id='${actionId}_Visibility'>
                        <option value='none' seleted='selected'>No change</option>
                        <option value='on'>On</option>
                        <option value='off'>Off</option>
                        <option value='switch'>Switch</option>
                        </select>`;
  let responseLabel = `<label class='tooltip'>
                        Action Response
                        <span class='tooltiptext'>Text displayed after successfully calling this action (e.g. The egg is now broken.)</span>
                        </label>`;
  let response = `<textarea id='${actionId}_Response' rows='3' cols='23'></textarea>`;
  let failLabel = `<label class='tooltip'>
                        Fail Response
                        <span class='tooltiptext'>Text displayed after not meeting the action requirements (e.g. This door requires a key.)</span>
                        </label>`;
  let fail = `<textarea id='${actionId}_Fail' rows='3' cols='23'></textarea>`;
  let pointsLabel = `<label class='tooltip'>
                    Points
                    <span class='tooltiptext'>Points awarded for successfully calling this action [default of 0]</span>
                    </label>`;
  let points = `<input type='text' id='${actionId}_Points'>`;
  let requirements = getRequirements(actionId);

  let html =
    newDivStart +
    rmvButton +
    actionLabel +
    actions +
    maxLabel +
    max +
    costsLabel +
    costs +
    dropsLabel +
    drops +
    visibilityLabel +
    visibility +
    responseLabel +
    response +
    failLabel +
    fail +
    pointsLabel +
    points +
    requirements +
    newDivEnd;

  $("#actionList").append(html);
}

function addSimInput() {
  let html;
  switch(gameStyle) {
    case "classic":
      html = `<div id="inputSim">
                <input id="classicStyleInput" type="text">
              </div>`
      break;
    case "modern":
      html = `<div id="inputSim">
                <div id="modernStyleDirections" class="modernInput">
                </div>
                <div id="modernStyleActions" class="modernInput">
                </div>
              </div>`;
      break;
    case "gamebook":
      html = `<div id="inputSim">
                <div id="gamebookStyleDirections" class="gamebookInput">
                </div>
              </div>`;
      break;
    default:
      html = `<div id="inputSim">
                <p>You must first load a saved game.</p>
              </div>`;
      break;
  }
  $("#inputSim").remove();
  $("#gameContainer").append(html);
}

function showHide(ID) {
  let block;
  switch (ID) {
    case "directionsBlockBtn":
      block = "directionsBlock";
      break;
    case "descriptionsBlockBtn":
      block = "descriptionsBlock";
      break;
    case "itemsBlockBtn":
      block = "itemsBlock";
      break;
    case "actionsBlockBtn":
      block = "actionsBlock";
      break;
    case "winBlockBtn":
      block = "winBlock";
      break;
    case "loseBlockBtn":
      block = "loseBlock";
      break;
    case "hintBlockBtn":
      block = "hintBlock";
      break;
    case "containersBlockBtn":
      block = "containersBlock";
      break;
    default:
      break;
  }
  if (block) {
    let menus = [
      "directionsBlock",
      "descriptionsBlock",
      "itemsBlock",
      "actionsBlock",
      "winBlock",
      "loseBlock",
      "hintBlock",
      "containersBlock",
    ];

    for (let menu of menus) {
      if (menu !== block) {
        let x = $(`#${menu}`)[0];
        x.style.display = "none";
      } else {
        let x = $(`#${menu}`)[0];
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
      }
    }
  }
}

function addEvo(listId, itemNumber) {
  let length = $(`#${listId}`).children().length;
  let evoId;
  //Handles desription evolutions
  if (listId.includes("evoListDescriptions")) {
    if (length >= 1) {
      let lastId = +$(`#${listId}`).children().last().attr("id").split("_")[1];
      evoId = `evoDes_${lastId + 1}`;
    } else {
      evoId = "evoDes_1";
    }
  //Handles item evolutions
  } else if (listId.includes("_EvoList")) {
    if (length >= 1) {
      let lastId = +$(`#${listId}`).children().last().attr("id").split("_")[1] - (itemNumber-1);
      evoId = `evoItems_${itemNumber}_${lastId + 1}`;
    } else {
      evoId = `evoItems_${itemNumber}_1`;
    }
  } else {
    evoId = "undefined";
  }
  let newDivStart = `<div class='blockElements' id='${evoId}'>`;
  let evoHeading = `<label><b>Evolution</b></label>`;
  let newDivEnd = "</div>";
  let requirements = getRequirements(evoId);
  let evoDesLabel = `<label class='tooltip'>
                    <b>Evo Description</b>
                    <span class='tooltiptext'>The text displayed for this setting after meeting the above requirements</span>
                    </label>`;
  let evoDes = `<textarea id='${evoId}_Des' rows='4' cols='23'></textarea>`;
  let rmvButton = `<button class='removeEvo'>Remove Evolution</button>`;

  let html =
    newDivStart +
    evoHeading +
    requirements +
    evoDesLabel +
    evoDes +
    rmvButton +
    newDivEnd;

  $(`#${listId}`).append(html);
}

function getRequirements(baseId) {
  let divStart = `<div class='requirements'>`;
  let reqLabel = `<label class='tooltip'>
                    <b>Requirements</b>
                    <span class='tooltiptext'>The current node setting will only exist/apply if the following conditions are met</span>
                    </label>`;
  let reqItems = `<label class='tooltip'>
                    Items
                    <span class='tooltiptext'>Comma separated items required for this setting (e.g. keys, bottle, food, etc.)</span>
                    </label>
                    <input id='${baseId}_Items' type='text'>`;
  let reqContainers = `<label class='tooltip'>
                        Containers
                        <span class='tooltiptext'>Comma separated containers required to be "complete" for this setting</span>
                        </label>
                        <input id='${baseId}_Containers' type='text'>`;
  let reqLocal = `<label class='tooltip'>
                    Local Actions
                    <span class='tooltiptext'>Comma separated actions which the player is required to have entered in this node location (e.g. unlock gate, break window)</span>
                    </label>
                    <input id='${baseId}_Local' type='text'>`;
  let reqGlobal = `<label class='tooltip'>
                    Global Actions
                    <span class='tooltiptext'>Comma separated actions which the player is required to have entered in any node (e.g. abracadabra, forge key)</span>
                    </label>
                    <input id='${baseId}_Global' type='text'>`;
  let preAction = `<label class='tooltip'>
                    Previous Action
                    <span class='tooltiptext'>The action required to have been successfully called most recently</span>
                    </label>
                    <input id='${baseId}_preAction' type='text'>`;
  let reqVisits = `<label class='tooltip'>
                    Node Visits
                    <span class='tooltiptext'>Comma separated list of locations and required number of visits to each (in form of [location, visits]) (e.g. [0,0,0,1], [0,2,0,1], [2,3,0,1])</span>
                    </label>
                    <input id='${baseId}_Visits' type='text'>`;
  let preNode = `<label class='tooltip'>
                    Previous Node
                    <span class='tooltiptext'>Comma separated coordinates of the node required to be the last visited node (prior to the current node)(e.g. 1,2,3 )</span>
                    </label>
                    <input id='${baseId}_preNode' type='text'>`;
  let reqEvos = `<label class='tooltip'>
                    Item Evos
                    <span class='tooltiptext'>Comma separated list of items and the required evolution stage for each (e.g. [key, 1], [knife, 2])</span>
                    </label>
                    <input id ='${baseId}_Evos' type='text'>`;
  let divEnd = `</div>`;

  let html =
    divStart +
    reqLabel +
    reqItems +
    reqContainers +
    reqLocal +
    reqGlobal +
    preAction +
    reqVisits +
    preNode +
    reqEvos +
    divEnd;
  return html;
}

function removeEvo(evoList, evoId) {
  $(`#${evoList}`).find(`#${evoId}`).first().remove();
}

function removeObject(objectId) {
  $(`#${objectId}`).remove();
}

export {
  directions,
  addItem,
  addContainer,
  addAction,
  showHide,
  addEvo,
  getRequirements,
  removeEvo,
  removeObject,
  loadDomGlobalActions,
  loadDomFromNode,
  addSimInput,
  addGlobalAction
};
