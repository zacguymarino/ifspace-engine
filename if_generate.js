import { loadDomFromNode, loadDomGlobalActions, loadDomInitItems, loadDomCustomCommands, changeStyle, loadDomMonitors, loadDomGlobalWin, loadDomGlobalLose } from "./if_dom.js";
import { createMapFromGame, draw } from "./if_nodemap.js";

var game = {};
var gameTitle;
var gameStyle;
var gameStatus;
var gameRating;
var gameAuthor;
var IFID;
var globalActions = [];
var monitors = [];
var initItems = [];
var customDeposits;
var customWithdrawals;
var customTakes;
var customDrops;
var customIgnorables;
var customLooks;
var customExamines;
var globalWin = [];
var globalLose = [];

var node = {
  name: "",
  location: [0,0,0],
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
  color: "0"
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
  saveMonitors();
  saveGlobalWin();
  saveGlobalLose();
  gameFile['gameStyle'] = $("#gameStyle").val();
  gameFile['gameStatus'] = $("#gameStatus").val();
  gameFile['gameRating'] = $("#gameRating").val();
  gameFile['gameAuthor'] = $("#gameAuthor").val();
  gameFile['IFID'] = generateIFID();
  gameFile['gameTitle'] = gameTitle;
  gameFile['globalActions'] = globalActions;
  gameFile['monitors'] = monitors;
  gameFile['initItems'] = initItems;
  gameFile['customDeposits'] = customDeposits;
  gameFile['customWithdrawals'] = customWithdrawals;
  gameFile['customTakes'] = customTakes;
  gameFile['customDrops'] = customDrops;
  gameFile['customIgnorables'] = customIgnorables;
  gameFile['customLooks'] = customLooks;
  gameFile['customExamines'] = customExamines;
  gameFile['globalWin'] = globalWin;
  gameFile['globalLose'] = globalLose;
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
    monitors = loadData['monitors'];
    initItems = loadData['initItems'];
    customDeposits = loadData['customDeposits'];
    customWithdrawals = loadData['customWithdrawals'];
    customTakes = loadData['customTakes'];
    customDrops = loadData['customDrops'];
    customIgnorables = loadData['customIgnorables'];
    customLooks = loadData['customLooks'];
    customExamines = loadData['customExamines'];
    globalWin = loadData['globalWin'];
    globalLose = loadData['globalLose'];
    game = loadData['gameContent'];
    cNode = loadData['gameContent']['0,0,0'];
    loadDomCustomCommands();
    loadDomInitItems(initItems);
    loadDomGlobalActions(globalActions);
    loadDomGlobalWin(globalWin);
    loadDomGlobalLose(globalLose);
    loadDomMonitors(monitors);
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
    let primaryUse = $(`#${itemId}_primaryUse`).val();
    let points = $(`#${itemId}_Points`).val();
    let itemEvos = $(`#${itemId}_Evos`).val();
    let item = {
      name: name,
      description: description,
      primaryUse: primaryUse,
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
      let reqMonitorsNot = $(`#${baseId}_reqMonitorsNot`).is(":checked").toString();
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
      let reqMonitors = {"reqMonitors": $(`#${baseId}_reqMonitors`).val(),
                        "lessThan": $(`#${baseId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${baseId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
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
        reqMonitorsNot: reqMonitorsNot,
        reqMonitors: reqMonitors
      };
      evoListItems.push(evo);
    }
    item.evos = evoListItems;
    itemArray.push(item);
  }
  initItems = itemArray;
}

function saveGlobalWin() {
  let globalWinArray = [];
  let globalWinList = $("#globalWinList").children();
  for (let i = 0; i < globalWinList.length; i++) {
    let globalWinId = $(globalWinList[i]).attr("id");
    //generate win
    let globalWinDes = $(`#${globalWinId}_globalWinDes`).val();
    let globalWinReqAll = $(`#${globalWinId}_reqAll`).is(":checked").toString();
    let globalWinReqNot = $(`#${globalWinId}_reqNot`).is(":checked").toString();
    let globalWinReqItemsNot = $(`#${globalWinId}_itemsNot`).is(":checked").toString();
    let globalWinReqContainersNot = $(`#${globalWinId}_containersNot`).is(":checked").toString();
    let globalWinReqLocalNot = $(`#${globalWinId}_localNot`).is(":checked").toString();
    let globalWinReqGlobalNot = $(`#${globalWinId}_globalNot`).is(":checked").toString();
    let globalWinPreActionNot = $(`#${globalWinId}_preActionNot`).is(":checked").toString();
    let globalWinLocVisitsNot = $(`#${globalWinId}_visitsNot`).is(":checked").toString();
    let globalWinPreNodeNot = $(`#${globalWinId}_preNodeNot`).is(":checked").toString();
    let globalWinItemEvosNot = $(`#${globalWinId}_evosNot`).is(":checked").toString();
    let globalWinPastDesNot = $(`#${globalWinId}_pastDesNot`).is(":checked").toString();
    let globalWinReqChanceNot = $(`#${globalWinId}_reqChanceNot`).is(":checked").toString();
    let globalWinReqMonitorsNot = $(`#${globalWinId}_reqMonitorsNot`).is(":checked").toString();
    let globalWinReqFailsNot = $(`#${globalWinId}_reqFailsNot`).is(":checked").toString();
    let globalWinReqValidsNot = $(`#${globalWinId}_reqValidsNot`).is(":checked").toString();
    let globalWinReqItems = $(`#${globalWinId}_Items`).val();
    let globalWinReqContainers = $(`#${globalWinId}_Containers`).val();
    let globalWinReqLocal = $(`#${globalWinId}_Local`).val();
    let globalWinReqGlobal = $(`#${globalWinId}_Global`).val();
    let globalWinPreAction = $(`#${globalWinId}_preAction`).val();
    let globalWinLocVisits = $(`#${globalWinId}_Visits`).val();
    let globalWinPreNode = $(`#${globalWinId}_preNode`).val();
    let globalWinItemEvos = $(`#${globalWinId}_Evos`).val();
    let globalWinPastDes = $(`#${globalWinId}_pastDes`).val();
    let globalWinReqChance = $(`#${globalWinId}_reqChance`).val();
    let globalWinReqFails;
    if ($(`#${globalWinId}_reqFailsCheck`).is(":checked")) {
      globalWinReqFails = {"reqFails": $(`#${globalWinId}_reqFails`).val(), "consecutive": "true"};
    } else {
      globalWinReqFails = {"reqFails": $(`#${globalWinId}_reqFails`).val(), "consecutive": "false"};
    }
    let globalWinReqValids;
    if ($(`#${globalWinId}_reqValidsCheck`).is(":checked")) {
      globalWinReqValids = {"reqValids": $(`#${globalWinId}_reqValids`).val(), "consecutive": "true"};
    } else {
      globalWinReqValids = {"reqValids": $(`#${globalWinId}_reqValids`).val(), "consecutive": "false"};
    }
    let globalWinReqMonitors = {"reqMonitors": $(`#${globalWinId}_reqMonitors`).val(),
                          "lessThan": $(`#${globalWinId}_reqMonitorsLessThan`).is(":checked").toString(),
                          "greaterThan": $(`#${globalWinId}_reqMonitorsGreaterThan`).is(":checked").toString()
                        };
    let win = {
      description: globalWinDes,
      reqAll: globalWinReqAll,
      reqNot: globalWinReqNot,
      reqItems: globalWinReqItems,
      reqItemsNot: globalWinReqItemsNot,
      reqContainers: globalWinReqContainers,
      reqContainersNot: globalWinReqContainersNot,
      reqLocal: globalWinReqLocal,
      reqLocalNot: globalWinReqLocalNot,
      reqGlobal: globalWinReqGlobal,
      reqGlobalNot: globalWinReqGlobalNot,
      preAction: globalWinPreAction,
      preActionNot: globalWinPreActionNot,
      locVisits: globalWinLocVisits,
      locVisitsNot: globalWinLocVisitsNot,
      preNode: globalWinPreNode,
      preNodeNot: globalWinPreNodeNot,
      itemEvos: globalWinItemEvos,
      itemEvosNot: globalWinItemEvosNot,
      pastDes: globalWinPastDes,
      pastDesNot: globalWinPastDesNot,
      reqChance: globalWinReqChance,
      reqChanceNot: globalWinReqChanceNot,
      reqFails: globalWinReqFails,
      reqFailsNot: globalWinReqFailsNot,
      reqValids: globalWinReqValids,
      reqValidsNot: globalWinReqValidsNot,
      reqMonitors: globalWinReqMonitors,
      reqMonitorsNot: globalWinReqMonitorsNot
    };
    globalWinArray.push(win);
  }
  globalWin = globalWinArray;
}

function saveGlobalLose() {
  let globalLoseArray = [];
  let globalLoseList = $(`#globalLoseList`).children();
  for (let i = 0; i < globalLoseList.length; i++) {
    let globalLoseId = $(globalLoseList[i]).attr("id");
    //generate lose
    let globalLoseDes = $(`#${globalLoseId}_globalLoseDes`).val();
    let globalLoseReqAll = $(`#${globalLoseId}_reqAll`).is(":checked").toString();
    let globalLoseReqNot = $(`#${globalLoseId}_reqNot`).is(":checked").toString();
    let globalLoseReqItemsNot = $(`#${globalLoseId}_itemsNot`).is(":checked").toString();
    let globalLoseReqContainersNot = $(`#${globalLoseId}_containersNot`).is(":checked").toString();
    let globalLoseReqLocalNot = $(`#${globalLoseId}_localNot`).is(":checked").toString();
    let globalLoseReqGlobalNot = $(`#${globalLoseId}_globalNot`).is(":checked").toString();
    let globalLosePreActionNot = $(`#${globalLoseId}_preActionNot`).is(":checked").toString();
    let globalLoseLocVisitsNot = $(`#${globalLoseId}_visitsNot`).is(":checked").toString();
    let globalLosePreNodeNot = $(`#${globalLoseId}_preNodeNot`).is(":checked").toString();
    let globalLoseItemEvosNot = $(`#${globalLoseId}_evosNot`).is(":checked").toString();
    let globalLosePastDesNot = $(`#${globalLoseId}_pastDesNot`).is(":checked").toString();
    let globalLoseReqChanceNot = $(`#${globalLoseId}_reqChanceNot`).is(":checked").toString();
    let globalLoseReqMonitorsNot = $(`#${globalLoseId}_reqMonitorsNot`).is(":checked").toString();
    let globalLoseReqFailsNot = $(`#${globalLoseId}_reqFailsNot`).is(":checked").toString();
    let globalLoseReqValidsNot = $(`#${globalLoseId}_reqValidsNot`).is(":checked").toString();
    let globalLoseReqItems = $(`#${globalLoseId}_Items`).val();
    let globalLoseReqContainers = $(`#${globalLoseId}_Containers`).val();
    let globalLoseReqLocal = $(`#${globalLoseId}_Local`).val();
    let globalLoseReqGlobal = $(`#${globalLoseId}_Global`).val();
    let globalLosePreAction = $(`#${globalLoseId}_preAction`).val();
    let globalLoseLocVisits = $(`#${globalLoseId}_Visits`).val();
    let globalLosePreNode = $(`#${globalLoseId}_preNode`).val();
    let globalLoseItemEvos = $(`#${globalLoseId}_Evos`).val();
    let globalLosePastDes = $(`#${globalLoseId}_pastDes`).val();
    let globalLoseReqChance = $(`#${globalLoseId}_reqChance`).val();
    let globalLoseReqFails;
    if ($(`#${globalLoseId}_reqFailsCheck`).is(":checked")) {
      globalLoseReqFails = {"reqFails": $(`#${globalLoseId}_reqFails`).val(), "consecutive": "true"};
    } else {
      globalLoseReqFails = {"reqFails": $(`#${globalLoseId}_reqFails`).val(), "consecutive": "false"};
    }
    let globalLoseReqValids;
    if ($(`#${globalLoseId}_reqValidsCheck`).is(":checked")) {
      globalLoseReqValids = {"reqValids": $(`#${globalLoseId}_reqValids`).val(), "consecutive": "true"};
    } else {
      globalLoseReqValids = {"reqValids": $(`#${globalLoseId}_reqValids`).val(), "consecutive": "false"};
    }
    let globalLoseReqMonitors = {"reqMonitors": $(`#${globalLoseId}_reqMonitors`).val(),
                          "lessThan": $(`#${globalLoseId}_reqMonitorsLessThan`).is(":checked").toString(),
                          "greaterThan": $(`#${globalLoseId}_reqMonitorsGreaterThan`).is(":checked").toString()
                        };
    let lose = {
      description: globalLoseDes,
      reqAll: globalLoseReqAll,
      reqNot: globalLoseReqNot,
      reqItems: globalLoseReqItems,
      reqItemsNot: globalLoseReqItemsNot,
      reqContainers: globalLoseReqContainers,
      reqContainersNot: globalLoseReqContainersNot,
      reqLocal: globalLoseReqLocal,
      reqLocalNot: globalLoseReqLocalNot,
      reqGlobal: globalLoseReqGlobal,
      reqGlobalNot: globalLoseReqGlobalNot,
      preAction: globalLosePreAction,
      preActionNot: globalLosePreActionNot,
      locVisits: globalLoseLocVisits,
      locVisitsNot: globalLoseLocVisitsNot,
      preNode: globalLosePreNode,
      preNodeNot: globalLosePreNodeNot,
      itemEvos: globalLoseItemEvos,
      itemEvosNot: globalLoseItemEvosNot,
      pastDes: globalLosePastDes,
      pastDesNot: globalLosePastDesNot,
      reqChance: globalLoseReqChance,
      reqChanceNot: globalLoseReqChanceNot,
      reqFails: globalLoseReqFails,
      reqFailsNot: globalLoseReqFailsNot,
      reqValids: globalLoseReqValids,
      reqValidsNot: globalLoseReqValidsNot,
      reqMonitors: globalLoseReqMonitors,
      reqMonitorsNot: globalLoseReqMonitorsNot
    };
    globalLoseArray.push(lose);
  }
  globalLose = globalLoseArray;
}

function saveMonitors() {
  let monitorArray = [];
  let monitorList = $("#monitorList").children();
  for (let i = 0; i < monitorList.length; i++) {
    let monitorId = $(monitorList[i]).attr("id");
    let monitor = $(`#${monitorId}_Monitor`).val();
    let initial = $(`#${monitorId}_Initial`).val();
    let onStart = $(`#${monitorId}_onStart`).is(":checked").toString();
    let display = $(`#${monitorId}_Display`).is(":checked").toString();
    let onEnd = $(`#${monitorId}_onEnd`).is(":checked").toString();
    let random = $(`#${monitorId}_Random`).val();
    let includeZero = $(`#${monitorId}_includeZero`).is(":checked").toString();
    let addSubtract = $(`#${monitorId}_addSubtract`).val();
    let multiply = $(`#${monitorId}_Multiply`).val();
    let divide = $(`#${monitorId}_Divide`).val();
    let passSet = $(`#${monitorId}_passSet`).val();
    let failSet = $(`#${monitorId}_failSet`).val();
    let value = initial;
    let reqAll = $(`#${monitorId}_reqAll`).is(":checked").toString();
    let reqNot = $(`#${monitorId}_reqNot`).is(":checked").toString();
    let reqItemsNot = $(`#${monitorId}_itemsNot`).is(":checked").toString();
    let reqContainersNot = $(`#${monitorId}_containersNot`).is(":checked").toString();
    let reqLocalNot = $(`#${monitorId}_localNot`).is(":checked").toString();
    let reqGlobalNot = $(`#${monitorId}_globalNot`).is(":checked").toString();
    let preActionNot = $(`#${monitorId}_preActionNot`).is(":checked").toString();
    let locVisitsNot = $(`#${monitorId}_visitsNot`).is(":checked").toString();
    let preNodeNot = $(`#${monitorId}_preNodeNot`).is(":checked").toString();
    let itemEvosNot = $(`#${monitorId}_evosNot`).is(":checked").toString();
    let pastDesNot = $(`#${monitorId}_pastDesNot`).is(":checked").toString();
    let reqChanceNot = $(`#${monitorId}_reqChanceNot`).is(":checked").toString();
    let reqMonitorsNot = $(`#${monitorId}_reqMonitorsNot`).is(":checked").toString();
    let reqFailsNot = $(`#${monitorId}_reqFailsNot`).is(":checked").toString();
    let reqValidsNot = $(`#${monitorId}_reqValidsNot`).is(":checked").toString();
    let reqItems = $(`#${monitorId}_Items`).val();
    let reqContainers = $(`#${monitorId}_Containers`).val();
    let reqLocal = $(`#${monitorId}_Local`).val();
    let reqGlobal = $(`#${monitorId}_Global`).val();
    let preAction = $(`#${monitorId}_preAction`).val();
    let locVisits = $(`#${monitorId}_Visits`).val();
    let preNode = $(`#${monitorId}_preNode`).val();
    let itemEvos = $(`#${monitorId}_Evos`).val();
    let pastDes = $(`#${monitorId}_pastDes`).val();
    let reqChance = $(`#${monitorId}_reqChance`).val();
    let reqFails;
    if ($(`#${monitorId}_reqFailsCheck`).is(":checked")) {
      reqFails = {"reqFails": $(`#${monitorId}_reqFails`).val(), "consecutive": "true"};
    } else {
      reqFails = {"reqFails": $(`#${monitorId}_reqFails`).val(), "consecutive": "false"};
    }
    let reqValids;
    if ($(`#${monitorId}_reqValidsCheck`).is(":checked")) {
      reqValids = {"reqValids": $(`#${monitorId}_reqValids`).val(), "consecutive": "true"};
    } else {
      reqValids = {"reqValids": $(`#${monitorId}_reqValids`).val(), "consecutive": "false"};
    }
    let reqMonitors = {"reqMonitors": $(`#${monitorId}_reqMonitors`).val(),
                        "lessThan": $(`#${monitorId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${monitorId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
    let monitorObject = {
      monitor: monitor,
      initial: initial,
      onStart: onStart,
      display: display,
      onEnd: onEnd,
      random: random,
      includeZero: includeZero,
      addSubtract: addSubtract,
      multiply: multiply,
      divide: divide,
      passSet: passSet,
      failSet: failSet,
      value: value,
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
      reqMonitors: reqMonitors,
      reqMonitorsNot: reqMonitorsNot
    }
    monitorArray.push(monitorObject);
  }
  monitors = monitorArray;
}

function saveGlobalActions() {
  let actionArray = [];
  let actionList = $("#globalActionList").children();
  for (let i = 0; i < actionList.length; i++) {
    let baseId = $(actionList[i]).attr("id");
    let actions = $(`#${baseId}_Actions`).val();
    let includeOnly = $(`#${baseId}_includeOnly`).is(":checked").toString();
    let actionVerbs = $(`#${baseId}_actionVerbs`).val();
    let primaryNouns = $(`#${baseId}_primaryNouns`).val();
    let secondaryNouns = $(`#${baseId}_secondaryNouns`).val();
    let requiredWords = $(`#${baseId}_requiredWords`).val();
    let max = $(`#${baseId}_Max`).val();
    let costs = $(`#${baseId}_Costs`).val();
    let drops = $(`#${baseId}_Drops`).val();
    let move = $(`#${baseId}_Move`).val();
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
    let reqMonitorsNot = $(`#${baseId}_reqMonitorsNot`).is(":checked").toString();
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
    let reqMonitors = {"reqMonitors": $(`#${baseId}_reqMonitors`).val(),
                        "lessThan": $(`#${baseId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${baseId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
    let action = {
      actions: actions,
      includeOnly: includeOnly,
      actionVerbs: actionVerbs,
      primaryNouns: primaryNouns,
      secondaryNouns: secondaryNouns,
      requiredWords: requiredWords,
      max: max,
      costs: costs,
      drops: drops,
      move: move,
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
      reqValidsNot: reqValidsNot,
      reqMonitorsNot: reqMonitorsNot,
      reqMonitors: reqMonitors
    };
    actionArray.push(action);
  }
  globalActions = actionArray;
}

function saveNodeLocation() {
  let oldLocation = cNode.location;
  let newLocation = $("#setLocation").val().split(',');
  let oldKey = `${oldLocation[0]},${oldLocation[1]},${oldLocation[2]}`;
  let newKey = `${newLocation[0]},${newLocation[1]},${newLocation[2]}`;
  if (oldKey != newKey) {
    if (newLocation.length == 3) {
      if (oldLocation != "0,0,0") {
        if (!game.hasOwnProperty(newKey) || oldKey == newKey) {
          if (game.hasOwnProperty(oldKey)) {
            Object.defineProperty(game, newKey,
              Object.getOwnPropertyDescriptor(game, oldKey));
            delete game[oldKey];
          }
          $("#location").html(newKey);
          saveCNode();
          createMapFromGame(Object.keys(game));
          switchNode(newKey);
          draw(newKey);
        } else {
          $("#alertMessage").html("There is already a node at that location.");
          $("#alertMessageDisplay").css("visibility","visible");
          $("#setLocation").val(oldKey);
        }
      } else {
        $("#alertMessage").html(`You cannot move the origin node.`);
        $("#alertMessageDisplay").css("visibility","visible");
      }
    } else {
      $("#alertMessage").html(`There was in issue with the formatting of your new coordinates.`);
      $("#alertMessageDisplay").css("visibility","visible");
    }
  }
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

  //generateColor
  let color = $("#nodeColor").val();
  cNode.color = color;

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
      let reqMonitorsNot = $(`#${direction}_reqMonitorsNot`).is(":checked").toString();
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
      let reqMonitors = {"reqMonitors": $(`#${direction}_reqMonitors`).val(),
                        "lessThan": $(`#${direction}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${direction}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };

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
        reqValidsNot: reqValidsNot,
        reqMonitors: reqMonitors,
        reqMonitorsNot: reqMonitorsNot
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
      let reqMonitorsNot = $(`#${baseId}_reqMonitorsNot`).is(":checked").toString();
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
      let reqMonitors = {"reqMonitors": $(`#${baseId}_reqMonitors`).val(),
                        "lessThan": $(`#${baseId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${baseId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
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
        reqMonitors: reqMonitors,
        reqMonitorsNot: reqMonitorsNot,
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
    let primaryUse = $(`#${itemId}_primaryUse`).val();
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
    let reqMonitorsNot = $(`#${itemId}_reqMonitorsNot`).is(":checked").toString();
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
    let reqMonitors = {"reqMonitors": $(`#${itemId}_reqMonitors`).val(),
                        "lessThan": $(`#${itemId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${itemId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
    let item = {
      name: name,
      description: description,
      primaryUse: primaryUse,
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
      reqMonitors: reqMonitors,
      reqMonitorsNot: reqMonitorsNot,
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
      let reqMonitorsNot = $(`#${baseId}_reqMonitorsNot`).is(":checked").toString();
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
      let reqMonitors = {"reqMonitors": $(`#${baseId}_reqMonitors`).val(),
                        "lessThan": $(`#${baseId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${baseId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
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
        reqMonitors: reqMonitors,
        reqMonitorsNot: reqMonitorsNot,
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
    let initItems = $(`#${containerId}_initItems`).val();
    let complete = $(`#${containerId}_Complete`).val();
    let itemsListable = $(`#${containerId}_itemsListable`).is(":checked").toString();
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
    let reqMonitorsNot = $(`#${containerId}_reqMonitorsNot`).is(":checked").toString();
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
    let reqMonitors = {"reqMonitors": $(`#${containerId}_reqMonitors`).val(),
                        "lessThan": $(`#${containerId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${containerId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
    let container = {
      name: name,
      capacity: cap,
      items: [],
      complete: complete,
      illegal: illegal,
      initItems: initItems,
      itemsListable: itemsListable,
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
      reqMonitors: reqMonitors,
      reqMonitorsNot: reqMonitorsNot
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
    let includeOnly = $(`#${baseId}_includeOnly`).is(":checked").toString();
    let actionVerbs = $(`#${baseId}_actionVerbs`).val();
    let primaryNouns = $(`#${baseId}_primaryNouns`).val();
    let secondaryNouns = $(`#${baseId}_secondaryNouns`).val();
    let requiredWords = $(`#${baseId}_requiredWords`).val();
    let max = $(`#${baseId}_Max`).val();
    let costs = $(`#${baseId}_Costs`).val();
    let drops = $(`#${baseId}_Drops`).val();
    let move = $(`#${baseId}_Move`).val();
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
    let reqMonitorsNot = $(`#${baseId}_reqMonitorsNot`).is(":checked").toString();
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
    let reqMonitors = {"reqMonitors": $(`#${baseId}_reqMonitors`).val(),
                        "lessThan": $(`#${baseId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${baseId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };

    let action = {
      actions: actions,
      includeOnly: includeOnly,
      actionVerbs: actionVerbs,
      primaryNouns: primaryNouns,
      secondaryNouns: secondaryNouns,
      requiredWords: requiredWords,
      max: max,
      costs: costs,
      drops: drops,
      move: move,
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
      reqValidsNot: reqValidsNot,
      reqMonitors: reqMonitors,
      reqMonitorsNot: reqMonitorsNot
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
      let reqMonitorsNot = $(`#${baseId}_reqMonitorsNot`).is(":checked").toString();
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
      let reqMonitors = {"reqMonitors": $(`#${baseId}_reqMonitors`).val(),
                        "lessThan": $(`#${baseId}_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#${baseId}_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
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
        reqMonitors: reqMonitors,
        reqMonitorsNot: reqMonitorsNot,
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
  let winReqMonitorsNot = $(`#win_reqMonitorsNot`).is(":checked").toString();
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
  let winReqMonitors = {"reqMonitors": $(`#win_reqMonitors`).val(),
                        "lessThan": $(`#win_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#win_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
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
    reqValidsNot: winReqValidsNot,
    reqMonitors: winReqMonitors,
    reqMonitorsNot: winReqMonitorsNot
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
  let loseReqMonitorsNot = $(`#lose_reqMonitorsNot`).is(":checked").toString();
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
  let loseReqMonitors = {"reqMonitors": $(`#lose_reqMonitors`).val(),
                        "lessThan": $(`#lose_reqMonitorsLessThan`).is(":checked").toString(),
                        "greaterThan": $(`#lose_reqMonitorsGreaterThan`).is(":checked").toString()
                      };
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
    reqValidsNot: loseReqValidsNot,
    reqMonitors: loseReqMonitors,
    reqMonitorsNot: loseReqMonitorsNot
  };
  cNode.lose = lose;

  //generate hint
  let hint = $("#hint").val();
  cNode.hint = hint;

  return cNode;
}

export {
  cNode,
  generateNode,
  gameTitle,
  gameStyle,
  gameAuthor,
  IFID,
  globalActions,
  initItems,
  monitors,
  customDeposits,
  customWithdrawals,
  customTakes,
  customDrops,
  customIgnorables,
  customLooks,
  customExamines,
  globalWin,
  globalLose,
  game,
  node,
  switchNode,
  saveGame,
  loadGame,
  deleteNode,
  startGameSim,
  saveGlobalActions,
  saveInitItems,
  saveMonitors,
  saveGlobalWin,
  saveGlobalLose,
  saveNodeLocation
};
