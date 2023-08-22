import { loadDomFromNode, loadDomGlobalActions, loadDomInitItems, loadDomCustomCommands, changeStyle } from "./if_dom.js";
import { createMapFromGame } from "./if_nodemap.js";

var game = {};
var gameTitle;
var gameStyle;
var gameStatus;
var gameRating;
var gameAuthor;
var IFID;
var globalActions;
var initItems;
var customDeposits;
var customWithdrawals;
var customTakes;
var customDrops;
var customIgnorables;
var customLooks;
var customExamines;

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
  gameFile['IFID'] = generateIFID();
  gameFile['gameTitle'] = gameTitle;
  gameFile['globalActions'] = globalActions;
  gameFile['initItems'] = initItems;
  gameFile['customDeposits'] = customDeposits;
  gameFile['customWithdrawals'] = customWithdrawals;
  gameFile['customTakes'] = customTakes;
  gameFile['customDrops'] = customDrops;
  gameFile['customIgnorables'] = customIgnorables;
  gameFile['customLooks'] = customLooks;
  gameFile['customExamines'] = customExamines;
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
    IFID = loadData['IFID'];
    globalActions = loadData['globalActions'];
    initItems = loadData['initItems'];
    customDeposits = loadData['customDeposits'];
    customWithdrawals = loadData['customWithdrawals'];
    customTakes = loadData['customTakes'];
    customDrops = loadData['customDrops'];
    customIgnorables = loadData['customIgnorables'];
    customLooks = loadData['customLooks'];
    customExamines = loadData['customExamines'];
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

    //Change dom based on game style
    changeStyle(gameStyle);
  });
}

function generateIFID() {
  if (!IFID) {
    let uuid = crypto.randomUUID();
    return `UUID://${uuid}//`;
  } else {
    return IFID;
  }
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

  //default take commands
  let includeDefaultTakes;
  if ($("#includeDefaultTakes").is(":checked")) {
    includeDefaultTakes = "true";
  } else {
    includeDefaultTakes = "false";
  }
  customDefaultsInput = $("#customTakeCommands").val().split(/\s*,\s*/);
  
  customTakes = {
    "includeDefaults": includeDefaultTakes,
    "customTakes": customDefaultsInput
  }

  //default drop commands
  let includeDefaultDrops;
  if ($("#includeDefaultDrops").is(":checked")) {
    includeDefaultDrops = "true";
  } else {
    includeDefaultDrops = "false";
  }
  customDefaultsInput = $("#customDropCommands").val().split(/\s*,\s*/);
  
  customDrops = {
    "includeDefaults": includeDefaultDrops,
    "customDrops": customDefaultsInput
  }

  //default ignorables
  let includeDefaultIgnorables;
  if ($("#includeDefaultIgnorables").is(":checked")) {
    includeDefaultIgnorables = "true";
  } else {
    includeDefaultIgnorables = "false";
  }
  customDefaultsInput = $("#customIgnorables").val().split(/\s*,\s*/);
  
  customIgnorables = {
    "includeDefaults": includeDefaultIgnorables,
    "customIgnorables": customDefaultsInput
  }

  //default looks
  let includeDefaultLooks;
  if ($("#includeDefaultLooks").is(":checked")) {
    includeDefaultLooks = "true";
  } else {
    includeDefaultLooks = "false";
  }
  customDefaultsInput = $("#customLooks").val().split(/\s*,\s*/);
  
  customLooks = {
    "includeDefaults": includeDefaultLooks,
    "customLooks": customDefaultsInput
  }

  //default examines
  let includeDefaultExamines;
  if ($("#includeDefaultExamines").is(":checked")) {
    includeDefaultExamines = "true";
  } else {
    includeDefaultExamines = "false";
  }
  customDefaultsInput = $("#customExamines").val().split(/\s*,\s*/);
  
  customExamines = {
    "includeDefaults": includeDefaultExamines,
    "customExamines": customDefaultsInput
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
      let reqAll = $(`#${baseId}_reqAll`).is(":checked").toString();
      let reqNot = $(`#${baseId}_reqNot`).is(":checked").toString();
      let reqItemsNot = $(`#${baseId}_itemsNot`).is(":checked").toString();
      let reqContainersNot = $(`#${baseId}_containersNot`).is(":checked").toString();
      let reqLocalNot = $(`#${baseId}_localNot`).is(":checked").toString();
      let reqGlobalNot = $(`#${baseId}_globalNot`).is(":checked").toString();
      let preActionNot = $(`#${baseId}_preActionNot`).is(":checked").toString();
      let locVisitsNot = $(`#${baseId}_visitsNot`).is(":checked").toString();
      let preNodeNot = $(`#${baseId}_preNodeNot`).is(":checked").toString();
      let itemEvosNot = $(`#${baseId}_evosNot`).is(":checked").toString();
      let pastDesNot = $(`#${baseId}_pastDesNot`).is(":checked").toString();
      let reqChanceNot = $(`#${baseId}_reqChanceNot`).is(":checked").toString();
      let reqFailsNot = $(`#${baseId}_reqFailsNot`).is(":checked").toString();
      let reqValidsNot = $(`#${baseId}_reqValidsNot`).is(":checked").toString();
      let reqItems = $(`#${baseId}_Items`).val();
      let reqContainers = $(`#${baseId}_Containers`).val();
      let reqLocal = $(`#${baseId}_Local`).val();
      let reqGlobal = $(`#${baseId}_Global`).val();
      let preAction = $(`#${baseId}_preAction`).val();
      let locVisits = $(`#${baseId}_Visits`).val();
      let preNode = $(`#${baseId}_preNode`).val();
      let itemEvos = $(`#${baseId}_Evos`).val();
      let pastDes = $(`#${baseId}_pastDes`).val();
      let reqChance = $(`#${baseId}_reqChance`).val();
      let reqFails;
      if ($(`#${baseId}_reqFailsCheck`).is(":checked")) {
        reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(), "consecutive": "true"};
      } else {
        reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(), "consecutive": "false"};
      }
      let reqValids;
      if ($(`#${baseId}_reqValidsCheck`).is(":checked")) {
        reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(), "consecutive": "true"};
      } else {
        reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(), "consecutive": "false"};
      }
      let evoDes = $(`#${baseId}_Des`).val();
      let evo = {
        reqAll: reqAll,
        reqNot: reqNot,
        reqItems: reqItems,
        reqItemsNot: reqItemsNot,
        reqContainers: reqContainers,
        reqContainersNot: reqContainersNot,
        reqLocal: reqLocal,
        reqLocalNot: reqLocalNot,
        reqGlobal: reqGlobal,
        reqGlobalNot: reqGlobalNot,
        preAction: preAction,
        preActionNot: preActionNot,
        locVisits: locVisits,
        locVisitsNot: locVisitsNot,
        preNode: preNode,
        preNodeNot: preNodeNot,
        itemEvos: itemEvos,
        itemEvosNot: itemEvosNot,
        pastDes: pastDes,
        pastDesNot: pastDesNot,
        reqChance: reqChance,
        reqChanceNot: reqChanceNot,
        reqFails: reqFails,
        reqFailsNot: reqFailsNot,
        reqValids: reqValids,
        reqValidsNot: reqValidsNot,
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
    let reqNot = $(`#${baseId}_reqNot`).is(":checked").toString();
    let reqItemsNot = $(`#${baseId}_itemsNot`).is(":checked").toString();
    let reqContainersNot = $(`#${baseId}_containersNot`).is(":checked").toString();
    let reqLocalNot = $(`#${baseId}_localNot`).is(":checked").toString();
    let reqGlobalNot = $(`#${baseId}_globalNot`).is(":checked").toString();
    let preActionNot = $(`#${baseId}_preActionNot`).is(":checked").toString();
    let locVisitsNot = $(`#${baseId}_visitsNot`).is(":checked").toString();
    let preNodeNot = $(`#${baseId}_preNodeNot`).is(":checked").toString();
    let itemEvosNot = $(`#${baseId}_evosNot`).is(":checked").toString();
    let pastDesNot = $(`#${baseId}_pastDesNot`).is(":checked").toString();
    let reqChanceNot = $(`#${baseId}_reqChanceNot`).is(":checked").toString();
    let reqFailsNot = $(`#${baseId}_reqFailsNot`).is(":checked").toString();
    let reqValidsNot = $(`#${baseId}_reqValidsNot`).is(":checked").toString();
    let reqItems = $(`#${baseId}_Items`).val();
    let reqContainers = $(`#${baseId}_Containers`).val();
    let reqLocal = $(`#${baseId}_Local`).val();
    let reqGlobal = $(`#${baseId}_Global`).val();
    let preAction = $(`#${baseId}_preAction`).val();
    let locVisits = $(`#${baseId}_Visits`).val();
    let preNode = $(`#${baseId}_preNode`).val();
    let itemEvos = $(`#${baseId}_Evos`).val();
    let pastDes = $(`#${baseId}_pastDes`).val();
    let reqChance = $(`#${baseId}_reqChance`).val();
    let reqFails;
    if ($(`#${baseId}_reqFailsCheck`).is(":checked")) {
      reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(), "consecutive": "true"};
    } else {
      reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(), "consecutive": "false"};
    }
    let reqValids;
    if ($(`#${baseId}_reqValidsCheck`).is(":checked")) {
      reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(), "consecutive": "true"};
    } else {
      reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(), "consecutive": "false"};
    }
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
      reqNot: reqNot,
      reqItems: reqItems,
      reqItemsNot: reqItemsNot,
      reqContainers: reqContainers,
      reqContainersNot: reqContainersNot,
      reqLocal: reqLocal,
      reqLocalNot: reqLocalNot,
      reqGlobal: reqGlobal,
      reqGlobalNot: reqGlobalNot,
      preAction: preAction,
      preActionNot: preActionNot,
      locVisits: locVisits,
      locVisitsNot: locVisitsNot,
      preNode: preNode,
      preNodeNot: preNodeNot,
      itemEvos: itemEvos,
      itemEvosNot: itemEvosNot,
      pastDes: pastDes,
      pastDesNot: pastDesNot,
      reqChance: reqChance,
      reqChanceNot: reqChanceNot,
      reqFails: reqFails,
      reqFailsNot: reqFailsNot,
      reqValids: reqValids,
      reqValidsNot: reqValidsNot
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
      let reqNot = $(`#${direction}_reqNot`).is(":checked").toString();
      let reqItemsNot = $(`#${direction}_itemsNot`).is(":checked").toString();
      let reqContainersNot = $(`#${direction}_containersNot`).is(":checked").toString();
      let reqLocalNot = $(`#${direction}_localNot`).is(":checked").toString();
      let reqGlobalNot = $(`#${direction}_globalNot`).is(":checked").toString();
      let preActionNot = $(`#${direction}_preActionNot`).is(":checked").toString();
      let locVisitsNot = $(`#${direction}_visitsNot`).is(":checked").toString();
      let preNodeNot = $(`#${direction}_preNodeNot`).is(":checked").toString();
      let itemEvosNot = $(`#${direction}_evosNot`).is(":checked").toString();
      let pastDesNot = $(`#${direction}_pastDesNot`).is(":checked").toString();
      let reqChanceNot = $(`#${direction}_reqChanceNot`).is(":checked").toString();
      let reqFailsNot = $(`#${direction}_reqFailsNot`).is(":checked").toString();
      let reqValidsNot = $(`#${direction}_reqValidsNot`).is(":checked").toString();
      let reqItems = $(`#${direction}_Items`).val();
      let reqContainers = $(`#${direction}_Containers`).val();
      let reqLocal = $(`#${direction}_Local`).val();
      let reqGlobal = $(`#${direction}_Global`).val();
      let preAction = $(`#${direction}_preAction`).val();
      let locVisits = $(`#${direction}_Visits`).val();
      let preNode = $(`#${direction}_preNode`).val();
      let itemEvos = $(`#${direction}_Evos`).val();
      let pastDes = $(`#${direction}_pastDes`).val();
      let reqChance = $(`#${direction}_reqChance`).val();
      
      let reqFails;
      if ($(`#${direction}_reqFailsCheck`).is(":checked")) {
        reqFails = {"reqFails":$(`#${direction}_reqFails`).val(), "consecutive":"true"};
      } else {
        reqFails = {"reqFails":$(`#${direction}_reqFails`).val(), "consecutive":"false"};
      }
      let reqValids;
      if ($(`#${direction}_reqValidsCheck`).is(":checked")) {
        reqValids = {"reqValids":$(`#${direction}_reqValids`).val(), "consecutive":"true"};
      } else {
        reqValids = {"reqValids":$(`#${direction}_reqValids`).val(), "consecutive":"false"};
      }

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
        reqNot: reqNot,
        reqItems: reqItems,
        reqItemsNot: reqItemsNot,
        reqContainers: reqContainers,
        reqContainersNot: reqContainersNot,
        reqLocal: reqLocal,
        reqLocalNot: reqLocalNot,
        reqGlobal: reqGlobal,
        reqGlobalNot: reqGlobalNot,
        preAction: preAction,
        preActionNot: preActionNot,
        locVisits: locVisits,
        locVisitsNot: locVisitsNot,
        preNode: preNode,
        preNodeNot: preNodeNot,
        itemEvos: itemEvos,
        itemEvosNot: itemEvosNot,
        pastDes: pastDes,
        pastDesNot: pastDesNot,
        reqChance: reqChance,
        reqChanceNot: reqChanceNot,
        reqFails: reqFails,
        reqFailsNot: reqFailsNot,
        reqValids: reqValids,
        reqValidsNot: reqValidsNot
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
      let reqNot = $(`#${baseId}_reqNot`).is(":checked").toString();
      let reqItemsNot = $(`#${baseId}_itemsNot`).is(":checked").toString();
      let reqContainersNot = $(`#${baseId}_containersNot`).is(":checked").toString();
      let reqLocalNot = $(`#${baseId}_localNot`).is(":checked").toString();
      let reqGlobalNot = $(`#${baseId}_globalNot`).is(":checked").toString();
      let preActionNot = $(`#${baseId}_preActionNot`).is(":checked").toString();
      let locVisitsNot = $(`#${baseId}_visitsNot`).is(":checked").toString();
      let preNodeNot = $(`#${baseId}_preNodeNot`).is(":checked").toString();
      let itemEvosNot = $(`#${baseId}_evosNot`).is(":checked").toString();
      let pastDesNot = $(`#${baseId}_pastDesNot`).is(":checked").toString();
      let reqChanceNot = $(`#${baseId}_reqChanceNot`).is(":checked").toString();
      let reqFailsNot = $(`#${baseId}_reqFailsNot`).is(":checked").toString();
      let reqValidsNot = $(`#${baseId}_reqValidsNot`).is(":checked").toString();
      let reqItems = $(`#${baseId}_Items`).val();
      let reqContainers = $(`#${baseId}_Containers`).val();
      let reqLocal = $(`#${baseId}_Local`).val();
      let reqGlobal = $(`#${baseId}_Global`).val();
      let preAction = $(`#${baseId}_preAction`).val();
      let locVisits = $(`#${baseId}_Visits`).val();
      let preNode = $(`#${baseId}_preNode`).val();
      let itemEvos = $(`#${baseId}_Evos`).val();
      let pastDes = $(`#${baseId}_pastDes`).val();
      let reqChance = $(`#${baseId}_reqChance`).val();
      let reqFails;
      if ($(`#${baseId}_reqFailsCheck`).is(":checked")) {
        reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(),
                    "consecutive": "true"};
      } else {
        reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(),
                    "consecutive": "false"};
      }
      let reqValids;
      if ($(`#${baseId}_reqValidsCheck`).is(":checked")) {
        reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(),
                    "consecutive": "true"};
      } else {
        reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(),
                    "consecutive": "false"};
      }
      let evoDes = $(`#${baseId}_Des`).val();

      let evo = {
        reqAll: reqAll,
        reqNot: reqNot,
        reqItems: reqItems,
        reqItemsNot: reqItemsNot,
        reqContainers: reqContainers,
        reqContainersNot: reqContainersNot,
        reqLocal: reqLocal,
        reqLocalNot: reqLocalNot,
        reqGlobal: reqGlobal,
        reqGlobalNot: reqGlobalNot,
        preAction: preAction,
        preActionNot: preActionNot,
        locVisits: locVisits,
        locVisitsNot: locVisitsNot,
        preNode: preNode,
        preNodeNot: preNodeNot,
        itemEvos: itemEvos,
        itemEvosNot: itemEvosNot,
        pastDes: pastDes,
        pastDesNot: pastDesNot,
        reqChance: reqChance,
        reqChanceNot: reqChanceNot,
        reqFails: reqFails,
        reqFailsNot: reqFailsNot,
        reqValids: reqValids,
        reqValidsNot: reqValidsNot,
        evoDes: evoDes,
        passed: "false"
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
    let reqNot = $(`#${itemId}_reqNot`).is(":checked").toString();
    let reqItemsNot = $(`#${itemId}_itemsNot`).is(":checked").toString();
    let reqContainersNot = $(`#${itemId}_containersNot`).is(":checked").toString();
    let reqLocalNot = $(`#${itemId}_localNot`).is(":checked").toString();
    let preActionNot = $(`#${itemId}_preActionNot`).is(":checked").toString();
    let reqGlobalNot = $(`#${itemId}_globalNot`).is(":checked").toString();
    let locVisitsNot = $(`#${itemId}_visitsNot`).is(":checked").toString();
    let preNodeNot = $(`#${itemId}_preNodeNot`).is(":checked").toString();
    let itemEvosNot = $(`#${itemId}_evosNot`).is(":checked").toString();
    let pastDesNot = $(`#${itemId}_pastDesNot`).is(":checked").toString();
    let reqChanceNot = $(`#${itemId}_reqChanceNot`).is(":checked").toString();
    let reqFailsNot = $(`#${itemId}_reqFailsNot`).is(":checked").toString();
    let reqValidsNot = $(`#${itemId}_reqValidsNot`).is(":checked").toString();
    let reqItems = $(`#${itemId}_Items`).val();
    let reqContainers = $(`#${itemId}_Containers`).val();
    let reqLocal = $(`#${itemId}_Local`).val();
    let preAction = $(`#${itemId}_preAction`).val();
    let reqGlobal = $(`#${itemId}_Global`).val();
    let locVisits = $(`#${itemId}_Visits`).val();
    let preNode = $(`#${itemId}_preNode`).val();
    let itemEvos = $(`#${itemId}_Evos`).val();
    let pastDes = $(`#${itemId}_pastDes`).val();
    let reqChance = $(`#${itemId}_reqChance`).val();
    let reqFails;
    if ($(`#${itemId}_reqFailsCheck`).is(":checked")) {
      reqFails = {"reqFails": $(`#${itemId}_reqFails`).val(), "consecutive": "true"};
    } else {
      reqFails = {"reqFails": $(`#${itemId}_reqFails`).val(), "consecutive": "false"};
    }
    let reqValids;
    if ($(`#${itemId}_reqValidsCheck`).is(":checked")) {
      reqValids = {"reqValids": $(`#${itemId}_reqValids`).val(), "consecutive": "true"};
    } else {
      reqValids = {"reqValids": $(`#${itemId}_reqValids`).val(), "consecutive": "false"};
    }
    let item = {
      name: name,
      description: description,
      points: points,
      reqAll: reqAll,
      reqNot: reqNot,
      reqItems: reqItems,
      reqItemsNot: reqItemsNot,
      reqContainers: reqContainers,
      reqContainersNot: reqContainersNot,
      reqLocal: reqLocal,
      reqLocalNot: reqLocalNot,
      reqGlobal: reqGlobal,
      reqGlobalNot: reqGlobalNot,
      preAction: preAction,
      preActionNot: preActionNot,
      locVisits: locVisits,
      locVisitsNot: locVisitsNot,
      preNode: preNode,
      preNodeNot: preNodeNot,
      itemEvos: itemEvos,
      itemEvosNot: itemEvosNot,
      pastDes: pastDes,
      pastDesNot: pastDesNot,
      reqChance: reqChance,
      reqChanceNot: reqChanceNot,
      reqFails: reqFails,
      reqFailsNot: reqFailsNot,
      reqValids: reqValids,
      reqValidsNot: reqValidsNot,
      evos: [],
    };
    let evoDivs = $(`#${itemId}_EvoList`).children();
    let evoListItems = [];
    for (let j = 0; j < evoDivs.length; j++) {
      let baseId = $(evoDivs[j]).attr("id");
      let reqAll = $(`#${baseId}_reqAll`).is(":checked").toString();
      let reqNot = $(`#${baseId}_reqNot`).is(":checked").toString();
      let reqItemsNot = $(`#${baseId}_itemsNot`).is(":checked").toString();
      let reqContainersNot = $(`#${baseId}_containersNot`).is(":checked").toString();
      let reqLocalNot = $(`#${baseId}_localNot`).is(":checked").toString();
      let reqGlobalNot = $(`#${baseId}_globalNot`).is(":checked").toString();
      let preActionNot = $(`#${baseId}_preActionNot`).is(":checked").toString();
      let locVisitsNot = $(`#${baseId}_visitsNot`).is(":checked").toString();
      let preNodeNot = $(`#${baseId}_preNodeNot`).is(":checked").toString();
      let itemEvosNot = $(`#${baseId}_evosNot`).is(":checked").toString();
      let pastDesNot = $(`#${baseId}_pastDesNot`).is(":checked").toString();
      let reqChanceNot = $(`#${baseId}_reqChanceNot`).is(":checked").toString();
      let reqFailsNot = $(`#${baseId}_reqFailsNot`).is(":checked").toString();
      let reqValidsNot = $(`#${baseId}_reqValidsNot`).is(":checked").toString();
      let reqItems = $(`#${baseId}_Items`).val();
      let reqContainers = $(`#${baseId}_Containers`).val();
      let reqLocal = $(`#${baseId}_Local`).val();
      let reqGlobal = $(`#${baseId}_Global`).val();
      let preAction = $(`#${baseId}_preAction`).val();
      let locVisits = $(`#${baseId}_Visits`).val();
      let preNode = $(`#${baseId}_preNode`).val();
      let itemEvos = $(`#${baseId}_Evos`).val();
      let pastDes = $(`#${baseId}_pastDes`).val();
      let reqChance = $(`#${baseId}_reqChance`).val();
      let reqFails;
      if ($(`#${baseId}_reqFailsCheck`).is(":checked")) {
        reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(), "consecutive": "true"};
      } else {
        reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(), "consecutive": "false"};
      }
      let reqValids;
      if ($(`#${baseId}_reqValidsCheck`).is(":checked")) {
        reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(), "consecutive": "true"};
      } else {
        reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(), "consecutive": "false"};
      }
      let evoDes = $(`#${baseId}_Des`).val();
      let evo = {
        reqAll: reqAll,
        reqNot: reqNot,
        reqItems: reqItems,
        reqItemsNot: reqItemsNot,
        reqContainers: reqContainers,
        reqContainersNot: reqContainersNot,
        reqLocal: reqLocal,
        reqLocalNot: reqLocalNot,
        reqGlobal: reqGlobal,
        reqGlobalNot: reqGlobalNot,
        preAction: preAction,
        preActionNot: preActionNot,
        locVisits: locVisits,
        locVisitsNot: locVisitsNot,
        preNode: preNode,
        preNodeNot: preNodeNot,
        itemEvos: itemEvos,
        itemEvosNot: itemEvosNot,
        pastDes: pastDes,
        pastDesNot: pastDesNot,
        reqChance: reqChance,
        reqChanceNot: reqChanceNot,
        reqFails: reqFails,
        reqFailsNot: reqFailsNot,
        reqValids: reqValids,
        reqValidsNot: reqValidsNot,
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
    let reqNot = $(`#${containerId}_reqNot`).is(":checked").toString();
    let reqItemsNot = $(`#${containerId}_itemsNot`).is(":checked").toString();
    let reqContainersNot = $(`#${containerId}_containersNot`).is(":checked").toString();
    let reqLocalNot = $(`#${containerId}_localNot`).is(":checked").toString();
    let reqGlobalNot = $(`#${containerId}_globalNot`).is(":checked").toString();
    let preActionNot = $(`#${containerId}_preActionNot`).is(":checked").toString();
    let locVisitsNot = $(`#${containerId}_visitsNot`).is(":checked").toString();
    let preNodeNot = $(`#${containerId}_preNodeNot`).is(":checked").toString();
    let itemEvosNot = $(`#${containerId}_evosNot`).is(":checked").toString();
    let pastDesNot = $(`#${containerId}_pastDesNot`).is(":checked").toString();
    let reqChanceNot = $(`#${containerId}_reqChanceNot`).is(":checked").toString();
    let reqFailsNot = $(`#${containerId}_reqFailsNot`).is(":checked").toString();
    let reqValidsNot = $(`#${containerId}_reqValidsNot`).is(":checked").toString();
    let reqItems = $(`#${containerId}_Items`).val();
    let reqContainers = $(`#${containerId}_Containers`).val();
    let reqLocal = $(`#${containerId}_Local`).val();
    let reqGlobal = $(`#${containerId}_Global`).val();
    let preAction = $(`#${containerId}_preAction`).val();
    let locVisits = $(`#${containerId}_Visits`).val();
    let preNode = $(`#${containerId}_preNode`).val();
    let itemEvos = $(`#${containerId}_Evos`).val();
    let pastDes = $(`#${containerId}_pastDes`).val();
    let reqChance = $(`#${containerId}_reqChance`).val();
    let reqFails;
    if ($(`#${containerId}_reqFailsCheck`).is(":checked")) {
      reqFails = {"reqFails": $(`#${containerId}_reqFails`).val(), "consecutive": "true"};
    } else {
      reqFails = {"reqFails": $(`#${containerId}_reqFails`).val(), "consecutive": "false"};
    }
    let reqValids;
    if ($(`#${containerId}_reqValidsCheck`).is(":checked")) {
      reqValids = {"reqValids": $(`#${containerId}_reqValids`).val(), "consecutive": "true"};
    } else {
      reqValids = {"reqValids": $(`#${containerId}_reqValids`).val(), "consecutive": "false"};
    }
    let container = {
      name: name,
      capacity: cap,
      items: [],
      complete: complete,
      illegal: illegal,
      points: points,
      reqAll: reqAll,
      reqNot: reqNot,
      reqItems: reqItems,
      reqItemsNot: reqItemsNot,
      reqContainers: reqContainers,
      reqContainersNot: reqContainersNot,
      reqLocal: reqLocal,
      reqLocalNot: reqLocalNot,
      reqGlobal: reqGlobal,
      reqGlobalNot: reqGlobalNot,
      preAction: preAction,
      preActionNot: preActionNot,
      locVisits: locVisits,
      locVisitsNot: locVisitsNot,
      preNode: preNode,
      preNodeNot: preNodeNot,
      itemEvos: itemEvos,
      itemEvosNot: itemEvosNot,
      pastDes: pastDes,
      pastDesNot: pastDesNot,
      reqChance: reqChance,
      reqChanceNot: reqChanceNot,
      reqFails: reqFails,
      reqFailsNot: reqFailsNot,
      reqValids: reqValids,
      reqValidsNot: reqValidsNot
    };
    containersArray.push(container);
  }
  cNode.containers = containersArray;

  //generate actions
  let actionsObject = {
    invalid: "",
    actions: [],
    evos: []
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
    let reqNot = $(`#${baseId}_reqNot`).is(":checked").toString();
    let reqItemsNot = $(`#${baseId}_itemsNot`).is(":checked").toString();
    let reqContainersNot = $(`#${baseId}_containersNot`).is(":checked").toString();
    let reqLocalNot = $(`#${baseId}_localNot`).is(":checked").toString();
    let reqGlobalNot = $(`#${baseId}_globalNot`).is(":checked").toString();
    let preActionNot = $(`#${baseId}_preActionNot`).is(":checked").toString();
    let locVisitsNot = $(`#${baseId}_visitsNot`).is(":checked").toString();
    let preNodeNot = $(`#${baseId}_preNodeNot`).is(":checked").toString();
    let itemEvosNot = $(`#${baseId}_evosNot`).is(":checked").toString();
    let pastDesNot = $(`#${baseId}_pastDesNot`).is(":checked").toString();
    let reqChanceNot = $(`#${baseId}_reqChanceNot`).is(":checked").toString();
    let reqFailsNot = $(`#${baseId}_reqFailsNot`).is(":checked").toString();
    let reqValidsNot =$(`#${baseId}_reqValidsNot`).is(":checked").toString();
    let reqItems = $(`#${baseId}_Items`).val();
    let reqContainers = $(`#${baseId}_Containers`).val();
    let reqLocal = $(`#${baseId}_Local`).val();
    let reqGlobal = $(`#${baseId}_Global`).val();
    let preAction = $(`#${baseId}_preAction`).val();
    let locVisits = $(`#${baseId}_Visits`).val();
    let preNode = $(`#${baseId}_preNode`).val();
    let itemEvos = $(`#${baseId}_Evos`).val();
    let pastDes = $(`#${baseId}_pastDes`).val();
    let reqChance = $(`#${baseId}_reqChance`).val();
    let reqFails;
    if ($(`#${baseId}_reqFailsCheck`).is(":checked")) {
      reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(), "consecutive": "true"};
    } else {
      reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(), "consecutive": "false"};
    }
    let reqValids;
    if ($(`#${baseId}_reqValidsCheck`).is(":checked")) {
      reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(), "consecutive": "true"};
    } else {
      reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(), "consecutive": "false"};
    }

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
      reqNot: reqNot,
      reqItems: reqItems,
      reqItemsNot: reqItemsNot,
      reqContainers: reqContainers,
      reqContainersNot: reqContainersNot,
      reqLocal: reqLocal,
      reqLocalNot: reqLocalNot,
      reqGlobal: reqGlobal,
      reqGlobalNot: reqGlobalNot,
      preAction: preAction,
      preActionNot: preActionNot,
      locVisits: locVisits,
      locVisitsNot: locVisitsNot,
      preNode: preNode,
      preNodeNot: preNodeNot,
      itemEvos: itemEvos,
      itemEvosNot: itemEvosNot,
      pastDes: pastDes,
      pastDesNot: pastDesNot,
      reqChance: reqChance,
      reqChanceNot: reqChanceNot,
      reqFails: reqFails,
      reqFailsNot: reqFailsNot,
      reqValids: reqValids,
      reqValidsNot: reqValidsNot
    };
    actionArray.push(action);
  }
  //Invalid Action Evolutions
  let evoListInvalids = $("#evoListInvalids").children();
  if (evoListInvalids.length > 0) {
    for (let i = 0; i < evoListInvalids.length; i++) {
      let baseId = $(evoListInvalids[i]).attr("id");
      let reqAll = $(`#${baseId}_reqAll`).is(":checked").toString();
      let reqNot = $(`#${baseId}_reqNot`).is(":checked").toString();
      let reqItemsNot = $(`#${baseId}_itemsNot`).is(":checked").toString();
      let reqContainersNot = $(`#${baseId}_containersNot`).is(":checked").toString();
      let reqLocalNot = $(`#${baseId}_localNot`).is(":checked").toString();
      let reqGlobalNot = $(`#${baseId}_globalNot`).is(":checked").toString();
      let preActionNot = $(`#${baseId}_preActionNot`).is(":checked").toString();
      let locVisitsNot = $(`#${baseId}_visitsNot`).is(":checked").toString();
      let preNodeNot = $(`#${baseId}_preNodeNot`).is(":checked").toString();
      let itemEvosNot = $(`#${baseId}_evosNot`).is(":checked").toString();
      let pastDesNot = $(`#${baseId}_pastDesNot`).is(":checked").toString();
      let reqChanceNot = $(`#${baseId}_reqChanceNot`).is(":checked").toString();
      let reqFailsNot = $(`#${baseId}_reqFailsNot`).is(":checked").toString();
      let reqValidsNot = $(`#${baseId}_reqValidsNot`).is(":checked").toString();
      let reqItems = $(`#${baseId}_Items`).val();
      let reqContainers = $(`#${baseId}_Containers`).val();
      let reqLocal = $(`#${baseId}_Local`).val();
      let reqGlobal = $(`#${baseId}_Global`).val();
      let preAction = $(`#${baseId}_preAction`).val();
      let locVisits = $(`#${baseId}_Visits`).val();
      let preNode = $(`#${baseId}_preNode`).val();
      let itemEvos = $(`#${baseId}_Evos`).val();
      let pastDes = $(`#${baseId}_pastDes`).val();
      let reqChance = $(`#${baseId}_reqChance`).val();
      let reqFails;
      if ($(`#${baseId}_reqFailsCheck`).is(":checked")) {
        reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(),
                    "consecutive": "true"};
      } else {
        reqFails = {"reqFails": $(`#${baseId}_reqFails`).val(),
                    "consecutive": "false"};
      }
      let reqValids;
      if ($(`#${baseId}_reqValidsCheck`).is(":checked")) {
        reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(),
                    "consecutive": "true"};
      } else {
        reqValids = {"reqValids": $(`#${baseId}_reqValids`).val(),
                    "consecutive": "false"};
      }
      let evoDes = $(`#${baseId}_Des`).val();

      let evo = {
        reqAll: reqAll,
        reqNot: reqNot,
        reqItems: reqItems,
        reqItemsNot: reqItemsNot,
        reqContainers: reqContainers,
        reqContainersNot: reqContainersNot,
        reqLocal: reqLocal,
        reqLocalNot: reqLocalNot,
        reqGlobal: reqGlobal,
        reqGlobalNot: reqGlobalNot,
        preAction: preAction,
        preActionNot: preActionNot,
        locVisits: locVisits,
        locVisitsNot: locVisitsNot,
        preNode: preNode,
        preNodeNot: preNodeNot,
        itemEvos: itemEvos,
        itemEvosNot: itemEvosNot,
        pastDes: pastDes,
        pastDesNot: pastDesNot,
        reqChance: reqChance,
        reqChanceNot: reqChanceNot,
        reqFails: reqFails,
        reqFailsNot: reqFailsNot,
        reqValids: reqValids,
        reqValidsNot: reqValidsNot,
        evoDes: evoDes
      };
      actionsObject.evos.push(evo);
    }
  }

  actionsObject.actions = actionArray;
  actionsObject.invalid = invalidAction;
  cNode.actions = JSON.parse(JSON.stringify(actionsObject));

  //generate win
  let winDes = $("#winDes").val();
  let winReqAll = $("#win_reqAll").is(":checked").toString();
  let winReqNot = $("#win_reqNot").is(":checked").toString();
  let winReqItemsNot = $("#win_itemsNot").is(":checked").toString();
  let winReqContainersNot = $("#win_containersNot").is(":checked").toString();
  let winReqLocalNot = $("#win_localNot").is(":checked").toString();
  let winReqGlobalNot = $("#win_globalNot").is(":checked").toString();
  let winPreActionNot = $("#win_preActionNot").is(":checked").toString();
  let winLocVisitsNot = $("#win_visitsNot").is(":checked").toString();
  let winPreNodeNot = $("#win_preNodeNot").is(":checked").toString();
  let winItemEvosNot = $("#win_evosNot").is(":checked").toString();
  let winPastDesNot = $("#win_pastDesNot").is(":checked").toString();
  let winReqChanceNot = $(`#win_reqChanceNot`).is(":checked").toString();
  let winReqFailsNot = $("#win_reqFailsNot").is(":checked").toString();
  let winReqValidsNot = $("#win_reqValidsNot").is(":checked").toString();
  let winReqItems = $("#win_Items").val();
  let winReqContainers = $("#win_Containers").val();
  let winReqLocal = $("#win_Local").val();
  let winReqGlobal = $("#win_Global").val();
  let winPreAction = $("#win_preAction").val();
  let winLocVisits = $("#win_Visits").val();
  let winPreNode = $("#win_preNode").val();
  let winItemEvos = $("#win_Evos").val();
  let winPastDes = $("#win_pastDes").val();
  let winReqChance = $(`#win_reqChance`).val();
  let winReqFails;
  if ($("#win_reqFailsCheck").is(":checked")) {
    winReqFails = {"reqFails": $("#win_reqFails").val(), "consecutive": "true"};
  } else {
    winReqFails = {"reqFails": $("#win_reqFails").val(), "consecutive": "false"};
  }
  let winReqValids;
  if ($("#win_reqValidsCheck").is(":checked")) {
    winReqValids = {"reqValids": $("#win_reqValids").val(), "consecutive": "true"};
  } else {
    winReqValids = {"reqValids": $("#win_reqValids").val(), "consecutive": "false"};
  }
  let win = {
    description: winDes,
    reqAll: winReqAll,
    reqNot: winReqNot,
    reqItems: winReqItems,
    reqItemsNot: winReqItemsNot,
    reqContainers: winReqContainers,
    reqContainersNot: winReqContainersNot,
    reqLocal: winReqLocal,
    reqLocalNot: winReqLocalNot,
    reqGlobal: winReqGlobal,
    reqGlobalNot: winReqGlobalNot,
    preAction: winPreAction,
    preActionNot: winPreActionNot,
    locVisits: winLocVisits,
    locVisitsNot: winLocVisitsNot,
    preNode: winPreNode,
    preNodeNot: winPreNodeNot,
    itemEvos: winItemEvos,
    itemEvosNot: winItemEvosNot,
    pastDes: winPastDes,
    pastDesNot: winPastDesNot,
    reqChance: winReqChance,
    reqChanceNot: winReqChanceNot,
    reqFails: winReqFails,
    reqFailsNot: winReqFailsNot,
    reqValids: winReqValids,
    reqValidsNot: winReqValidsNot
  };
  cNode.win = win;

  //generate lose
  let loseDes = $("#loseDes").val();
  let loseReqAll = $("#lose_reqAll").is(":checked").toString();
  let loseReqNot = $("#lose_reqNot").is(":checked").toString();
  let loseReqItemsNot = $("#lose_itemsNot").is(":checked").toString();
  let loseReqContainersNot = $("#lose_containersNot").is(":checked").toString();
  let loseReqLocalNot = $("#lose_localNot").is(":checked").toString();
  let loseReqGlobalNot = $("#lose_globalNot").is(":checked").toString();
  let losePreActionNot = $("#lose_preActionNot").is(":checked").toString();
  let loseLocVisitsNot = $("#lose_visitsNot").is(":checked").toString();
  let losePreNodeNot = $("#lose_preNodeNot").is(":checked").toString();
  let loseItemEvosNot = $("#lose_evosNot").is(":checked").toString();
  let losePastDesNot = $("#lose_pastDesNot").is(":checked").toString();
  let loseReqChanceNot = $(`#lose_reqChanceNot`).is(":checked").toString();
  let loseReqFailsNot = $("#lose_reqFailsNot").is(":checked").toString();
  let loseReqValidsNot = $("#lose_reqValidsNot").is(":checked").toString();
  let loseReqItems = $("#lose_Items").val();
  let loseReqContainers = $("#lose_Containers").val();
  let loseReqLocal = $("#lose_Local").val();
  let loseReqGlobal = $("#lose_Global").val();
  let losePreAction = $("#lose_preAction").val();
  let loseLocVisits = $("#lose_Visits").val();
  let losePreNode = $("#lose_preNode").val();
  let loseItemEvos = $("#lose_Evos").val();
  let losePastDes = $("#lose_pastDes").val();
  let loseReqChance = $(`#lose_reqChance`).val();
  let loseReqFails;
  if ($("#lose_reqFailsCheck").is(":checked")) {
    loseReqFails = {"reqFails": $("#lose_reqFails").val(), "consecutive": "true"};
  } else {
    loseReqFails = {"reqFails": $("#lose_reqFails").val(), "consecutive": "false"};
  }
  let loseReqValids;
  if ($("#lose_reqValidsCheck").is(":checked")) {
    loseReqValids = {"reqValids": $("#lose_reqValids").val(), "consecutive": "true"};
  } else {
    loseReqValids = {"reqValids": $("#lose_reqValids").val(), "consecutive": "false"};
  }
  let lose = {
    description: loseDes,
    reqAll: loseReqAll,
    reqNot: loseReqNot,
    reqItems: loseReqItems,
    reqItemsNot: loseReqItemsNot,
    reqContainers: loseReqContainers,
    reqContainersNot: loseReqContainersNot,
    reqLocal: loseReqLocal,
    reqLocalNot: loseReqLocalNot,
    reqGlobal: loseReqGlobal,
    reqGlobalNot: loseReqGlobalNot,
    preAction: losePreAction,
    preActionNot: losePreActionNot,
    locVisits: loseLocVisits,
    locVisitsNot: loseLocVisitsNot,
    preNode: losePreNode,
    preNodeNot: losePreNodeNot,
    itemEvos: loseItemEvos,
    itemEvosNot: loseItemEvosNot,
    pastDes: losePastDes,
    pastDesNot: losePastDesNot,
    reqChance: loseReqChance,
    reqChanceNot: loseReqChanceNot,
    reqFails: loseReqFails,
    reqFailsNot: loseReqFailsNot,
    reqValids: loseReqValids,
    reqValidsNot: loseReqValidsNot
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
  IFID,
  globalActions,
  initItems,
  customDeposits,
  customWithdrawals,
  customTakes,
  customDrops,
  customIgnorables,
  customLooks,
  customExamines,
  game,
  node,
  switchNode,
  saveGame,
  loadGame,
  deleteNode,
  startGameSim,
  saveGlobalActions,
  saveInitItems
};
