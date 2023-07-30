import { loadDomFromNode, loadDomGlobalActions, loadDomInitItems, loadDomCustomCommands } from "./if_dom.js";
import { createMapFromGame } from "./if_nodemap.js";

var game = {};
var gameTitle;
var gameStyle;
var gameStatus;
var gameRating;
var gameAuthor;
var globalActions;
var initItems;
var customDeposits;
var customWithdrawals;

var node = {
  name: "",
  location: [],
  visibility: "true",
  points: 0,
  directions: [],
  description: {},
  items: [],
  containers: [],
  actions: {},
  win: {},
  lose: {},
  hint: "",
  visits: 0,
};

var cNode = JSON.parse(JSON.stringify(node));

function startGameSim() {
  if ($("#gameSim").css("display") == "none") {
    $("#gameSim").css("display", "block");
  } else {
    $("#gameSim").css("display", "none");
  }
}

async function saveGame() {
  let gameTitle = $("#gameTitle").val();
  let gameFile = {};
  saveCNode();
  saveDefaultCommands();
  saveGlobalActions();
  saveInitItems();
  gameFile['gameStyle'] = $("#gameStyle").val();
  gameFile['gameStatus'] = $("#gameStatus").val();
  gameFile['gameRating'] = $("#gameRating").val();
  gameFile['gameAuthor'] = $("#gameAuthor").val();
  gameFile['gameTitle'] = gameTitle;
  gameFile['globalActions'] = globalActions;
  gameFile['initItems'] = initItems;
  gameFile['customDeposits'] = customDeposits;
  gameFile['customWithdrawals'] = customWithdrawals;
  gameFile['gameContent'] = JSON.parse(JSON.stringify(game));
  window.IFS_API.saveGame(JSON.stringify(gameFile));
}

async function loadGame() {
  await window.IFS_API.loadGame().then((rawData) => {
    let loadData = JSON.parse(rawData.toString());
    gameTitle = loadData['gameTitle'];
    gameStyle = loadData['gameStyle'];
    gameStatus = loadData['gameStatus'];
    gameRating = loadData['gameRating'];
    gameAuthor = loadData['gameAuthor'];
    globalActions = loadData['globalActions'];
    initItems = loadData['initItems']
    customDeposits = loadData['customDeposits']
    customWithdrawals = loadData['customWithdrawals']
    game = loadData['gameContent'];
    cNode = loadData['gameContent']['0,0,0'];
    loadDomCustomCommands();
    loadDomInitItems(initItems);
    loadDomGlobalActions(globalActions);
    loadDomFromNode(cNode);
    createMapFromGame(Object.keys(game));
    $("#gameTitle").val(gameTitle);
    $('#gameStyle').val(gameStyle);
    $('#gameStatus').val(gameStatus);
    $('#gameRating').val(gameRating);
    $('#gameAuthor').val(gameAuthor);
  });
}

async function deleteNode() {
  if (cNode.location.toString() !== "0,0,0") {
    if (await window.IFS_API.deleteNode() == 0) {
      if (game.hasOwnProperty(cNode.location.toString())) {
        delete game[cNode.location.toString()];
        cNode = JSON.parse(JSON.stringify(game["0,0,0"]));
        loadDomFromNode(cNode);
        createMapFromGame(Object.keys(game));
      }
    }
  } else {
    await window.IFS_API.deleteDenied();
  }
}

function switchNode(title) {
  saveCNode();
  if (game.hasOwnProperty(title)) {
    cNode = JSON.parse(JSON.stringify(game[title]));
  } else {
    cNode = JSON.parse(JSON.stringify(node));
    cNode.location = title.split(",");
  }
  loadDomFromNode(cNode);
  saveCNode();
}

function saveDefaultCommands() {
  //default container deposits
  let includeDefaultDeposits;
  let customDefaultsInput;
  if ($("#includeDefaultContainerDeposits").is(":checked")) {
    includeDefaultDeposits = "true";
  } else {
    includeDefaultDeposits = "false";
  }
  customDefaultsInput = $("#customContainerDepositCommands").val().split(/\s*,\s*/);
  
  customDeposits = {
    "includeDefaults": includeDefaultDeposits,
    "customDeposits": customDefaultsInput
  }

  //default container withdrawals
  let includeDefaultWithdrawals;
  if ($("#includeDefaultContainerWithdrawals").is(":checked")) {
    includeDefaultWithdrawals = "true";
  } else {
    includeDefaultWithdrawals = "false";
  }
  customDefaultsInput = $("#customContainerWithdrawalCommands").val().split(/\s*,\s*/);
  
  customWithdrawals = {
    "includeDefaults": includeDefaultWithdrawals,
    "customWithdrawals": customDefaultsInput
  }
}

function saveInitItems() {
  let itemArray = [];
  let itemList = $("#initItemList").children();
  for (let i = 0; i < itemList.length; i++) {
    let itemId = $(itemList[i]).attr("id");
    let name = $(`#${itemId}_Name`).val();
    let description = $(`#${itemId}_Des`).val();
    let points = $(`#${itemId}_Points`).val();
    let itemEvos = $(`#${itemId}_Evos`).val();
    let item = {
      name: name,
      description: description,
      points: points,
      itemEvos: itemEvos,
      evos: [],
    };
    let evoDivs = $(`#${itemId}_EvoList`).children();
    let evoListItems = [];
    for (let j = 0; j < evoDivs.length; j++) {
      let baseId = $(evoDivs[j]).attr("id");
      let reqAll = $(`#${baseId}reqAll`).is(":checked").toString();
      let reqItems = $(`#${baseId}_Items`).val();
      let reqContainers = $(`#${baseId}_Containers`).val();
      let reqLocal = $(`#${baseId}_Local`).val();
      let reqGlobal = $(`#${baseId}_Global`).val();
      let preAction = $(`#${baseId}_preAction`).val();
      let locVisits = $(`#${baseId}_Visits`).val();
      let preNode = $(`#${baseId}_preNode`).val();
      let itemEvos = $(`#${baseId}_Evos`).val();
      let evoDes = $(`#${baseId}_Des`).val();
      let evo = {
        reqAll: reqAll,
        reqItems: reqItems,
        reqContainers: reqContainers,
        reqLocal: reqLocal,
        reqGlobal: reqGlobal,
        preAction: preAction,
        locVisits: locVisits,
        preNode: preNode,
        itemEvos: itemEvos,
        evoDes: evoDes,
      };
      evoListItems.push(evo);
    }
    item.evos = evoListItems;
    itemArray.push(item);
  }
  initItems = itemArray;
}

function saveGlobalActions() {
  let actionArray = [];
  let actionList = $("#globalActionList").children();
  for (let i = 0; i < actionList.length; i++) {
    let baseId = $(actionList[i]).attr("id");
    let actions = $(`#${baseId}_Actions`).val();
    let max = $(`#${baseId}_Max`).val();
    let costs = $(`#${baseId}_Costs`).val();
    let drops = $(`#${baseId}_Drops`).val();
    let visibility = $(`#${baseId}_Visibility`).val();
    let response = $(`#${baseId}_Response`).val();
    let fail = $(`#${baseId}_Fail`).val();
    let points = $(`#${baseId}_Points`).val();
    let reqAll = $(`#${baseId}_reqAll`).is(":checked").toString();
    let reqItems = $(`#${baseId}_Items`).val();
    let reqContainers = $(`#${baseId}_Containers`).val();
    let reqLocal = $(`#${baseId}_Local`).val();
    let reqGlobal = $(`#${baseId}_Global`).val();
    let preAction = $(`#${baseId}_preAction`).val();
    let locVisits = $(`#${baseId}_Visits`).val();
    let preNode = $(`#${baseId}_preNode`).val();
    let itemEvos = $(`#${baseId}_Evos`).val();

    let action = {
      actions: actions,
      max: max,
      costs: costs,
      drops: drops,
      visibility: visibility,
      response: response,
      fail: fail,
      points: points,
      reqAll: reqAll,
      reqItems: reqItems,
      reqContainers: reqContainers,
      reqLocal: reqLocal,
      reqGlobal: reqGlobal,
      preAction: preAction,
      locVisits: locVisits,
      preNode: preNode,
      itemEvos: itemEvos,
    };
    actionArray.push(action);
  }
  globalActions = actionArray;
}

function saveCNode() {
  cNode = generateNode();
  let cTitle = cNode.location.toString();
  game[cTitle] = JSON.parse(JSON.stringify(cNode));
}

function generateNode() {
  //clear current node
  cNode = JSON.parse(JSON.stringify(node));
  //generate name
  let name = $("#name").val();
  cNode.name = name;

  //generate location
  let location = $("#location").html().split(",");
  cNode.location = location;

  //generate visibility
  let visibility = $("#visibility").is(":checked");
  if (visibility) {
    cNode.visibility = "true";
  } else {
    cNode.visibility = "false";
  }

  //generate points
  let nodePoints = $("#points").val();
  cNode.points = nodePoints;

  //generate directions
  let checkboxes = $("#directions").find("input");
  let directions = [];
  for (let input of checkboxes) {
    if ($(input).is(":checked")) {
      let direction = $(input).attr("id");
      let location = $(`#${direction}_Location`).val();
      let alternatives = $(`#${direction}_Alternatives`).val();
      let exclude = $(`#${direction}_Exclude`).is(":checked");
      let reqAll = $(`#${direction}_reqAll`).is(":checked").toString();
      let reqItems = $(`#${direction}_Items`).val();
      let reqContainers = $(`#${direction}_Containers`).val();
      let reqLocal = $(`#${direction}_Local`).val();
      let reqGlobal = $(`#${direction}_Global`).val();
      let preAction = $(`#${direction}_preAction`).val();
      let locVisits = $(`#${direction}_Visits`).val();
      let preNode = $(`#${direction}_preNode`).val();
      let itemEvos = $(`#${direction}_Evos`).val();

      if (exclude) {
        exclude = "true";
      } else {
        exclude = "false";
      }

      let object = {
        direction: direction,
        location: location,
        alternatives: alternatives,
        exclude: exclude,
        reqAll: reqAll,
        reqItems: reqItems,
        reqContainers: reqContainers,
        reqLocal: reqLocal,
        reqGlobal: reqGlobal,
        preAction: preAction,
        locVisits: locVisits,
        preNode: preNode,
        itemEvos: itemEvos,
      };
      directions.push(object);
    }
  }
  cNode.directions = directions;

  //generate descriptions
  let defaultDes = $("#defaultDes").val();
  let basicDes = $("#basicDes").val();
  let descriptionObject = {
    defaultDes: defaultDes,
    basicDes: basicDes,
    evos: [],
  };
  let evoListDes = $("#evoListDescriptions").children();
  if (evoListDes.length > 0) {
    for (let i = 0; i < evoListDes.length; i++) {
      let baseId = $(evoListDes[i]).attr("id");
      let reqAll = $(`#${baseId}_reqAll`).is(":checked").toString();
      let reqItems = $(`#${baseId}_Items`).val();
      let reqContainers = $(`#${baseId}_Containers`).val();
      let reqLocal = $(`#${baseId}_Local`).val();
      let reqGlobal = $(`#${baseId}_Global`).val();
      let preAction = $(`#${baseId}_preAction`).val();
      let locVisits = $(`#${baseId}_Visits`).val();
      let preNode = $(`#${baseId}_preNode`).val();
      let itemEvos = $(`#${baseId}_Evos`).val();
      let evoDes = $(`#${baseId}_Des`).val();

      let evo = {
        reqAll: reqAll,
        reqItems: reqItems,
        reqContainers: reqContainers,
        reqLocal: reqLocal,
        reqGlobal: reqGlobal,
        preAction: preAction,
        locVisits: locVisits,
        preNode: preNode,
        itemEvos: itemEvos,
        evoDes: evoDes,
      };
      descriptionObject.evos.push(evo);
    }
  }
  cNode.description = descriptionObject;

  //generate items
  let itemArray = [];
  let itemList = $("#itemList").children();
  for (let i = 0; i < itemList.length; i++) {
    let itemId = $(itemList[i]).attr("id");
    let name = $(`#${itemId}_Name`).val();
    let description = $(`#${itemId}_Des`).val();
    let points = $(`#${itemId}_Points`).val();
    let reqAll = $(`#${itemId}_reqAll`).is(":checked").toString();
    let reqItems = $(`#${itemId}_Items`).val();
    let reqContainers = $(`#${itemId}_Containers`).val();
    let reqLocal = $(`#${itemId}_Local`).val();
    let preAction = $(`#${itemId}_preAction`).val();
    let reqGlobal = $(`#${itemId}_Global`).val();
    let locVisits = $(`#${itemId}_Visits`).val();
    let preNode = $(`#${itemId}_preNode`).val();
    let itemEvos = $(`#${itemId}_Evos`).val();
    let item = {
      name: name,
      description: description,
      points: points,
      reqAll: reqAll,
      reqItems: reqItems,
      reqContainers: reqContainers,
      reqLocal: reqLocal,
      reqGlobal: reqGlobal,
      preAction: preAction,
      locVisits: locVisits,
      preNode: preNode,
      itemEvos: itemEvos,
      evos: [],
    };
    let evoDivs = $(`#${itemId}_EvoList`).children();
    let evoListItems = [];
    for (let j = 0; j < evoDivs.length; j++) {
      let baseId = $(evoDivs[j]).attr("id");
      let reqAll = $(`#${baseId}_reqAll`).is(":checked").toString();
      let reqItems = $(`#${baseId}_Items`).val();
      let reqContainers = $(`#${baseId}_Containers`).val();
      let reqLocal = $(`#${baseId}_Local`).val();
      let reqGlobal = $(`#${baseId}_Global`).val();
      let preAction = $(`#${baseId}_preAction`).val();
      let locVisits = $(`#${baseId}_Visits`).val();
      let preNode = $(`#${baseId}_preNode`).val();
      let itemEvos = $(`#${baseId}_Evos`).val();
      let evoDes = $(`#${baseId}_Des`).val();
      let evo = {
        reqAll: reqAll,
        reqItems: reqItems,
        reqContainers: reqContainers,
        reqLocal: reqLocal,
        reqGlobal: reqGlobal,
        preAction: preAction,
        locVisits: locVisits,
        preNode: preNode,
        itemEvos: itemEvos,
        evoDes: evoDes,
      };
      evoListItems.push(evo);
    }
    item.evos = evoListItems;
    itemArray.push(item);
  }
  cNode.items = itemArray;

  //generate containers
  let containersArray = [];
  let containerList = $("#containerList").children();
  for (let i = 0; i < containerList.length; i++) {
    let containerId = $(containerList[i]).attr("id");
    let name = $(`#${containerId}_Name`).val();
    let cap = $(`#${containerId}_Capacity`).val();
    let illegal = $(`#${containerId}_Illegal`).val();
    let complete = $(`#${containerId}_Complete`).val();
    let points = $(`#${containerId}_Points`).val();
    let reqAll = $(`#${containerId}_reqAll`).is(":checked").toString();
    let reqItems = $(`#${containerId}_Items`).val();
    let reqContainers = $(`#${containerId}_Containers`).val();
    let reqLocal = $(`#${containerId}_Local`).val();
    let reqGlobal = $(`#${containerId}_Global`).val();
    let preAction = $(`#${containerId}_preAction`).val();
    let locVisits = $(`#${containerId}_Visits`).val();
    let preNode = $(`#${containerId}_preNode`).val();
    let itemEvos = $(`#${containerId}_Evos`).val();
    let container = {
      name: name,
      capacity: cap,
      items: [],
      complete: complete,
      illegal: illegal,
      points: points,
      reqAll, reqAll,
      reqItems: reqItems,
      reqContainers: reqContainers,
      reqLocal: reqLocal,
      reqGlobal: reqGlobal,
      preAction: preAction,
      locVisits: locVisits,
      preNode: preNode,
      itemEvos: itemEvos,
    };
    containersArray.push(container);
  }
  cNode.containers = containersArray;

  //generate actions
  let actionsObject = {
    invalid: "",
    actions: [],
  };
  let actionArray = [];
  let actionList = $("#actionList").children();
  let invalidAction = $("#invalidAction").val();
  for (let i = 0; i < actionList.length; i++) {
    let baseId = $(actionList[i]).attr("id");
    let actions = $(`#${baseId}_Actions`).val();
    let max = $(`#${baseId}_Max`).val();
    let costs = $(`#${baseId}_Costs`).val();
    let drops = $(`#${baseId}_Drops`).val();
    let visibility = $(`#${baseId}_Visibility`).val();
    let response = $(`#${baseId}_Response`).val();
    let fail = $(`#${baseId}_Fail`).val();
    let points = $(`#${baseId}_Points`).val();
    let reqAll = $(`#${baseId}_reqAll`).is(":checked").toString();
    let reqItems = $(`#${baseId}_Items`).val();
    let reqContainers = $(`#${baseId}_Containers`).val();
    let reqLocal = $(`#${baseId}_Local`).val();
    let reqGlobal = $(`#${baseId}_Global`).val();
    let preAction = $(`#${baseId}_preAction`).val();
    let locVisits = $(`#${baseId}_Visits`).val();
    let preNode = $(`#${baseId}_preNode`).val();
    let itemEvos = $(`#${baseId}_Evos`).val();

    let action = {
      actions: actions,
      max: max,
      costs: costs,
      drops: drops,
      visibility: visibility,
      response: response,
      fail: fail,
      points: points,
      reqAll: reqAll,
      reqItems: reqItems,
      reqContainers: reqContainers,
      reqLocal: reqLocal,
      reqGlobal: reqGlobal,
      preAction: preAction,
      locVisits: locVisits,
      preNode: preNode,
      itemEvos: itemEvos,
    };
    actionArray.push(action);
  }
  actionsObject.actions = actionArray;
  actionsObject.invalid = invalidAction;
  cNode.actions = JSON.parse(JSON.stringify(actionsObject));

  //generate win
  let winDes = $("#winDes").val();
  let winReqAll = $("win_reqAll").is(":checked").toString();
  let winReqItems = $("#win_Items").val();
  let winReqContainers = $("#win_Containers").val();
  let winReqLocal = $("#win_Local").val();
  let winReqGlobal = $("#win_Global").val();
  let winPreAction = $("#win_preAction").val();
  let winLocVisits = $("#win_Visits").val();
  let winPreNode = $("#win_preNode").val();
  let winItemEvos = $("#win_Evos").val();
  let win = {
    description: winDes,
    reqAll: winReqAll,
    reqItems: winReqItems,
    reqContainers: winReqContainers,
    reqLocal: winReqLocal,
    reqGlobal: winReqGlobal,
    preAction: winPreAction,
    locVisits: winLocVisits,
    preNode: winPreNode,
    itemEvos: winItemEvos,
  };
  cNode.win = win;

  //generate lose
  let loseDes = $("#loseDes").val();
  let loseReqAll = $("#lose_reqAll").is(":checked").toString();
  let loseReqItems = $("#lose_Items").val();
  let loseReqContainers = $("#lose_Containers").val();
  let loseReqLocal = $("#lose_Local").val();
  let loseReqGlobal = $("#lose_Global").val();
  let losePreAction = $("#lose_preAction").val();
  let loseLocVisits = $("#lose_Visits").val();
  let losePreNode = $("#lose_preNode").val();
  let loseItemEvos = $("#lose_Evos").val();
  let lose = {
    description: loseDes,
    reqAll: loseReqAll,
    reqItems: loseReqItems,
    reqContainers: loseReqContainers,
    reqLocal: loseReqLocal,
    reqGlobal: loseReqGlobal,
    preAction: losePreAction,
    locVisits: loseLocVisits,
    preNode: losePreNode,
    itemEvos: loseItemEvos,
  };
  cNode.lose = lose;

  //generate hint
  let hint = $("#hint").val();
  cNode.hint = hint;

  return cNode;
}

export {
  generateNode,
  gameTitle,
  gameStyle,
  gameAuthor,
  globalActions,
  initItems,
  customDeposits,
  customWithdrawals,
  game,
  node,
  switchNode,
  saveGame,
  loadGame,
  deleteNode,
  startGameSim
};
