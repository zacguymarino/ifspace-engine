import { currentNode, palette } from "./if_nodemap.js";
import { gameStyle, customDeposits, customWithdrawals, customTakes, customDrops, customIgnorables, customLooks, customExamines, globalActions, initItems, monitors, globalWin, globalLose } from "./if_generate.js";
import { containerDeposits, containerWithdrawals, takeCommands, dropCommands, ignorables, lookCommands, itemInspectCommands } from "./if_parser.js";

function loadDefaultCommands() {
  $("#defaultContainerDeposits").html(containerDeposits.toString());
  $("#defaultContainerWithdrawals").html(containerWithdrawals.toString());
  $("#defaultTakes").html(takeCommands.toString());
  $("#defaultDrops").html(dropCommands.toString());
  $("#defaultIgnorables").html(ignorables.toString());
  $("#defaultLooks").html(lookCommands.toString());
  $("#defaultExamines").html(itemInspectCommands.toString());
}

function loadDomCustomCommands() {
  //Container Deposits
  if (customDeposits["includeDefaults"] == "true") {
    $("#includeDefaultContainerDeposits").prop("checked", true);
  } else {
    $("#includeDefaultContainerDeposits").prop("checked", false);
  }
  $("#customContainerDepositCommands").val(customDeposits["customDeposits"]);

  //Container Withdrawals
  if (customWithdrawals["includeDefaults"] == "true") {
    $("#includeDefaultContainerWithdrawals").prop("checked", true);
  } else {
    $("#includeDefaultContainerWithdrawals").prop("checked", false);
  }
  $("#customContainerWithdrawalCommands").val(customWithdrawals["customWithdrawals"]);

  //Takes
  if (customTakes["includeDefaults"] == "true") {
    $("#includeDefaultTakes").prop("checked", true);
  } else {
    $("#includeDefaultTakes").prop("checked", false);
  }
  $("#customTakeCommands").val(customTakes["customTakes"]);

  //Drops
  if (customDrops["includeDefaults"] == "true") {
    $("#includeDefaultDrops").prop("checked", true);
  } else {
    $("#includeDefaultDrops").prop("checked", false);
  }
  $("#customDropCommands").val(customDrops["customDrops"]);

  //Ignorables
  if (customIgnorables["includeDefaults"] == "true") {
    $("#includeDefaultIgnorables").prop("checked", true);
  } else {
    $("#includeDefaultIgnorables").prop("checked", false);
  }
  $("#customIgnorables").val(customIgnorables["customIgnorables"]);

  //Looks
  if (customLooks["includeDefaults"] == "true") {
    $("#includeDefaultLooks").prop("checked", true);
  } else {
    $("#includeDefaultLooks").prop("checked", false);
  }
  $("#customLooks").val(customLooks["customLooks"]);

  //Examines
  if (customExamines["includeDefaults"] == "true") {
    $("#includeDefaultExamines").prop("checked", true);
  } else {
    $("#includeDefaultExamines").prop("checked", false);
  }
  $("#customExamines").val(customExamines["customExamines"]);
}

function loadDomInitItems(initItems) {
  $("#initItemList").empty();
  let items = initItems
  for (let i = 0; i < items.length; i++) {
    addInitItem();
    let baseId = `init_item_${i + 1}`;
    $(`#${baseId}_Name`).val(items[i].name);
    $(`#${baseId}_Des`).val(items[i].description);
    $(`#${baseId}_primaryUse`).val(items[i].primaryUse);
    $(`#${baseId}_Points`).val(items[i].points);
    $(`#${baseId}_EvoList`).val(items[i].itemEvos);
    for (let j = 0; j < items[i].evos.length; j++) {
      addInitEvo(`${baseId}_EvoList`, i+1);
      let baseEvoId = `initEvoItems_${i + 1}_${j + 1}`;

      if (items[i].evos[j].reqNot == "true") {
        $(`#${baseEvoId}_reqNot`).prop("checked", true);
        $(`.${baseEvoId}_notBox`).css("visibility", "visible");
      } else {
        $(`#${baseEvoId}_reqNot`).prop("checked", false);
        $(`.${baseEvoId}_notBox`).css("visibility", "hidden");
      }
      (items[i].evos[j].reqAll == "true") ? $(`#${baseEvoId}_reqAll`).prop("checked", true) : $(`#${baseEvoId}_reqAll`).prop("checked", false);
      (items[i].evos[j].reqItemsNot == "true") ? $(`#${baseEvoId}_itemsNot`).prop("checked", true) : $(`#${baseEvoId}_itemsNot`).prop("checked", false);
      (items[i].evos[j].reqContainersNot == "true") ? $(`#${baseEvoId}_containersNot`).prop("checked", true) : $(`#${baseEvoId}_containersNot`).prop("checked", false);
      (items[i].evos[j].reqLocalNot == "true") ? $(`#${baseEvoId}_localNot`).prop("checked", true) : $(`#${baseEvoId}_localNot`).prop("checked", false);
      (items[i].evos[j].reqGlobalNot == "true") ? $(`#${baseEvoId}_globalNot`).prop("checked", true) : $(`#${baseEvoId}_globalNot`).prop("checked", false);
      (items[i].evos[j].preActionNot == "true") ? $(`#${baseEvoId}_preActionNot`).prop("checked", true) : $(`#${baseEvoId}_preActionNot`).prop("checked", false);
      (items[i].evos[j].locVisitsNot == "true") ? $(`#${baseEvoId}_visitsNot`).prop("checked", true) : $(`#${baseEvoId}_visitsNot`).prop("checked", false);
      (items[i].evos[j].preNodeNot == "true") ? $(`#${baseEvoId}_preNodeNot`).prop("checked", true) : $(`#${baseEvoId}_preNodeNot`).prop("checked", false);
      (items[i].evos[j].itemEvosNot == "true") ? $(`#${baseEvoId}_evosNot`).prop("checked", true) : $(`#${baseEvoId}_evosNot`).prop("checked", false);
      (items[i].evos[j].pastDesNot == "true") ? $(`#${baseEvoId}_pastDesNot`).prop("checked", true) : $(`#${baseEvoId}_pastDesNot`).prop("checked", false);
      (items[i].evos[j].reqChanceNot == "true") ? $(`#${baseEvoId}_reqChanceNot`).prop("checked", true) : $(`#${baseEvoId}_reqChanceNot`).prop("checked", false);
      (items[i].evos[j].reqFailsNot == "true") ? $(`#${baseEvoId}_reqFailsNot`).prop("checked", true) : $(`#${baseEvoId}_reqFailsNot`).prop("checked", false);
      (items[i].evos[j].reqValidsNot == "true") ? $(`#${baseEvoId}_reqValidsNot`).prop("checked", true) : $(`#${baseEvoId}_reqValidsNot`).prop("checked", false);
      (items[i].evos[j].reqMonitorsNot == "true") ? $(`#${baseEvoId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseEvoId}_reqMonitorsNot`).prop("checked", false);

      $(`#${baseEvoId}_Items`).val(items[i].evos[j].reqItems);
      $(`#${baseEvoId}_Containers`).val(items[i].evos[j].reqContainers);
      $(`#${baseEvoId}_Local`).val(items[i].evos[j].reqLocal);
      $(`#${baseEvoId}_Global`).val(items[i].evos[j].reqGlobal);
      $(`#${baseEvoId}_preAction`).val(items[i].evos[j].preAction);
      $(`#${baseEvoId}_Visits`).val(items[i].evos[j].locVisits);
      $(`#${baseEvoId}_preNode`).val(items[i].evos[j].preNode);
      $(`#${baseEvoId}_Evos`).val(items[i].evos[j].itemEvos);
      $(`#${baseEvoId}_pastDes`).val(items[i].evos[j].pastDes);
      $(`#${baseEvoId}_reqChance`).val(items[i].evos[j].reqChance);
      if (items[i].evos[j].hasOwnProperty("reqFails")) {
        if (items[i].evos[j].reqFails["consecutive"] == "true") {
          $(`#${baseEvoId}_reqFailsCheck`).prop("checked", true);
        } else {
          $(`#${baseEvoId}_reqFailsCheck`).prop("checked", false);
        }
        $(`#${baseEvoId}_reqFails`).val(items[i].evos[j].reqFails["reqFails"]);
      }

      if (items[i].evos[j].hasOwnProperty("reqValids")) {
        if (items[i].evos[j].reqValids["consecutive"] == "true") {
          $(`#${baseEvoId}_reqValidsCheck`).prop("checked", true);
        } else {
          $(`#${baseEvoId}_reqValidsCheck`).prop("checked", false);
        }
        $(`#${baseEvoId}_reqValids`).val(items[i].evos[j].reqValids["reqValids"]);
      }

      if (items[i].evos[j].hasOwnProperty("reqMonitors")) {
        $(`#${baseEvoId}_reqMonitors`).val(items[i].evos[j].reqMonitors["reqMonitors"]);
        (items[i].evos[j].reqMonitors["lessThan"] == "true") ? $(`#${baseEvoId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseEvoId}_reqMonitorsLessThan`).prop("checked", false);
        (items[i].evos[j].reqMonitors["greaterThan"] == "true") ? $(`#${baseEvoId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseEvoId}_reqMonitorsGreaterThan`).prop("checked", false);
      }

      $(`#${baseEvoId}_Des`).val(items[i].evos[j].evoDes);
    }
  }
}

function loadDomGlobalActions(globalActions) {
  $("#globalActionList").empty();
  let actions = globalActions;
  for (let i = 0; i < actions.length; i++) {
    addGlobalAction();
    let baseId = `global_action_${i + 1}`;

    if (actions[i].reqNot == "true") {
      $(`#${baseId}_reqNot`).prop("checked", true);
      $(`.${baseId}_notBox`).css("visibility", "visible");
    } else {
      $(`#${baseId}_reqNot`).prop("checked", false);
      $(`.${baseId}_notBox`).css("visibility", "hidden");
    }
    (actions[i].includeOnly == "true") ? $(`#${baseId}_includeOnly`).prop("checked", true) : $(`#${baseId}_includeOnly`).prop("checked", false);
    (actions[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
    (actions[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
    (actions[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
    (actions[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
    (actions[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
    (actions[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
    (actions[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
    (actions[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
    (actions[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
    (actions[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
    (actions[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
    (actions[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
    (actions[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
    (actions[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);

    $(`#${baseId}_Actions`).val(actions[i].actions);
    $(`#${baseId}_actionVerbs`).val(actions[i].actionVerbs);
    $(`#${baseId}_primaryNouns`).val(actions[i].primaryNouns);
    $(`#${baseId}_secondaryNouns`).val(actions[i].secondaryNouns);
    $(`#${baseId}_requiredWords`).val(actions[i].requiredWords);
    $(`#${baseId}_Max`).val(actions[i].max);
    $(`#${baseId}_Costs`).val(actions[i].costs);
    $(`#${baseId}_Drops`).val(actions[i].drops);
    $(`#${baseId}_Move`).val(actions[i].move);
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
    $(`#${baseId}_pastDes`).val(actions[i].pastDes);
    $(`#${baseId}_reqChance`).val(actions[i].reqChance);
    if (actions[i].hasOwnProperty("reqFails")) {
      if (actions[i].reqFails["consecutive"] == "true") {
        $(`#${baseId}_reqFailsCheck`).prop("checked", true);
      } else {
        $(`#${baseId}_reqFailsCheck`).prop("checked", false);
      }
      $(`#${baseId}_reqFails`).val(actions[i].reqFails["reqFails"]);
    }

    if (actions[i].hasOwnProperty("reqValids")) {
      if (actions[i].reqValids["consecutive"] == "true") {
        $(`#${baseId}_reqValidsCheck`).prop("checked", true);
      } else {
        $(`#${baseId}_reqValidsCheck`).prop("checked", false);
      }
      $(`#${baseId}_reqValids`).val(actions[i].reqValids["reqValids"]);
    }

    if (actions[i].hasOwnProperty("reqMonitors")) {
      $(`#${baseId}_reqMonitors`).val(actions[i].reqMonitors["reqMonitors"]);
      (actions[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
      (actions[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
    }
  }
}

function loadDomGlobalWin(globalWin) {
  $("#globalWinList").empty();
  for (let i = 0; i < globalWin.length; i++) {
    addGlobalWin();
    let baseId = `global_win_${i + 1}`;
    if (globalWin[i].reqNot == "true") {
      $(`#${baseId}_reqNot`).prop("checked", true);
      $(`.${baseId}_notBox`).css("visibility", "visible");
    } else {
      $(`#${baseId}_reqNot`).prop("checked", false);
      $(`.${baseId}_notBox`).css("visibility", "hidden");
    }
    (globalWin[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
    (globalWin[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
    (globalWin[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
    (globalWin[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
    (globalWin[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
    (globalWin[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
    (globalWin[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
    (globalWin[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
    (globalWin[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
    (globalWin[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
    (globalWin[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
    (globalWin[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
    (globalWin[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
    (globalWin[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);

    $(`#${baseId}_globalWinDes`).val(globalWin[i].description);
    $(`#${baseId}_Items`).val(globalWin[i].reqItems);
    $(`#${baseId}_Containers`).val(globalWin[i].reqContainers);
    $(`#${baseId}_Local`).val(globalWin[i].reqLocal);
    $(`#${baseId}_Global`).val(globalWin[i].reqGlobal);
    $(`#${baseId}_preAction`).val(globalWin[i].preAction);
    $(`#${baseId}_Visits`).val(globalWin[i].locVisits);
    $(`#${baseId}_preNode`).val(globalWin[i].preNode);
    $(`#${baseId}_Evos`).val(globalWin[i].itemEvos);
    $(`#${baseId}_pastDes`).val(globalWin[i].pastDes);
    $(`#${baseId}_reqChance`).val(globalWin[i].reqChance);
    if (globalWin[i].hasOwnProperty("reqFails")) {
      if (globalWin[i].reqFails["consecutive"] == "true") {
        $(`#${baseId}_reqFailsCheck`).prop("checked", true);
      } else {
        $(`#${baseId}_reqFailsCheck`).prop("checked", false);
      }
      $(`#${baseId}_reqFails`).val(globalWin[i].reqFails["reqFails"]);
    }

    if (globalWin[i].hasOwnProperty("reqValids")) {
      if (globalWin[i].reqValids["consecutive"] == "true") {
        $(`#${baseId}_reqValidsCheck`).prop("checked", true);
      } else {
        $(`#${baseId}_reqValidsCheck`).prop("checked", false);
      }
      $(`#${baseId}_reqValids`).val(globalWin[i].reqValids["reqValids"]);
    }

    if (globalWin[i].hasOwnProperty("reqMonitors")) {
      $(`#${baseId}_reqMonitors`).val(globalWin[i].reqMonitors["reqMonitors"]);
      (globalWin[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
      (globalWin[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
    }
  }
}

function loadDomGlobalLose(globalLose) {
  $("#globalLoseList").empty();
  for (let i = 0; i < globalLose.length; i++) {
    addGlobalLose();
    let baseId = `global_lose_${i + 1}`;

    if (globalLose[i].reqNot == "true") {
      $(`#${baseId}_reqNot`).prop("checked", true);
      $(`.${baseId}_notBox`).css("visibility", "visible");
    } else {
      $(`#${baseId}_reqNot`).prop("checked", false);
      $(`.${baseId}_notBox`).css("visibility", "hidden");
    }
    (globalLose[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
    (globalLose[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
    (globalLose[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
    (globalLose[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
    (globalLose[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
    (globalLose[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
    (globalLose[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
    (globalLose[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
    (globalLose[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
    (globalLose[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
    (globalLose[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
    (globalLose[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
    (globalLose[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
    (globalLose[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);

    $(`#${baseId}_globalLoseDes`).val(globalLose[i].description);
    $(`#${baseId}_Items`).val(globalLose[i].reqItems);
    $(`#${baseId}_Containers`).val(globalLose[i].reqContainers);
    $(`#${baseId}_Local`).val(globalLose[i].reqLocal);
    $(`#${baseId}_Global`).val(globalLose[i].reqGlobal);
    $(`#${baseId}_preAction`).val(globalLose[i].preAction);
    $(`#${baseId}_Visits`).val(globalLose[i].locVisits);
    $(`#${baseId}_preNode`).val(globalLose[i].preNode);
    $(`#${baseId}_Evos`).val(globalLose[i].itemEvos);
    $(`#${baseId}_pastDes`).val(globalLose[i].pastDes);
    $(`#${baseId}_reqChance`).val(globalLose[i].reqChance);
    if (globalLose[i].hasOwnProperty("reqFails")) {
      if (globalLose[i].reqFails["consecutive"] == "true") {
        $(`#${baseId}_reqFailsCheck`).prop("checked", true);
      } else {
        $(`#${baseId}_reqFailsCheck`).prop("checked", false);
      }
      $(`#${baseId}_reqFails`).val(globalLose[i].reqFails["reqFails"]);
    }

    if (globalLose[i].hasOwnProperty("reqValids")) {
      if (globalLose[i].reqValids["consecutive"] == "true") {
        $(`#${baseId}_reqValidsCheck`).prop("checked", true);
      } else {
        $(`#${baseId}_reqValidsCheck`).prop("checked", false);
      }
      $(`#${baseId}_reqValids`).val(globalLose[i].reqValids["reqValids"]);
    }

    if (globalLose[i].hasOwnProperty("reqMonitors")) {
      $(`#${baseId}_reqMonitors`).val(globalLose[i].reqMonitors["reqMonitors"]);
      (globalLose[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
      (globalLose[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
    }
  }
}

function loadDomMonitors(monitors) {
  $("#monitorList").empty();
  for (let i = 0; i < monitors.length; i++) {
    addMonitor();
    let baseId = `monitor_${i + 1}`;

    if (monitors[i].reqNot == "true") {
      $(`#${baseId}_reqNot`).prop("checked", true);
      $(`.${baseId}_notBox`).css("visibility", "visible");
    } else {
      $(`#${baseId}_reqNot`).prop("checked", false);
      $(`.${baseId}_notBox`).css("visibility", "hidden");
    }
    (monitors[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
    (monitors[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
    (monitors[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
    (monitors[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
    (monitors[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
    (monitors[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
    (monitors[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
    (monitors[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
    (monitors[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
    (monitors[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
    (monitors[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
    (monitors[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
    (monitors[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
    (monitors[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);

    $(`#${baseId}_Monitor`).val(monitors[i].monitor);
    $(`#${baseId}_Initial`).val(monitors[i].initial);
    if (monitors[i].onStart == "true") {
      $(`#${baseId}_onStart`).prop("checked", true);
    } else {
      $(`#${baseId}_onStart`).prop("checked", false);
    }
    if (monitors[i].display == "true") {
      $(`#${baseId}_Display`).prop("checked", true);
    } else {
      $(`#${baseId}_Display`).prop("checked", false);
    }
    if (monitors[i].onEnd == "true") {
      $(`#${baseId}_onEnd`).prop("checked", true);
    } else {
      $(`#${baseId}_onEnd`).prop("checked", false);
    }
    $(`#${baseId}_Random`).val(monitors[i].random);
    if (monitors[i].includeZero == "true") {
      $(`#${baseId}_includeZero`).prop("checked", true);
    } else {
      $(`#${baseId}_includeZero`).prop("checked", false);
    }
    $(`#${baseId}_addSubtract`).val(monitors[i].addSubtract);
    $(`#${baseId}_Multiply`).val(monitors[i].multiply);
    $(`#${baseId}_Divide`).val(monitors[i].divide);
    $(`#${baseId}_passSet`).val(monitors[i].passSet);
    $(`#${baseId}_failSet`).val(monitors[i].failSet);
    $(`#${baseId}_Items`).val(monitors[i].reqItems);
    $(`#${baseId}_Containers`).val(monitors[i].reqContainers);
    $(`#${baseId}_Local`).val(monitors[i].reqLocal);
    $(`#${baseId}_Global`).val(monitors[i].reqGlobal);
    $(`#${baseId}_preAction`).val(monitors[i].preAction);
    $(`#${baseId}_Visits`).val(monitors[i].locVisits);
    $(`#${baseId}_preNode`).val(monitors[i].preNode);
    $(`#${baseId}_Evos`).val(monitors[i].itemEvos);
    $(`#${baseId}_pastDes`).val(monitors[i].pastDes);
    $(`#${baseId}_reqChance`).val(monitors[i].reqChance);
    if (monitors[i].hasOwnProperty("reqFails")) {
      if (monitors[i].reqFails["consecutive"] == "true") {
        $(`#${baseId}_reqFailsCheck`).prop("checked", true);
      } else {
        $(`#${baseId}_reqFailsCheck`).prop("checked", false);
      }
      $(`#${baseId}_reqFails`).val(monitors[i].reqFails["reqFails"]);
    }

    if (monitors[i].hasOwnProperty("reqValids")) {
      if (monitors[i].reqValids["consecutive"] == "true") {
        $(`#${baseId}_reqValidsCheck`).prop("checked", true);
      } else {
        $(`#${baseId}_reqValidsCheck`).prop("checked", false);
      }
      $(`#${baseId}_reqValids`).val(monitors[i].reqValids["reqValids"]);
    }

    if (monitors[i].hasOwnProperty("reqMonitors")) {
      $(`#${baseId}_reqMonitors`).val(monitors[i].reqMonitors["reqMonitors"]);
      (monitors[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
      (monitors[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
    }
  }
}

function loadDomFromNode(node) {
  let name = node.name;
  let location = node.location;
  let visibility = node.visibility;
  let points = node.points;
  let color = node.color;
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
  $("#evoListInvalids").empty();
  $("#itemList").empty();
  $("#containerList").empty();
  $("#actionList").empty();

  //add node elements
  $("#location").html(location.toString());
  $("#setLocation").val(location.toString());

  $("#name").val(name);

  if (visibility == "true") {
    $("#visibility").prop("checked", true);
  } else {
    $("#visibility").prop("checked", false);
  }

  $("#points").val(points);

  $("#nodeColorRect").css("fill", palette[color])
  $("#nodeColor").val(color);

  for (let i = 0; i < nodeDirections.length; i++) {
    let checkbox = nodeDirections[i].direction;
    $(`#${checkbox}`).prop("checked", true);
  }
  directions(dirInputs);
  for (let i = 0; i < nodeDirections.length; i++) {
    let checkbox = nodeDirections[i].direction;
    $(`#${checkbox}_Location`).val(nodeDirections[i].location);
    $(`#${checkbox}_Alternatives`).val(nodeDirections[i].alternatives);
    if (nodeDirections[i].reqNot == "true") {
      $(`#${checkbox}_reqNot`).prop("checked", true);
      $(`.${checkbox}_notBox`).css("visibility", "visible");
    } else {
      $(`#${checkbox}_reqNot`).prop("checked", false);
      $(`.${checkbox}_notBox`).css("visibility", "hidden");
    }
    (nodeDirections[i].exclude == "true") ? $(`#${checkbox}_Exclude`).prop("checked", true) : $(`#${checkbox}_Exclude`).prop("checked", false);
    (nodeDirections[i].reqAll == "true") ? $(`#${checkbox}_reqAll`).prop("checked", true) : $(`#${checkbox}_reqAll`).prop("checked", false);
    (nodeDirections[i].reqItemsNot == "true") ? $(`#${checkbox}_itemsNot`).prop("checked", true) : $(`#${checkbox}_itemsNot`).prop("checked", false);
    (nodeDirections[i].reqContainersNot == "true") ? $(`#${checkbox}_containersNot`).prop("checked", true) : $(`#${checkbox}_containersNot`).prop("checked", false);
    (nodeDirections[i].reqLocalNot == "true") ? $(`#${checkbox}_localNot`).prop("checked", true) : $(`#${checkbox}_localNot`).prop("checked", false);
    (nodeDirections[i].reqGlobalNot == "true") ? $(`#${checkbox}_globalNot`).prop("checked", true) : $(`#${checkbox}_globalNot`).prop("checked", false);
    (nodeDirections[i].preActionNot == "true") ? $(`#${checkbox}_preActionNot`).prop("checked", true) : $(`#${checkbox}_preActionNot`).prop("checked", false);
    (nodeDirections[i].locVisitsNot == "true") ? $(`#${checkbox}_visitsNot`).prop("checked", true) : $(`#${checkbox}_visitsNot`).prop("checked", false);
    (nodeDirections[i].preNodeNot == "true") ? $(`#${checkbox}_preNodeNot`).prop("checked", true) : $(`#${checkbox}_preNodeNot`).prop("checked", false);
    (nodeDirections[i].itemEvosNot == "true") ? $(`#${checkbox}_evosNot`).prop("checked", true) : $(`#${checkbox}_evosNot`).prop("checked", false);
    (nodeDirections[i].pastDesNot == "true") ? $(`#${checkbox}_pastDesNot`).prop("checked", true) : $(`#${checkbox}_pastDesNot`).prop("checked", false);
    (nodeDirections[i].reqChanceNot == "true") ? $(`#${checkbox}_reqChanceNot`).prop("checked", true) : $(`#${checkbox}_reqChanceNot`).prop("checked", false);
    (nodeDirections[i].reqFailsNot == "true") ? $(`#${checkbox}_reqFailsNot`).prop("checked", true) : $(`#${checkbox}_reqFailsNot`).prop("checked", false);
    (nodeDirections[i].reqValidsNot == "true") ? $(`#${checkbox}_reqValidsNot`).prop("checked", true) : $(`#${checkbox}_reqValidsNot`).prop("checked", false);
    (nodeDirections[i].reqMonitorsNot == "true") ? $(`#${checkbox}_reqMonitorsNot`).prop("checked", true) : $(`#${checkbox}_reqMonitorsNot`).prop("checked", false);

    $(`#${checkbox}_Items`).val(nodeDirections[i].reqItems);
    $(`#${checkbox}_Containers`).val(nodeDirections[i].reqContainers);
    $(`#${checkbox}_Local`).val(nodeDirections[i].reqLocal);
    $(`#${checkbox}_Global`).val(nodeDirections[i].reqGlobal);
    $(`#${checkbox}_preAction`).val(nodeDirections[i].preAction);
    $(`#${checkbox}_Visits`).val(nodeDirections[i].locVisits);
    $(`#${checkbox}_preNode`).val(nodeDirections[i].preNode);
    $(`#${checkbox}_Evos`).val(nodeDirections[i].itemEvos);
    $(`#${checkbox}_pastDes`).val(nodeDirections[i].pastDes);
    $(`#${checkbox}_reqChance`).val(nodeDirections[i].reqChance);
    if (nodeDirections[i].hasOwnProperty("reqFails")){
      (nodeDirections[i].reqFails["consecutive"] == "true") ? $(`#${checkbox}_reqFailsCheck`).prop("checked", true) : $(`#${checkbox}_reqFailsCheck`).prop("checked", false);
      $(`#${checkbox}_reqFails`).val(nodeDirections[i].reqFails["reqFails"]);
    }
    if (nodeDirections[i].hasOwnProperty("reqValids")) {
      (nodeDirections[i].reqValids["consecutive"] == "true") ? $(`#${checkbox}_reqValidsCheck`).prop("checked", true) : $(`#${checkbox}_reqValidsCheck`).prop("checked", false);
      $(`#${checkbox}_reqValids`).val(nodeDirections[i].reqValids["reqValids"]);
    }

    if (nodeDirections[i].hasOwnProperty("reqMonitors")) {
      $(`#${checkbox}_reqMonitors`).val(nodeDirections[i].reqMonitors["reqMonitors"]);
      (nodeDirections[i].reqMonitors["lessThan"] == "true") ? $(`#${checkbox}_reqMonitorsLessThan`).prop("checked", true) : $(`#${checkbox}_reqMonitorsLessThan`).prop("checked", false);
      (nodeDirections[i].reqMonitors["greaterThan"] == "true") ? $(`#${checkbox}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${checkbox}_reqMonitorsGreaterThan`).prop("checked", false);
    }
  }

  $("#defaultDes").val(descriptions.defaultDes);
  $("#basicDes").val(descriptions.basicDes);
  if ("evos" in descriptions) {
    for (let i = 0; i < descriptions.evos.length; i++) {
      addEvo("evoListDescriptions", null);
      let baseId = `evoDes_${i + 1}`;
      if (descriptions.evos[i].reqNot == "true") {
        $(`#${baseId}_reqNot`).prop("checked", true);
        $(`.${baseId}_notBox`).css("visibility", "visible");
      } else {
        $(`#${baseId}_reqNot`).prop("checked", false);
        $(`.${baseId}_notBox`).css("visibility", "hidden");
      }
      
      (descriptions.evos[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
      (descriptions.evos[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
      (descriptions.evos[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
      (descriptions.evos[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
      (descriptions.evos[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
      (descriptions.evos[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
      (descriptions.evos[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
      (descriptions.evos[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
      (descriptions.evos[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
      (descriptions.evos[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
      (descriptions.evos[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
      (descriptions.evos[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
      (descriptions.evos[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
      (descriptions.evos[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);
  
      $(`#${baseId}_Items`).val(descriptions.evos[i].reqItems);
      $(`#${baseId}_Containers`).val(descriptions.evos[i].reqContainers);
      $(`#${baseId}_Local`).val(descriptions.evos[i].reqLocal);
      $(`#${baseId}_Global`).val(descriptions.evos[i].reqGlobal);
      $(`#${baseId}_preAction`).val(descriptions.evos[i].preAction);
      $(`#${baseId}_Visits`).val(descriptions.evos[i].locVisits);
      $(`#${baseId}_preNode`).val(descriptions.evos[i].preNode);
      $(`#${baseId}_Evos`).val(descriptions.evos[i].itemEvos);
      $(`#${baseId}_pastDes`).val(descriptions.evos[i].pastDes);
      $(`#${baseId}_reqChance`).val(descriptions.evos[i].reqChance);
      if (descriptions.evos[i].hasOwnProperty("reqFails")) {
        (descriptions.evos[i].reqFails["consecutive"] == "true") ? $(`#${baseId}_reqFailsCheck`).prop("checked", true) : $(`#${baseId}_reqFailsCheck`).prop("checked", false);
        $(`#${baseId}_reqFails`).val(descriptions.evos[i].reqFails["reqFails"]);
      }

      if (descriptions.evos[i].hasOwnProperty("reqValids")) {
        (descriptions.evos[i].reqValids["consecutive"] == "true") ? $(`#${baseId}_reqValidsCheck`).prop("checked", true) : $(`#${baseId}_reqValidsCheck`).prop("checked", false);
        $(`#${baseId}_reqValids`).val(descriptions.evos[i].reqValids["reqValids"]);
      }

      if (descriptions.evos[i].hasOwnProperty("reqMonitors")) {
        $(`#${baseId}_reqMonitors`).val(descriptions.evos[i].reqMonitors["reqMonitors"]);
        (descriptions.evos[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
        (descriptions.evos[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
      }

      $(`#${baseId}_Des`).val(descriptions.evos[i].evoDes);
    }
  }

  for (let i = 0; i < items.length; i++) {
    addItem();
    let baseId = `item_${i + 1}`;
    $(`#${baseId}_Name`).val(items[i].name);
    $(`#${baseId}_Des`).val(items[i].description);
    $(`#${baseId}_primaryUse`).val(items[i].primaryUse);
    $(`#${baseId}_Points`).val(items[i].points);
    if (items[i].reqNot == "true") {
      $(`#${baseId}_reqNot`).prop("checked", true);
      $(`.${baseId}_notBox`).css("visibility", "visible");
    } else {
      $(`#${baseId}_reqNot`).prop("checked", false);
      $(`.${baseId}_notBox`).css("visibility", "hidden");
    }
    
    (items[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
    (items[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
    (items[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
    (items[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
    (items[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
    (items[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
    (items[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
    (items[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
    (items[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
    (items[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
    (items[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
    (items[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
    (items[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
    (items[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);

    $(`#${baseId}_Items`).val(items[i].reqItems);
    $(`#${baseId}_Containers`).val(items[i].reqContainers);
    $(`#${baseId}_Local`).val(items[i].reqLocal);
    $(`#${baseId}_Global`).val(items[i].reqGlobal);
    $(`#${baseId}_preAction`).val(items[i].preAction);
    $(`#${baseId}_Visits`).val(items[i].locVisits);
    $(`#${baseId}_preNode`).val(items[i].preNode);
    $(`#${baseId}_EvoList`).val(items[i].itemEvos);
    $(`#${baseId}_pastDes`).val(items[i].pastDes);
    $(`#${baseId}_reqChance`).val(items[i].reqChance);
    if (items[i].hasOwnProperty("reqFails")) {
      (items[i].reqFails["consecutive"] == "true") ? $(`#${baseId}_reqFailsCheck`).prop("checked", true) : $(`#${baseId}_reqFailsCheck`).prop("checked", false);
      $(`#${baseId}_reqFails`).val(items[i].reqFails["reqFails"]);
    }

    if (items[i].hasOwnProperty("reqValids")) {
      (items[i].reqValids["consecutive"] == "true") ? $(`#${baseId}_reqValidsCheck`).prop("checked", true) : $(`#${baseId}_reqValidsCheck`).prop("checked", false);
      $(`#${baseId}_reqValids`).val(items[i].reqValids["reqValids"]);
    }

    if (items[i].hasOwnProperty("reqMonitors")) {
      $(`#${baseId}_reqMonitors`).val(items[i].reqMonitors["reqMonitors"]);
      (items[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
      (items[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
    }

    for (let j = 0; j < items[i].evos.length; j++) {
      addEvo(`${baseId}_EvoList`, i+1);
      let baseEvoId = `evoItems_${i + 1}_${j + 1}`;
      if (items[i].evos[j].reqNot == "true") {
        $(`#${baseEvoId}_reqNot`).prop("checked", true);
        $(`.${baseEvoId}_notBox`).css("visibility", "visible");
      } else {
        $(`#${baseEvoId}_reqNot`).prop("checked", false);
        $(`.${baseEvoId}_notBox`).css("visibility", "hidden");
      }

      (items[i].evos[j].reqAll == "true") ? $(`#${baseEvoId}_reqAll`).prop("checked", true) : $(`#${baseEvoId}_reqAll`).prop("checked", false);
      (items[i].evos[j].reqItemsNot == "true") ? $(`#${baseEvoId}_itemsNot`).prop("checked", true) : $(`#${baseEvoId}_itemsNot`).prop("checked", false);
      (items[i].evos[j].reqContainersNot == "true") ? $(`#${baseEvoId}_containersNot`).prop("checked", true) : $(`#${baseEvoId}_containersNot`).prop("checked", false);
      (items[i].evos[j].reqLocalNot == "true") ? $(`#${baseEvoId}_localNot`).prop("checked", true) : $(`#${baseEvoId}_localNot`).prop("checked", false);
      (items[i].evos[j].reqGlobalNot == "true") ? $(`#${baseEvoId}_globalNot`).prop("checked", true) : $(`#${baseEvoId}_globalNot`).prop("checked", false);
      (items[i].evos[j].preActionNot == "true") ? $(`#${baseEvoId}_preActionNot`).prop("checked", true) : $(`#${baseEvoId}_preActionNot`).prop("checked", false);
      (items[i].evos[j].locVisitsNot == "true") ? $(`#${baseEvoId}_visitsNot`).prop("checked", true) : $(`#${baseEvoId}_visitsNot`).prop("checked", false);
      (items[i].evos[j].preNodeNot == "true") ? $(`#${baseEvoId}_preNodeNot`).prop("checked", true) : $(`#${baseEvoId}_preNodeNot`).prop("checked", false);
      (items[i].evos[j].itemEvosNot == "true") ? $(`#${baseEvoId}_evosNot`).prop("checked", true) : $(`#${baseEvoId}_evosNot`).prop("checked", false);
      (items[i].evos[j].pastDesNot == "true") ? $(`#${baseEvoId}_pastDesNot`).prop("checked", true) : $(`#${baseEvoId}_pastDesNot`).prop("checked", false);
      (items[i].evos[j].reqChanceNot == "true") ? $(`#${baseEvoId}_reqChanceNot`).prop("checked", true) : $(`#${baseEvoId}_reqChanceNot`).prop("checked", false);
      (items[i].evos[j].reqFailsNot == "true") ? $(`#${baseEvoId}_reqFailsNot`).prop("checked", true) : $(`#${baseEvoId}_reqFailsNot`).prop("checked", false);
      (items[i].evos[j].reqValidsNot == "true") ? $(`#${baseEvoId}_reqValidsNot`).prop("checked", true) : $(`#${baseEvoId}_reqValidsNot`).prop("checked", false);
      (items[i].evos[j].reqMonitorsNot == "true") ? $(`#${baseEvoId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseEvoId}_reqMonitorsNot`).prop("checked", false);
  
      $(`#${baseEvoId}_Items`).val(items[i].evos[j].reqItems);
      $(`#${baseEvoId}_Containers`).val(items[i].evos[j].reqContainers);
      $(`#${baseEvoId}_Local`).val(items[i].evos[j].reqLocal);
      $(`#${baseEvoId}_Global`).val(items[i].evos[j].reqGlobal);
      $(`#${baseEvoId}_preAction`).val(items[i].evos[j].preAction);
      $(`#${baseEvoId}_Visits`).val(items[i].evos[j].locVisits);
      $(`#${baseEvoId}_preNode`).val(items[i].evos[j].preNode);
      $(`#${baseEvoId}_Evos`).val(items[i].evos[j].itemEvos);
      $(`#${baseEvoId}_pastDes`).val(items[i].evos[j].pastDes);
      $(`#${baseEvoId}_reqChance`).val(items[i].evos[j].reqChance);
      if (items[i].evos[j].hasOwnProperty("reqFails")) {
        (items[i].evos[j].reqFails["consecutive"] == "true") ? $(`#${baseEvoId}_reqFailsCheck`).prop("checked", true) : $(`#${baseEvoId}_reqFailsCheck`).prop("checked", false);
        $(`#${baseEvoId}_reqFails`).val(items[i].evos[j].reqFails["reqFails"]);
      }

      if (items[i].evos[j].hasOwnProperty("reqValids")) {
        (items[i].evos[j].reqValids["consecutive"] == "true") ? $(`#${baseEvoId}_reqValidsCheck`).prop("checked", true) : $(`#${baseEvoId}_reqValidsCheck`).prop("checked", false);
        $(`#${baseEvoId}_reqValids`).val(items[i].evos[j].reqValids["reqValids"]);
      }

      if (items[i].evos[j].hasOwnProperty("reqMonitors")) {
        $(`#${baseEvoId}_reqMonitors`).val(items[i].evos[j].reqMonitors["reqMonitors"]);
        (items[i].evos[j].reqMonitors["lessThan"] == "true") ? $(`#${baseEvoId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseEvoId}_reqMonitorsLessThan`).prop("checked", false);
        (items[i].evos[j].reqMonitors["greaterThan"] == "true") ? $(`#${baseEvoId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseEvoId}_reqMonitorsGreaterThan`).prop("checked", false);
      }

      $(`#${baseEvoId}_Des`).val(items[i].evos[j].evoDes);
    }
  }

  for (let i = 0; i < containers.length; i++) {
    addContainer();
    let baseId = `container_${i + 1}`;
    $(`#${baseId}_Name`).val(containers[i].name);
    $(`#${baseId}_Capacity`).val(containers[i].capacity);
    $(`#${baseId}_Illegal`).val(containers[i].illegal);
    $(`#${baseId}_initItems`).val(containers[i].initItems);
    $(`#${baseId}_Complete`).val(containers[i].complete);
    $(`#${baseId}_Points`).val(containers[i].points);

    if (containers[i].reqNot == "true") {
      $(`#${baseId}_reqNot`).prop("checked", true);
      $(`.${baseId}_notBox`).css("visibility", "visible");
    } else {
      $(`#${baseId}_reqNot`).prop("checked", false);
      $(`.${baseId}_notBox`).css("visibility", "hidden");
    }
    (containers[i].itemsListable == "true") ? $(`#${baseId}_itemsListable`).prop("checked", true) : $(`#${baseId}_itemsListable`).prop("checked", false);
    (containers[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
    (containers[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
    (containers[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
    (containers[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
    (containers[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
    (containers[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
    (containers[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
    (containers[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
    (containers[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
    (containers[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
    (containers[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
    (containers[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
    (containers[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
    (containers[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);

    $(`#${baseId}_Items`).val(containers[i].reqItems);
    $(`#${baseId}_Containers`).val(containers[i].reqContainers);
    $(`#${baseId}_Local`).val(containers[i].reqLocal);
    $(`#${baseId}_Global`).val(containers[i].reqGlobal);
    $(`#${baseId}_preAction`).val(containers[i].preAction);
    $(`#${baseId}_Visits`).val(containers[i].locVisits);
    $(`#${baseId}_preNode`).val(containers[i].preNode);
    $(`#${baseId}_Evos`).val(containers[i].itemEvos);
    $(`#${baseId}_pastDes`).val(containers[i].pastDes);
    $(`#${baseId}_reqChance`).val(containers[i].reqChance);
    if (containers[i].hasOwnProperty("reqFails")) {
      (containers[i].reqFails["consecutive"] == "true") ? $(`#${baseId}_reqFailsCheck`).prop("checked", true) : $(`#${baseId}_reqFailsCheck`).prop("checked", false);
      $(`#${baseId}_reqFails`).val(containers[i].reqFails["reqFails"]);
    }

    if (containers[i].hasOwnProperty("reqValids")) {
      (containers[i].reqValids["consecutive"] == "true") ? $(`#${baseId}_reqValidsCheck`).prop("checked", true) : $(`#${baseId}_reqValidsCheck`).prop("checked", false);
      $(`#${baseId}_reqValids`).val(containers[i].reqValids["reqValids"]);
    }

    if (containers[i].hasOwnProperty("reqMonitors")) {
      $(`#${baseId}_reqMonitors`).val(containers[i].reqMonitors["reqMonitors"]);
      (containers[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
      (containers[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
    }
  }

  $("#invalidAction").val(actions.invalid);
  if ("evos" in actions) {
    for (let i = 0; i < actions.evos.length; i++) {
      addEvo("evoListInvalids", null);
      let baseId = `evoInvalid_${i + 1}`;
      
      if (actions.evos[i].reqNot == "true") {
        $(`#${baseId}_reqNot`).prop("checked", true);
        $(`.${baseId}_notBox`).css("visibility", "visible");
      } else {
        $(`#${baseId}_reqNot`).prop("checked", false);
        $(`.${baseId}_notBox`).css("visibility", "hidden");
      }
      
      (actions.evos[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
      (actions.evos[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
      (actions.evos[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
      (actions.evos[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
      (actions.evos[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
      (actions.evos[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
      (actions.evos[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
      (actions.evos[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
      (actions.evos[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
      (actions.evos[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
      (actions.evos[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
      (actions.evos[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
      (actions.evos[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
      (actions.evos[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);
  
      $(`#${baseId}_Items`).val(actions.evos[i].reqItems);
      $(`#${baseId}_Containers`).val(actions.evos[i].reqContainers);
      $(`#${baseId}_Local`).val(actions.evos[i].reqLocal);
      $(`#${baseId}_Global`).val(actions.evos[i].reqGlobal);
      $(`#${baseId}_preAction`).val(actions.evos[i].preAction);
      $(`#${baseId}_Visits`).val(actions.evos[i].locVisits);
      $(`#${baseId}_preNode`).val(actions.evos[i].preNode);
      $(`#${baseId}_Evos`).val(actions.evos[i].itemEvos);
      $(`#${baseId}_pastDes`).val(actions.evos[i].pastDes);
      $(`#${baseId}_reqChance`).val(actions.evos[i].reqChance);
      if (actions.evos[i].hasOwnProperty("reqFails")) {
        (actions.evos[i].reqFails["consecutive"] == "true") ? $(`#${baseId}_reqFailsCheck`).prop("checked", true) : $(`#${baseId}_reqFailsCheck`).prop("checked", false);
        $(`#${baseId}_reqFails`).val(actions.evos[i].reqFails["reqFails"]);
      }

      if (actions.evos[i].hasOwnProperty("reqValids")) {
        (actions.evos[i].reqValids["consecutive"] == "true") ? $(`#${baseId}_reqValidsCheck`).prop("checked", true) : $(`#${baseId}_reqValidsCheck`).prop("checked", false);
        $(`#${baseId}_reqValids`).val(actions.evos[i].reqValids["reqValids"]);
      }

      if (actions.evos[i].hasOwnProperty("reqMonitors")) {
        $(`#${baseId}_reqMonitors`).val(actions.evos[i].reqMonitors["reqMonitors"]);
        (actions.evos[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
        (actions.evos[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
      }

      $(`#${baseId}_Des`).val(actions.evos[i].evoDes);
    }
  }
  if ("actions" in actions) {
    for (let i = 0; i < actions.actions.length; i++) {
      addAction();
      let baseId = `action_${i + 1}`;
      $(`#${baseId}_Actions`).val(actions.actions[i].actions);
      $(`#${baseId}_actionVerbs`).val(actions.actions[i].actionVerbs);
      $(`#${baseId}_primaryNouns`).val(actions.actions[i].primaryNouns);
      $(`#${baseId}_secondaryNouns`).val(actions.actions[i].secondaryNouns);
      $(`#${baseId}_requiredWords`).val(actions.actions[i].requiredWords);
      $(`#${baseId}_Max`).val(actions.actions[i].max);
      $(`#${baseId}_Costs`).val(actions.actions[i].costs);
      $(`#${baseId}_Drops`).val(actions.actions[i].drops);
      $(`#${baseId}_Move`).val(actions.actions[i].move);
      $(`#${baseId}_Visibility`).val(actions.actions[i].visibility);
      $(`#${baseId}_Response`).val(actions.actions[i].response);
      $(`#${baseId}_Fail`).val(actions.actions[i].fail);
      $(`#${baseId}_Points`).val(actions.actions[i].points);
      if (actions.actions[i].reqNot == "true") {
        $(`#${baseId}_reqNot`).prop("checked", true);
        $(`.${baseId}_notBox`).css("visibility", "visible");
      } else {
        $(`#${baseId}_reqNot`).prop("checked", false);
        $(`.${baseId}_notBox`).css("visibility", "hidden");
      }

      (actions.actions[i].includeOnly == "true") ? $(`#${baseId}_includeOnly`).prop("checked", true) : $(`#${baseId}_includeOnly`).prop("checked", false);
      (actions.actions[i].reqAll == "true") ? $(`#${baseId}_reqAll`).prop("checked", true) : $(`#${baseId}_reqAll`).prop("checked", false);
      (actions.actions[i].reqItemsNot == "true") ? $(`#${baseId}_itemsNot`).prop("checked", true) : $(`#${baseId}_itemsNot`).prop("checked", false);
      (actions.actions[i].reqContainersNot == "true") ? $(`#${baseId}_containersNot`).prop("checked", true) : $(`#${baseId}_containersNot`).prop("checked", false);
      (actions.actions[i].reqLocalNot == "true") ? $(`#${baseId}_localNot`).prop("checked", true) : $(`#${baseId}_localNot`).prop("checked", false);
      (actions.actions[i].reqGlobalNot == "true") ? $(`#${baseId}_globalNot`).prop("checked", true) : $(`#${baseId}_globalNot`).prop("checked", false);
      (actions.actions[i].preActionNot == "true") ? $(`#${baseId}_preActionNot`).prop("checked", true) : $(`#${baseId}_preActionNot`).prop("checked", false);
      (actions.actions[i].locVisitsNot == "true") ? $(`#${baseId}_visitsNot`).prop("checked", true) : $(`#${baseId}_visitsNot`).prop("checked", false);
      (actions.actions[i].preNodeNot == "true") ? $(`#${baseId}_preNodeNot`).prop("checked", true) : $(`#${baseId}_preNodeNot`).prop("checked", false);
      (actions.actions[i].itemEvosNot == "true") ? $(`#${baseId}_evosNot`).prop("checked", true) : $(`#${baseId}_evosNot`).prop("checked", false);
      (actions.actions[i].pastDesNot == "true") ? $(`#${baseId}_pastDesNot`).prop("checked", true) : $(`#${baseId}_pastDesNot`).prop("checked", false);
      (actions.actions[i].reqChanceNot == "true") ? $(`#${baseId}_reqChanceNot`).prop("checked", true) : $(`#${baseId}_reqChanceNot`).prop("checked", false);
      (actions.actions[i].reqFailsNot == "true") ? $(`#${baseId}_reqFailsNot`).prop("checked", true) : $(`#${baseId}_reqFailsNot`).prop("checked", false);
      (actions.actions[i].reqValidsNot == "true") ? $(`#${baseId}_reqValidsNot`).prop("checked", true) : $(`#${baseId}_reqValidsNot`).prop("checked", false);
      (actions.actions[i].reqMonitorsNot == "true") ? $(`#${baseId}_reqMonitorsNot`).prop("checked", true) : $(`#${baseId}_reqMonitorsNot`).prop("checked", false);
  
      $(`#${baseId}_Items`).val(actions.actions[i].reqItems);
      $(`#${baseId}_Containers`).val(actions.actions[i].reqContainers);
      $(`#${baseId}_Local`).val(actions.actions[i].reqLocal);
      $(`#${baseId}_Global`).val(actions.actions[i].reqGlobal);
      $(`#${baseId}_preAction`).val(actions.actions[i].preAction);
      $(`#${baseId}_Visits`).val(actions.actions[i].locVisits);
      $(`#${baseId}_preNode`).val(actions.actions[i].preNode);
      $(`#${baseId}_Evos`).val(actions.actions[i].itemEvos);
      $(`#${baseId}_pastDes`).val(actions.actions[i].pastDes);
      $(`#${baseId}_reqChance`).val(actions.actions[i].reqChance);
      if (actions.actions[i].hasOwnProperty("reqFails")) {
        (actions.actions[i].reqFails["consecutive"] == "true") ? $(`#${baseId}_reqFailsCheck`).prop("checked", true) : $(`#${baseId}_reqFailsCheck`).prop("checked", false);
        $(`#${baseId}_reqFails`).val(actions.actions[i].reqFails["reqFails"]);
      }

      if (actions.actions[i].hasOwnProperty("reqValids")) {
        (actions.actions[i].reqValids["consecutive"] == "true") ? $(`#${baseId}_reqValidsCheck`).prop("checked", true) : $(`#${baseId}_reqValidsCheck`).prop("checked", false);
        $(`#${baseId}_reqValids`).val(actions.actions[i].reqValids["reqValids"]);
      }

      if (actions.actions[i].hasOwnProperty("reqMonitors")) {
        $(`#${baseId}_reqMonitors`).val(actions.actions[i].reqMonitors["reqMonitors"]);
        (actions.actions[i].reqMonitors["lessThan"] == "true") ? $(`#${baseId}_reqMonitorsLessThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsLessThan`).prop("checked", false);
        (actions.actions[i].reqMonitors["greaterThan"] == "true") ? $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", true) : $(`#${baseId}_reqMonitorsGreaterThan`).prop("checked", false);
      }
    }
  }

  $("#winDes").val(win.description);
  if (win.reqNot == "true") {
    $(`#win_reqNot`).prop("checked", true);
    $(`.win_notBox`).css("visibility", "visible");
  } else {
    $(`#win_reqNot`).prop("checked", false);
    $(`.win_notBox`).css("visibility", "hidden");
  }

  (win.reqAll == "true") ? $(`#win_reqAll`).prop("checked", true) : $(`#win_reqAll`).prop("checked", false);
  (win.reqItemsNot == "true") ? $(`#win_itemsNot`).prop("checked", true) : $(`#win_itemsNot`).prop("checked", false);
  (win.reqContainersNot == "true") ? $(`#win_containersNot`).prop("checked", true) : $(`#win_containersNot`).prop("checked", false);
  (win.reqLocalNot == "true") ? $(`#win_localNot`).prop("checked", true) : $(`#win_localNot`).prop("checked", false);
  (win.reqGlobalNot == "true") ? $(`#win_globalNot`).prop("checked", true) : $(`#win_globalNot`).prop("checked", false);
  (win.preActionNot == "true") ? $(`#win_preActionNot`).prop("checked", true) : $(`#win_preActionNot`).prop("checked", false);
  (win.locVisitsNot == "true") ? $(`#win_visitsNot`).prop("checked", true) : $(`#win_visitsNot`).prop("checked", false);
  (win.preNodeNot == "true") ? $(`#win_preNodeNot`).prop("checked", true) : $(`#win_preNodeNot`).prop("checked", false);
  (win.itemEvosNot == "true") ? $(`#win_evosNot`).prop("checked", true) : $(`#win_evosNot`).prop("checked", false);
  (win.pastDesNot == "true") ? $(`#win_pastDesNot`).prop("checked", true) : $(`#win_pastDesNot`).prop("checked", false);
  (win.reqChanceNot == "true") ? $(`#win_reqChanceNot`).prop("checked", true) : $(`#win_reqChanceNot`).prop("checked", false);
  (win.reqFailsNot == "true") ? $(`#win_reqFailsNot`).prop("checked", true) : $(`#win_reqFailsNot`).prop("checked", false);
  (win.reqValidsNot == "true") ? $(`#win_reqValidsNot`).prop("checked", true) : $(`#win_reqValidsNot`).prop("checked", false);
  (win.reqMonitorsNot == "true") ? $(`#win_reqMonitorsNot`).prop("checked", true) : $(`#win_reqMonitorsNot`).prop("checked", false);

  $("#win_Items").val(win.reqItems);
  $("#win_Containers").val(win.reqContainers);
  $("#win_Local").val(win.reqLocal);
  $("#win_Global").val(win.reqGlobal);
  $("#win_preAction").val(win.preAction);
  $("#win_Visits").val(win.locVisits);
  $("#win_preNode").val(win.preNode);
  $("#win_Evos").val(win.itemEvos);
  $("#win_pastDes").val(win.pastDes);
  $("#win_reqChance").val(win.reqChance);
  if (win.hasOwnProperty("reqFails")) {
    (win.reqFails["consecutive"] == "true") ? $(`#win_reqFailsCheck`).prop("checked", true) : $(`#win_reqFailsCheck`).prop("checked", false);
    $(`#win_reqFails`).val(win.reqFails["reqFails"]);
  }

  if (win.hasOwnProperty("reqValids")) {
    (win.reqValids["consecutive"] == "true") ? $(`#win_reqValidsCheck`).prop("checked", true) : $(`#win_reqValidsCheck`).prop("checked", false);
    $(`#win_reqValids`).val(win.reqValids["reqValids"]);
  }

  if (win.hasOwnProperty("reqMonitors")) {
    $(`#win_reqMonitors`).val(win.reqMonitors["reqMonitors"]);
    (win.reqMonitors["lessThan"] == "true") ? $(`#win_reqMonitorsLessThan`).prop("checked", true) : $(`#win_reqMonitorsLessThan`).prop("checked", false);
    (win.reqMonitors["greaterThan"] == "true") ? $(`#win_reqMonitorsGreaterThan`).prop("checked", true) : $(`#win_reqMonitorsGreaterThan`).prop("checked", false);
  }

  $("#loseDes").val(lose.description);
  if (lose.reqNot == "true") {
    $(`#lose_reqNot`).prop("checked", true);
    $(`.lose_notBox`).css("visibility", "visible");
  } else {
    $(`#lose_reqNot`).prop("checked", false);
    $(`.lose_notBox`).css("visibility", "hidden");
  }

  (lose.reqAll == "true") ? $(`#lose_reqAll`).prop("checked", true) : $(`#lose_reqAll`).prop("checked", false);
  (lose.reqNot == "true") ? $(`#lose_reqNot`).prop("checked", true) : $(`#lose_reqNot`).prop("checked", false);
  (lose.reqItemsNot == "true") ? $(`#lose_itemsNot`).prop("checked", true) : $(`#lose_itemsNot`).prop("checked", false);
  (lose.reqContainersNot == "true") ? $(`#lose_containersNot`).prop("checked", true) : $(`#lose_containersNot`).prop("checked", false);
  (lose.reqLocalNot == "true") ? $(`#lose_localNot`).prop("checked", true) : $(`#lose_localNot`).prop("checked", false);
  (lose.reqGlobalNot == "true") ? $(`#lose_globalNot`).prop("checked", true) : $(`#lose_globalNot`).prop("checked", false);
  (lose.preActionNot == "true") ? $(`#lose_preActionNot`).prop("checked", true) : $(`#lose_preActionNot`).prop("checked", false);
  (lose.locVisitsNot == "true") ? $(`#lose_visitsNot`).prop("checked", true) : $(`#lose_visitsNot`).prop("checked", false);
  (lose.preNodeNot == "true") ? $(`#lose_preNodeNot`).prop("checked", true) : $(`#lose_preNodeNot`).prop("checked", false);
  (lose.itemEvosNot == "true") ? $(`#lose_evosNot`).prop("checked", true) : $(`#lose_evosNot`).prop("checked", false);
  (lose.pastDesNot == "true") ? $(`#lose_pastDesNot`).prop("checked", true) : $(`#lose_pastDesNot`).prop("checked", false);
  (lose.reqChanceNot == "true") ? $(`#lose_reqChanceNot`).prop("checked", true) : $(`#lose_reqChanceNot`).prop("checked", false);
  (lose.reqFailsNot == "true") ? $(`#lose_reqFailsNot`).prop("checked", true) : $(`#lose_reqFailsNot`).prop("checked", false);
  (lose.reqValidsNot == "true") ? $(`#lose_reqValidsNot`).prop("checked", true) : $(`#lose_reqValidsNot`).prop("checked", false);
  (lose.reqMonitorsNot == "true") ? $(`#lose_reqMonitorsNot`).prop("checked", true) : $(`#lose_reqMonitorsNot`).prop("checked", false);

  $("#lose_Items").val(lose.reqItems);
  $("#lose_Containers").val(lose.reqContainers);
  $("#lose_Local").val(lose.reqLocal);
  $("#lose_Global").val(lose.reqGlobal);
  $("#lose_preAction").val(lose.preAction);
  $("#lose_Visits").val(lose.locVisits);
  $("#lose_preNode").val(lose.preNode);
  $("#lose_Evos").val(lose.itemEvos);
  $("#lose_pastDes").val(lose.pastDes);
  $("#lose_reqChance").val(lose.reqChance);
  if (lose.hasOwnProperty("reqFails")) {
    (lose.reqFails["consecutive"] == "true") ? $(`#lose_reqFailsCheck`).prop("checked", true) : $(`#lose_reqFailsCheck`).prop("checked", false);
    $(`#lose_reqFails`).val(lose.reqFails["reqFails"]);
  }

  if (lose.hasOwnProperty("reqValids")) {
    (lose.reqValids["consecutive"] == "true") ? $(`#lose_reqValidsCheck`).prop("checked", true) : $(`#lose_reqValidsCheck`).prop("checked", false);
    $(`#lose_reqValids`).val(lose.reqValids["reqValids"]);
  }

  if (lose.hasOwnProperty("reqMonitors")) {
    $(`#lose_reqMonitors`).val(lose.reqMonitors["reqMonitors"]);
    (lose.reqMonitors["lessThan"] == "true") ? $(`#lose_reqMonitorsLessThan`).prop("checked", true) : $(`#lose_reqMonitorsLessThan`).prop("checked", false);
    (lose.reqMonitors["greaterThan"] == "true") ? $(`#lose_reqMonitorsGreaterThan`).prop("checked", true) : $(`#lose_reqMonitorsGreaterThan`).prop("checked", false);
  }

  $("#hint").val(hint);
}

function setNodeColor(color) {
  $("#nodeColorRect").css("fill", palette[color])
  $("#nodeColor").val(color);
}

function showHideNotBoxes(baseId, status) {
  if (status) {
    $(`.${baseId}_notBox`).css("visibility", "visible");
  } else {
    $(`.${baseId}_notBox`).css("visibility", "hidden");
  }
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
  let primaryUseLabel = `<label class='tooltip'>
                          Primary Use
                          <span class='tooltiptext'>Comma separated list of verbs (or array of verbs) which correspond to this item's potential actions [the words use & utilize can be accepted in place of these actions] (e.g. for a screwdriver: [screw, mount], unscrew)</span>
                          </label>`;
  let primaryUse = `<input type='text' id='${itemId}_primaryUse'>`;
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
    primaryUseLabel +
    primaryUse +
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
  let initItemsLabel = `<label class='tooltip'>
                  Initial Items
                  <span class='tooltiptext'>Comma separated list of items from this node which begin in this container (e.g. book, paperweight, paper)</span>
                  </label>`;
  let initItems = `<input type='text' id='${containerId}_initItems'>`;
  let itemsListableLabel = `<label class='pure-checkbox tooltip'>
                        Items Listable
                        <span class='tooltiptext'>If checked, the contents of the container are listed upon examining the container</span>
                        </label>`;
  let itemsListable = `<input type='checkbox' id='${containerId}_itemsListable'/>`;
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
    initItemsLabel +
    initItems +
    itemsListableLabel +
    itemsListable +
    pointsLabel +
    points +
    requirements +
    newDivEnd;

  $("#containerList").append(html);
}

function addGlobalWin() {
  let length = $("#globalWinList").children().length;
  let winId;
  if (length >= 1) {
    let lastId = +$("#globalWinList").children().last().attr("id").split("_")[2];
    winId = `global_win_${lastId + 1}`;
  } else {
    winId = "global_win_1";
  }

  let newDivStart = `<div class='popupBlockElements' id='${winId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = `<button class='removeObject'>Remove Win</button>`;
  let desLabel = `<label class="tooltip">
                    <h3>Global Win Description</h3>
                    <span class="popuptooltiptext">Text displayed after the
                        player meets the win requirements and wins the
                        game</span>
                  </label>`;
  let description = `<textarea id="${winId}_globalWinDes" rows="5" cols='28'></textarea>`;
  let requirements = getRequirements(winId);
  let html = 
    newDivStart +
    rmvButton +
    desLabel +
    description +
    requirements +
    newDivEnd;
  $("#globalWinList").append(html);
}

function addGlobalLose() {
  let length = $("#globalLoseList").children().length;
  let loseId;
  if (length >= 1) {
    let lastId = +$("#globalLoseList").children().last().attr("id").split("_")[2];
    loseId = `global_lose_${lastId + 1}`;
  } else {
    loseId = "global_lose_1";
  }

  let newDivStart = `<div class='popupBlockElements' id='${loseId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = `<button class='removeObject'>Remove Lose</button>`;
  let desLabel = `<label class="tooltip">
                    <h3>Global Lose Description</h3>
                    <span class="popuptooltiptext">Text displayed after the
                        player meets the lose requirements and loses the
                        game</span>
                  </label>`;
  let description = `<textarea id="${loseId}_globalLoseDes" rows="5" cols='28'></textarea>`;
  let requirements = getRequirements(loseId);
  let html = 
    newDivStart +
    rmvButton +
    desLabel +
    description +
    requirements +
    newDivEnd;
  $("#globalLoseList").append(html);
}

function addInitItem() {
  let length = $("#initItemList").children().length;
  let itemId;
  if (length >= 1) {
    let lastId = +$("#initItemList").children().last().attr("id").split("_")[2];
    itemId = `init_item_${lastId + 1}`;
  } else {
    itemId = "init_item_1";
  }
  let newDivStart = `<div class='popupBlockElements' id='${itemId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = "<button class='removeObject'>Remove Item</button>";
  let nameLabel = `<label class='tooltip'>
                    Name
                    <span class='popuptooltiptext'>Comma separated names of item [first option has requirement precedence] (e.g. lantern, light, torch)</span>
                    </label>`;
  let name = `<input type='text' id='${itemId}_Name'>`;
  let desLabel = `<label class='tooltip'>
                    Description
                    <span class='popuptooltiptext'>Description of item (for "examine {item}" or "look {item}" command)</span>
                    </label>`;
  let des = `<textarea id='${itemId}_Des' rows='3' cols='23'></textarea>`;
  let primaryUseLabel = `<label class='tooltip'>
                          Primary Use
                          <span class='tooltiptext'>Comma separated list of verbs (or array of verbs) which correspond to this item's potential actions [the words use & utilize can be accepted in place of these actions] (e.g. for a screwdriver: [screw, mount], unscrew)</span>
                          </label>`;
  let primaryUse = `<input type='text' id='${itemId}_primaryUse'>`;
  let pointsLabel = `<label class='tooltip'>
                        Points
                        <span class='popuptooltiptext'>Number of points awarded for getting this item [default of 0]</span>
                        </label>`;
  let points = `<input type='text' id='${itemId}_Points'>`;
  let evoButton = "<button class='addInitEvoItems'>Add Evolution</button>";
  let evoListDiv = `<div id='${itemId}_EvoList'></div>`;
  let html =
    newDivStart +
    rmvButton +
    nameLabel +
    name +
    desLabel +
    des +
    primaryUseLabel +
    primaryUse +
    pointsLabel +
    points +
    evoButton +
    evoListDiv +
    newDivEnd;

  $("#initItemList").append(html);
}

function addGlobalAction() {
  let length = $("#globalActionList").children().length;
  let actionId;
  if (length >= 1) {
    let lastId = +$("#globalActionList").children().last().attr("id").split("_")[2];
    actionId = `global_action_${lastId + 1}`;
  } else {
    actionId = "global_action_1";
  }
  let html = getActionHTML(actionId, "popuptooltiptext");
  $("#globalActionList").append(html);
}

function addMonitor() {
  let length = $("#monitorList").children().length;
  let monitorId;
  if (length >= 1) {
    let lastId = +$("#monitorList").children().last().attr("id").split("_")[1];
    monitorId = `monitor_${lastId + 1}`;
  } else {
    monitorId = "monitor_1";
  }
  let newDivStart = `<div class='popupBlockElements' id='${monitorId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = `<button class='removeObject'>Remove Monitor</button>`;
  let monitorLabel = `<label class='tooltip'>
                        Monitor
                        <span class='popuptooltiptext'>Name of monitor (e.g. healthbar, ammo, hits, etc.)</span>
                        </label>`;
  let monitor = `<input type='text' id='${monitorId}_Monitor'>`;
  let initialLabel = `<label class='tooltip'>
                      Initial Value
                      <span class='popuptooltiptext'>Initial number value for this monitor</span>
                      </label>`;
  let initial = `<input type='text' id='${monitorId}_Initial'>`;
  let onStartLabel = `<label class='tooltip '>
                      Display on Start:
                      <span class='popuptooltiptext'>If checked, this monitor and its value will be displayed at the beginning of the game</span>
                      </label>`;
  let onStart = `<input type='checkbox' id='${monitorId}_onStart'/>`;
  let displayLabel = `<label class='tooltip '>
                      Display on Change:
                      <span class='popuptooltiptext'>If checked, this monitor and its value will be displayed to the player when it changes</span>
                      </label>`;
  let display = `<input type='checkbox' id='${monitorId}_Display'/>`;
  let onEndLabel = `<label class='tooltip '>
                      Display on End:
                      <span class='popuptooltiptext'>If checked, this monitor and its value will be displayed at the end of the game (upon winning or losing)</span>
                      </label>`;
  let onEnd = `<input type='checkbox' id='${monitorId}_onEnd'/>`;
  let randomLabel = `<label class='tooltip '>
                    Random number:
                    <span class='popuptooltiptext'>A random number between 1 (or 0, if checked) and the input number (including the input number) - can be used as an incrementor/factor in the following inputs by inputting "random" in place of a number</span>
                    </label>`;
  let random = `<input type='text' id='${monitorId}_Random'>`;
  let includeZero = `<div style="display: flex;">&nbsp;&nbsp;&nbsp;&nbsp;Include zero:&nbsp;&nbsp;&nbsp;<input type='checkbox' id='${monitorId}_includeZero'/></div>`;
  let addSubtractLabel = `<label class='tooltip'>
                          Add/Subtract Actions
                          <span class='popuptooltiptext'>Comma separated list of actions and their corresponding incrementors for the action passing and failing [for adding to or subtracting from the monitor in the form of [action, pass incrementor, fail incrementor]] (e.g. [shoot, 0, -1], [eat, 1, 0])</span>
                          </label>`;
  let addSubtract = `<input type='text' id='${monitorId}_addSubtract'>`;
  let multiplyLabel = `<label class='tooltip'>
                            Multiply Actions
                            <span class='popuptooltiptext'>Comma separated list of actions and their corresponding factors for the action passing and failing [for multiplying the monitor in the form of [action, pass factor, fail factor]] (e.g. [reverse, -1, 1], [doubledown, 2, 1])</span>
                            </label>`;
  let multiply = `<input type='text' id='${monitorId}_Multiply'>`;
  let divideLabel = `<label class='tooltip'>
                      Divide Actions
                      <span class='popuptooltiptext'>Comma separated list of actions and their corresponding factors for the action passing and failing [for dividing the monitor in the form of [action, pass factor, fail factor]] (e.g. [split, 2, 1], [deal cards, 4, 1])</span>
                      </label>`;
  let divide = `<input type='text' id='${monitorId}_Divide'>`;
  let passSetLabel = `<label class='tooltip'>
                    Passed Actions
                    <span class='popuptooltiptext'>Comma separated list of actions and their corresponding value to which the monitor will be set if the action is valid (e.g. [reset, 100], [half, 50])</span>
                    </label>`;
  let passSet = `<input type='text' id='${monitorId}_passSet'>`;
  let failSetLabel = `<label class='tooltip'>
                    Failed Actions
                    <span class='popuptooltiptext'>Comma separated list of actions and their corresponding value to which the monitor will be set if the action fails (e.g. [shoot target, 0], [climb tree, 0])</span>
                    </label>`;
  let failSet = `<input type='text' id='${monitorId}_failSet'>`;
  let requirements = getRequirements(monitorId);
  let html = 
    newDivStart +
    rmvButton +
    monitorLabel +
    monitor +
    initialLabel +
    initial +
    onStartLabel +
    onStart +
    displayLabel +
    display +
    onEndLabel +
    onEnd +
    randomLabel +
    random +
    includeZero +
    addSubtractLabel +
    addSubtract +
    multiplyLabel +
    multiply +
    divideLabel +
    divide +
    passSetLabel +
    passSet +
    failSetLabel +
    failSet +
    requirements +
    newDivEnd;

    $("#monitorList").append(html);
}

function getActionHTML(actionId, className) {
  let newDivStart = `<div class='popupBlockElements' id='${actionId}'>`;
  let newDivEnd = "</div>";
  let rmvButton = `<button class='removeObject'>Remove Action</button>`;
  let actionLabel = `<label class='tooltip'>
                        Action(s)
                        <span class='${className}'>The following boxes are for constructing the various accepted user inputs for this action</span>
                        </label>`;
  let pureActionDivStart = `<div class="divBorder">
                            <label class='tooltip'>
                            Full Actions
                            <span class='${className}'>Comma separated list of complete actions (Useful for when a verb and noun pair is not present or necessary - e.g. gameplay passwords and other simple dialogue) [Ignores: a, an, the, to, for, at - unless otherwise defined]</span>
                            </label>`;
  let actions = `<input type='text' id='${actionId}_Actions'>`;
  let includeOnly = `<span style="display: flex">
                        <label class='tooltip'>
                        Need only include: 
                        <span class='tooltiptext'>If checked, the user's input need only to include the action text (i.e. the action "abracadabra" would pass with an input of "the password is abracadabra")</span>
                        </label>
                        <input type='checkbox' id='${actionId}_includeOnly'/>
                      </span>`;
  let pureActionDivEnd = `</div>`;
  let constructedActionDivStart = `<div class="divBorder">
                                  <label class='tooltip'>
                                  Constructed Action
                                  <span class='${className}'>The following inputs are used to construct a [verb + noun(s)] action (The action is triggered if at least 1 word/phrase from each used input is present in the user's input [Note: One verb input is required and all required words are required])</span>
                                  </label>`;
  let actionVerbsLabel = `<label class='tooltip'>
                          Verb(s)
                          <span class='${className}'>Comma separated list of accepted verbs for this action (e.g. cut, break, smash)</span>
                          </label>`;
  let actionVerbs = `<input type='text' id='${actionId}_actionVerbs'>`;
  let primaryNounsLabel = `<label class='tooltip'>
                          Primary Noun(s)
                          <span class='${className}'>Comma separated list of primary nouns for this action (e.g. lock, padlock)</span>
                          </label>`;
  let primaryNouns = `<input type='text' id='${actionId}_primaryNouns'>`;
  let secondaryNounsLabel = `<label class='tooltip'>
                            Secondary Noun(s)
                            <span class='${className}'>Comma separated list of secondary nouns for this action (e.g. box, chest)</span>
                            </label>`;
  let secondaryNouns = `<input type='text' id='${actionId}_secondaryNouns'>`;
  let requiredWordsLabel = `<label class='tooltip'>
                            Required Word(s)
                            <span class='${className}'>Comma separated list of required words for this action (e.g. with, use)</span>
                            </label>`;
  let requiredWords = `<input type='text' id='${actionId}_requiredWords'>`;
  let constructedActionDivEnd = `</div>`;
  let maxLabel = `<label class='tooltip'>
                    Max Uses
                    <span class='${className}'>A number for the maximum number of times this action can be called [leave blank for no maximum]</span>
                    </label>`;
  let max = `<input type='text' id='${actionId}_Max'>`;
  let costsLabel = `<label class='tooltip'>
                    Costs
                    <span class='${className}'>Comma separated list of items which are spent/destroyed to perform this action</span>
                    </label>`;
  let costs = `<input type='text' id='${actionId}_Costs'>`;
  let dropsLabel = `<label class='tooltip'>
                    Drops
                    <span class='${className}'>Comma separated list of items which are dropped to perform this action</span>
                    </label>`;
  let drops = `<input type='text' id='${actionId}_Drops'>`;
  let moveLabel = `<label class='tooltip'>
                  Move To
                  <span class='${className}'>X,Y,Z coordinates of node to which successfully calling this action moves the player</span>
                  </label>`;
  let move = `<input type='text' id='${actionId}_Move'>`;
  let visibilityLabel = `<label class='tooltip'>
                        Visibility
                        <span class='${className}'>Selection for how this action affects this node's visibility</span>
                        </label>`;
  let visibility = `<select id='${actionId}_Visibility'>
                        <option value='none' seleted='selected'>No change</option>
                        <option value='on'>On</option>
                        <option value='off'>Off</option>
                        <option value='switch'>Switch</option>
                        </select>`;
  let responseLabel = `<label class='tooltip'>
                        Action Response
                        <span class='${className}'>Text displayed after successfully calling this action (e.g. The egg is now broken.)</span>
                        </label>`;
  let response = `<textarea id='${actionId}_Response' rows='3' cols='23'></textarea>`;
  let failLabel = `<label class='tooltip'>
                        Fail Response
                        <span class='${className}'>Text displayed after not meeting the action requirements (e.g. This door requires a key.)</span>
                        </label>`;
  let fail = `<textarea id='${actionId}_Fail' rows='3' cols='23'></textarea>`;
  let pointsLabel = `<label class='tooltip'>
                    Points
                    <span class='${className}'>Points awarded for successfully calling this action [default of 0]</span>
                    </label>`;
  let points = `<input type='text' id='${actionId}_Points'>`;
  let requirements = getRequirements(actionId);

  let html =
    newDivStart +
    rmvButton +
    actionLabel +
    pureActionDivStart +
    actions +
    includeOnly +
    pureActionDivEnd +
    constructedActionDivStart +
    actionVerbsLabel +
    actionVerbs +
    primaryNounsLabel +
    primaryNouns +
    secondaryNounsLabel +
    secondaryNouns +
    requiredWordsLabel +
    requiredWords +
    constructedActionDivEnd +
    maxLabel +
    max +
    costsLabel +
    costs +
    dropsLabel +
    drops +
    moveLabel +
    move +
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
  return html;
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
  let html = getActionHTML(actionId, "tooltiptext");
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
      if (menu != block) {
        let x = $(`#${menu}`)[0];
        x.style.display = "none";
      } else {
        let x = $(`#${menu}`)[0];
        if (x.style.display == "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
      }
    }
  }
}

function addInitEvo(listId, itemNumber) {
  let length = $(`#${listId}`).children().length;
  let evoId;
  if (length >= 1) {
    let lastId = +$(`#${listId}`).children().last().attr("id").split("_")[2];
    evoId = `initEvoItems_${itemNumber}_${lastId + 1}`;
  } else {
    evoId = `initEvoItems_${itemNumber}_1`;
  }
  let newDivStart = `<div class='popupBlockElements' id='${evoId}'>`;
  let evoHeading = `<label><b>Evolution</b></label>`;
  let newDivEnd = "</div>";
  let requirements = getRequirements(evoId);
  let evoDesLabel = `<label class='tooltip'>
                    <b>Evo Description</b>
                    <span class='popuptooltiptext'>The text displayed for this setting after meeting the above requirements</span>
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
  } else if (listId.includes("evoListInvalids")) {
    if (length >= 1) {
      let lastId = +$(`#${listId}`).children().last().attr("id").split("_")[1];
      evoId = `evoInvalid_${lastId + 1}`;
    } else {
      evoId = "evoInvalid_1";
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

function changeStyle(style) {
  switch(style) {
    case "classic":
      //Node tools
      $("#descriptionsBlockBtn").css("visibility", "visible");
      $("#itemsBlockBtn").css("visibility", "visible");
      $("#containersBlockBtn").css("visibility", "visible");
      $("#actionsBlockBtn").css("visibility", "visible");
      $("#winBlockBtn").css("visibility", "visible");
      $("#loseBlockBtn").css("visibility", "visible");
      $("#hintBlockBtn").css("visibility", "visible");
      //Globals
      $("#globalActionsOpen").css("visibility", "visible");
      $("#initItemsOpen").css("visibility", "visible");
      $("#conDepOpen").css("visibility", "visible");
      $("#conWitOpen").css("visibility", "visible");
      $("#takesOpen").css("visibility", "visible");
      $("#dropsOpen").css("visibility", "visible");
      $("#ignorablesOpen").css("visibility", "visible");
      $("#looksOpen").css("visibility", "visible");
      $("#examinesOpen").css("visibility", "visible");
      //Visibility
      $("#visibility").css("visibility", "visible");
      $("#visibilityLabel").css("visibility", "visible");
      break;
    case "modern":
      //Node tools
      $("#descriptionsBlockBtn").css("visibility", "visible");
      $("#itemsBlockBtn").css("visibility", "hidden");
      $("#containersBlockBtn").css("visibility", "hidden");
      $("#actionsBlockBtn").css("visibility", "visible");
      $("#winBlockBtn").css("visibility", "visible");
      $("#loseBlockBtn").css("visibility", "visible");
      $("#hintBlockBtn").css("visibility", "hidden");
      $("#itemsBlock").css("display", "none");
      $("#containersBlock").css("display", "none");
      $("#hintBlock").css("display", "none");
      //Globals
      $("#globalActionsOpen").css("visibility", "visible");
      $("#initItemsOpen").css("visibility", "hidden");
      $("#conDepOpen").css("visibility", "hidden");
      $("#conWitOpen").css("visibility", "hidden");
      $("#takesOpen").css("visibility", "hidden");
      $("#dropsOpen").css("visibility", "hidden");
      $("#ignorablesOpen").css("visibility", "hidden");
      $("#looksOpen").css("visibility", "hidden");
      $("#examinesOpen").css("visibility", "hidden");
      //Visibility
      $("#visibility").css("visibility", "hidden");
      $("#visibilityLabel").css("visibility", "hidden");

      break;
    case "gamebook":
      //Node tools
      $("#descriptionsBlockBtn").css("visibility", "visible");
      $("#itemsBlockBtn").css("visibility", "hidden");
      $("#containersBlockBtn").css("visibility", "hidden");
      $("#actionsBlockBtn").css("visibility", "hidden");
      $("#winBlockBtn").css("visibility", "visible");
      $("#loseBlockBtn").css("visibility", "visible");
      $("#hintBlockBtn").css("visibility", "hidden");
      $("#itemsBlock").css("display", "none");
      $("#containersBlock").css("display", "none");
      $("#actionsBlock").css("display", "none");
      $("#hintBlock").css("display", "none");
      //Globals
      $("#globalActionsOpen").css("visibility", "hidden");
      $("#initItemsOpen").css("visibility", "hidden");
      $("#conDepOpen").css("visibility", "hidden");
      $("#conWitOpen").css("visibility", "hidden");
      $("#takesOpen").css("visibility", "hidden");
      $("#dropsOpen").css("visibility", "hidden");
      $("#ignorablesOpen").css("visibility", "hidden");
      $("#looksOpen").css("visibility", "hidden");
      $("#examinesOpen").css("visibility", "hidden");
      //Visibility
      $("#visibility").css("visibility", "hidden");
      $("#visibilityLabel").css("visibility", "hidden");

      break;
    default:
      break;
  }
}

function handleGlobalCheckboxes(popup) {
  switch(popup) {
    case "actions":
      loadDomGlobalActions(globalActions);
      break;
    case "items":
      loadDomInitItems(initItems);
      break;
    case "monitors":
      loadDomMonitors(monitors);
      break;
    case "win":
      loadDomGlobalWin(globalWin);
      break;
    case "lose":
      loadDomGlobalLose(globalLose);
      break;
    default:
      break;
  }
}

function getRequirements(baseId) {
  let divStart = `<div class='requirements'>`;
  let reqLabel = `<label class='tooltip'>
                    <span style="display: flex;"><b>Requirements</b> <button class='showHideReqs'>&#9660;</button></span>
                    <span class='tooltiptext'>The current node setting will only exist/apply if the following conditions are met</span>
                    </label>`;
  let reqsBlockStart = `<div class="thisBlock" style="display: none;">`;
  let reqAllAndNot = `<div style="display: flex;">
                    <div>
                    <label class='pure-checkbox tooltip'>
                    Require All
                    <span class='tooltiptext'>If checked, all listed requirements must be satisified (otherwise only one or more is required)</span>
                    </label>
                    <input type='checkbox' id='${baseId}_reqAll'/>
                    </div>
                    <div>
                    <label class='pure-checkbox tooltip'>
                    Nots
                    <span class='tooltiptext'>Displays 'not' checkboxes for each requirement.  
                    If these are checked, the corresponding requirement must NOT be satisfied (otherwise that requirement check fails)</span>
                    </label>
                    <input type='checkbox' class='toggleNots' id='${baseId}_reqNot'/>
                    </div>
                    </div>`;
  let reqItems = `<label class='tooltip'>
                    Items
                    <span class='tooltiptext'>Comma separated items required for this setting (e.g. keys, bottle, food, etc.)</span>
                    </label>
                    <div class="reqLine">
                    <input id='${baseId}_Items' type='text'>
                    <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_itemsNot'/>
                    </div>`;
  let reqContainers = `<label class='tooltip'>
                        Containers
                        <span class='tooltiptext'>Comma separated containers required to be "complete" for this setting</span>
                        </label>
                        <div class="reqLine">
                        <input id='${baseId}_Containers' type='text'>
                        <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_containersNot'/>
                        </div>`;
  let reqLocal = `<label class='tooltip'>
                    Local Actions
                    <span class='tooltiptext'>Comma separated actions which the player is required to have entered in this node location (e.g. unlock gate, break window)</span>
                    </label>
                    <div class="reqLine">
                    <input id='${baseId}_Local' type='text'>
                    <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_localNot'/>
                    </div>`;
  let reqGlobal = `<label class='tooltip'>
                    Global Actions
                    <span class='tooltiptext'>Comma separated actions which the player is required to have entered in any node (e.g. abracadabra, forge key)</span>
                    </label>
                    <div class="reqLine">
                    <input id='${baseId}_Global' type='text'>
                    <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_globalNot'/>
                    </div>`;
  let preAction = `<label class='tooltip'>
                    Previous Action
                    <span class='tooltiptext'>The action required to have been successfully called most recently</span>
                    </label>
                    <div class="reqLine">
                    <input id='${baseId}_preAction' type='text'>
                    <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_preActionNot'/>
                    </div>`;
  let reqVisits = `<label class='tooltip'>
                    Node Visits
                    <span class='tooltiptext'>Comma separated list of locations and required number of visits to each (in form of [location, visits]) (e.g. [0,0,0,1], [0,2,0,1], [2,3,0,1])</span>
                    </label>
                    <div class="reqLine">
                    <input id='${baseId}_Visits' type='text'>
                    <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_visitsNot'/>
                    </div>`;
  let preNode = `<label class='tooltip'>
                    Previous Node
                    <span class='tooltiptext'>Comma separated coordinates of the node required to be the last visited node (prior to the current node)(e.g. 1,2,3 )</span>
                    </label>
                    <div class="reqLine">
                    <input id='${baseId}_preNode' type='text'>
                    <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_preNodeNot'/>
                    </div>`;
  let reqEvos = `<label class='tooltip'>
                    Item Evos
                    <span class='tooltiptext'>Comma separated list of items and the required evolution stage for each (e.g. [key, 1], [knife, 2])</span>
                    </label>
                    <div class="reqLine">
                    <input id ='${baseId}_Evos' type='text'>
                    <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_evosNot'/>
                    </div>`;
  let reqPastDes = `<label class='tooltip'>
                      Past Descriptions
                      <span class='tooltiptext'>Description evolution stage whose requirements must have been met at least once in a given node (in form of [location, stage]) (e.g. [0,0,0,1])</span>
                      </label>
                      <div class="reqLine">
                      <input id ='${baseId}_pastDes' type='text'>
                      <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_pastDesNot'/>
                      </div>`;
  let reqFails = `<label class='tooltip'>
                      Failed Inputs
                      <span class='tooltiptext'>Required number of failed inputs in this node [If checked, then the fails must be consecutive]</span>
                      </label>
                      <div class="reqLine">
                      <input id ='${baseId}_reqFails' type='text'>
                      <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_reqFailsNot'/>
                      </div>
                      <div style="display: flex;">&nbsp;&nbsp;&nbsp;&nbsp;Consecutive:&nbsp;&nbsp;&nbsp;<input type='checkbox' id='${baseId}_reqFailsCheck'/></div>`;
  let reqValids = `<label class='tooltip'>
                      Valid Inputs
                      <span class='tooltiptext'>Required number of valid inputs in this node [If checked, then the valids must be consecutive]</span>
                      </label>
                      <div class="reqLine">
                      <input id ='${baseId}_reqValids' type='text'>
                      <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_reqValidsNot'/>
                      </div>
                      <div style="display: flex;">&nbsp;&nbsp;&nbsp;&nbsp;Consecutive:&nbsp;&nbsp;&nbsp;<input type='checkbox' id='${baseId}_reqValidsCheck'/></div>`;
  let reqChance = `<label class='tooltip'>
                  Percent Chance
                  <span class='tooltiptext'>The percent chance that this requirement is met [integer from 1 to 100]</span>
                  </label>
                  <div class="reqLine">
                  <input id ='${baseId}_reqChance' type='text'>
                  <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_reqChanceNot'/>
                  </div>`;
  let reqMonitor = `<label class='tooltip'>
                    Monitor Values
                    <span class='tooltiptext'>Comma separated list of monitors and their required value (in form of [monitor, value]) (e.g. [health, 0], [thirst, 0])</span>
                    </label>
                    <div class="reqLine">
                    <input id ='${baseId}_reqMonitors' type='text'>
                    <input class='${baseId}_notBox notBox' style="visibility: hidden;" type='checkbox' id='${baseId}_reqMonitorsNot'/>
                    </div>
                    <div style="display: flex;">&nbsp;&nbsp;&nbsp;&nbsp;Include less than:&nbsp;&nbsp;&nbsp;<input type='checkbox' id='${baseId}_reqMonitorsLessThan'/></div>
                    <div style="display: flex;">&nbsp;&nbsp;&nbsp;&nbsp;Include greater than:&nbsp;&nbsp;&nbsp;<input type='checkbox' id='${baseId}_reqMonitorsGreaterThan'/></div>`;
  let reqsBlockEnd = `</div>`;
  let divEnd = `</div>`;

  let html =
    divStart +
    reqLabel +
    reqsBlockStart +
    reqAllAndNot +
    reqItems +
    reqContainers +
    reqLocal +
    reqGlobal +
    preAction +
    reqVisits +
    preNode +
    reqEvos +
    reqPastDes +
    reqFails +
    reqValids +
    reqChance +
    reqMonitor +
    reqsBlockEnd +
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
  addInitEvo,
  getRequirements,
  removeEvo,
  removeObject,
  loadDomCustomCommands,
  loadDefaultCommands,
  loadDomGlobalActions,
  loadDomInitItems,
  loadDomFromNode,
  addSimInput,
  addGlobalAction,
  addInitItem,
  addMonitor,
  addGlobalWin,
  addGlobalLose,
  loadDomMonitors,
  loadDomGlobalWin,
  loadDomGlobalLose,
  showHideNotBoxes,
  changeStyle,
  handleGlobalCheckboxes,
  setNodeColor
};
