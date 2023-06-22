import {game, gameTitle, gameStyle, gameAuthor} from './if_generate.js';

var currentNode;
var previousNode;
var cNodeDescription;
var cNodeDirections;
var cNodeItems;
var cPlayerItems;
var cContainerDeposits;
var cContainerWithdrawals;
var cItemInspections;
var cNodeActions;
var badAction;
var playing;

var save;

var takeCommands = ["GET","TAKE", "PICK UP", "OBTAIN", "GRAB"];
var dropCommands = ["DROP", "PUT DOWN"];
var inventoryCommands = ["INVENTORY", "INV", "I", "INVEN"];
var hintCommands = ["HINT", "HELP"];
var itemInspectCommands = ["INSPECT", "LOOK", "EXAMINE"];
var ignorables = ["A", "AN", "THE", "TO", "FOR", "AT"];

function gameInit() {
    playing = true;
    previousNode = "0,0,0";
    currentNode = "0,0,0";
    badAction = 0;
    save = {
        "items": [],
        "actions": [],
        "nodes": {}
    };
    $('#outputSim').empty();
    $('#outputSim').append(`<h1>${gameTitle}</h1>`);
    if (gameAuthor.length > 0) {
        $('#outputSim').append(`<h6>Created by: ${gameAuthor}</h6>`);
    }
    parseNode(currentNode);
}

function addNodeToSave (location) {
    if (!save["nodes"].hasOwnProperty(location)) {
        let visibility = JSON.parse(JSON.stringify(game[location].visibility));
        let points = JSON.parse(JSON.stringify(game[location].points));
        let nodeInit = {
            "visibility": visibility,
            "visits": "0",
            "items": JSON.parse(JSON.stringify(game[location].items)),
            "containers": JSON.parse(JSON.stringify(game[location].containers)),
            "actions": [],
            "points": points
        }
        save.nodes[location] = JSON.parse(JSON.stringify(nodeInit));
    }
}

function addVisit(location) {
    save.nodes[location].visits = (Number(save.nodes[location].visits) + 1).toString();
}

function getVisits(location) {
    return Number(save.nodes[location].visits);
}

function displayMessage(message, input) {
    if (message.length == 0) {
        return;
    }
    if (input) {
        $('#outputSim').append(`<p class='scrollTo'><b>&nbsp;&nbsp;>&nbsp;${message}</b></p>`);
    } else {
        $('#outputSim').append(`<p>${message}</p>`);
    }
    if ($(".scrollTo").length == 0) {
        $('#outputSim')[0].lastElementChild.scrollIntoView(true);
    } else {
        $('.scrollTo').last()[0].scrollIntoView(true);
    }
}

function getActions(location) {
    let actions = [];
    if (gameStyle == "modern") {
        for (let i = 0; i < game[currentNode].actions.actions.length; i++) {
            let reqs = {
                "reqItems": game[currentNode].actions.actions[i].reqItems,
                "reqContainers": game[currentNode].actions.actions[i].reqContainers,
                "reqLocal": game[currentNode].actions.actions[i].reqLocal,
                "reqGlobal": game[currentNode].actions.actions[i].reqGlobal,
                "preAction": game[currentNode].actions.actions[i].preAction,
                "locVisits": game[currentNode].actions.actions[i].locVisits,
                "preNode": game[currentNode].actions.actions[i].preNode,
                "itemEvos": game[currentNode].actions.actions[i].itemEvos
            }
            let reqCheck = checkRequirements(reqs);
            if (!reqCheck && game[currentNode].actions.actions[i].fail.length == 0) {
                continue;
            } else {
                let variants = game[currentNode].actions.actions[i].actions.split(/\s*,\s*/);
                for (let j = 0; j < variants.length; j++) {
                    actions.push(variants[j]);
                }
            }
        }
        return actions;
    } else {
        for (let i = 0; i < game[currentNode].actions.actions.length; i++) {
            let variants = game[currentNode].actions.actions[i].actions.split(/\s*,\s*/);
            for (let j = 0; j < variants.length; j++) {
                actions.push(variants[j]);
            }
        }
    }
    return actions;
}

function getContainerDepositActions(location) {
    let actionParts = {
        "verbs": ["STORE","DEPOSIT","PLACE","PUT"],
        "items": [],
        "containers": []
    };
    for (let i = 0; i < save.items.length; i++) {
        let variants = save.items[i].name.split(/\s*,\s*/);
        actionParts.items.push(variants);
    }
    for (let i = 0; i < game[location].containers.length; i++) {
        let variants = game[location].containers[i].name.split(/\s*,\s*/);
        actionParts.containers.push(variants);
    }
    return actionParts;
}

function getContainerWithdrawalActions(location) {
    let actionParts = {
        "verbs": ["TAKE", "GET", "RETRIEVE", "WITHDRAWAL", "OBTAIN"],
        "items": [],
        "containers": []
    }
    for (let i = 0; i < save.nodes[location].containers.length; i++) {
        if (save.nodes[location].containers[i].items.length > 0) {
            let containerVariants = save.nodes[location].containers[i].name.split(/\s*,\s*/);
            let itemArray = [];
            for (let j = 0; j < save.nodes[location].containers[i].items.length; j++) {
                let itemVariants = save.nodes[location].containers[i].items[j].name.split(/\s*,\s*/);
                itemArray.push(itemVariants);
            }
            actionParts.containers.push(containerVariants);
            actionParts.items.push(itemArray);
        }
    }
    return actionParts;
}

function checkItemOrigin(item) {
    //Checks if item is in its original node or has been moved to another node
    //If another node, local actions requirement is void
    let originNode = false;
    let checked = false;
    let gameNodes = Object.keys(game);
    for (let i = 0; i < gameNodes.length; i++) {
        let nodeItems = game[gameNodes[i]].items;
        for (let j = 0; j < nodeItems.length; j++) {
            if (nodeItems[j].name == item.name) {
                checked = true;
                if (gameNodes[i] == currentNode) {
                    originNode = true;
                }
            }
        }
        if (checked) {
            break;
        }
    }
    return originNode;
}

function getDiscoveredItemsActions(location) {
    let items = JSON.parse(JSON.stringify(save.nodes[location].items));
    let itemActions = [];
    let legalItems = [];
    for (let i = 0; i < items.length; i++) {
        let originNode = checkItemOrigin(items[i]);
        let reqs = {
            "reqItems": items[i].reqItems,
            "reqContainers": items[i].reqContainers,
            "reqLocal": (originNode) ? items[i].reqLocal: '',
            "reqGlobal": items[i].reqGlobal,
            "preAction": (originNode) ? items[i].preAction: '',
            "locVisits": items[i].locVisits,
            "preNode": (originNode) ? items[i].preNode: '',
            "itemEvos": items[i].itemEvos
        }
        if (checkRequirements(reqs)) {
            let variants = items[i].name.split(/\s*,\s*/);
            legalItems.push(variants);
        }
    }
    for (let i = 0; i < legalItems.length; i++) {
        for (let j = 0; j < legalItems[i].length; j++) {
            for (let k = 0; k < takeCommands.length; k++) {
                let newAction = `${takeCommands[k]} ${legalItems[i][j].toUpperCase()}`;
                itemActions.push(newAction);
            }
        }
    }
    return itemActions;
}

function getExistingItemsActions() {
    let items = JSON.parse(JSON.stringify(save.items));
    let itemActions = [];
    for (let i = 0; i < items.length; i++) {
        let variants = items[i].name.split(/\s*,\s*/);
        for (let j = 0; j < variants.length; j++) {
            for (let k = 0; k < dropCommands.length; k++) {
                let newAction = `${dropCommands[k]} ${variants[j].toUpperCase()}`;
                itemActions.push(newAction);
            }
        }
    }
    return itemActions;
}

function getItemInspectionActions() {
    let items = JSON.parse(JSON.stringify(save.items));
    let inspectActions = [];
    for (let i = 0; i < items.length; i++) {
        let variants = items[i].name.split(/\s*,\s*/);
        for (let j = 0; j < variants.length; j++) {
            for (let k = 0; k < itemInspectCommands.length; k++) {
                let newAction = `${itemInspectCommands[k]} ${variants[j].toUpperCase()}`;
                inspectActions.push(newAction);
            }
        }
    }
    return inspectActions;
}

function getDirectionsActions (location) {
    let directions = [];
    for (let i = 0; i < game[location].directions.length; i++) {
        let thisDirection = game[location].directions[i].direction;
        let thisLocation = game[location].directions[i].location;
        let reqs = {
            "reqItems": game[location].directions[i].reqItems,
            "reqContainers": game[location].directions[i].reqContainers,
            "reqLocal": game[location].directions[i].reqLocal,
            "reqGlobal": game[location].directions[i].reqGlobal,
            "preAction": game[location].directions[i].preAction,
            "locVisits": game[location].directions[i].locVisits,
            "preNode": game[location].directions[i].preNode,
            "itemEvos": game[location].directions[i].itemEvos
        };
        let directionObject = {
            "direction": thisDirection,
            "alternatives": [],
            "location": thisLocation,
            "requirements": reqs
        };
        let alts = game[location].directions[i].alternatives.split(/\s*,\s*/);
        let exclude = game[location].directions[i].exclude;

        if (exclude !== "true") {
            switch (thisDirection) {
                case ("N"):
                    directionObject["alternatives"] = [
                            "GO N",
                            "GO NORTH",
                            "TRAVEL N",
                            "TRAVEL NORTH"
                        ];
                    break;
                case ("NE"):
                    directionObject["alternatives"] = [
                            "GO NE",
                            "GO NORTHEAST",
                            "TRAVEL NE",
                            "TRAVEL NORTHEAST"
                        ];
                    break;
                case ("E"):
                    directionObject["alternatives"] = [
                            "GO E",
                            "GO EAST",
                            "TRAVEL E",
                            "TRAVEL EAST"
                        ];
                    break;
                case ("SE"):
                    directionObject["alternatives"] = [
                            "GO SE",
                            "GO SOUTHEAST",
                            "TRAVEL SE",
                            "TRAVEL SOUTHEAST"
                        ];
                    break;
                case ("S"):
                    directionObject["alternatives"] = [
                            "GO S",
                            "GO SOUTH",
                            "TRAVEL S",
                            "TRAVEL SOUTH"
                        ];
                    break;
                case ("SW"):
                    directionObject["alternatives"] = [
                            "GO SW",
                            "GO SOUTHWEST",
                            "TRAVEL SW",
                            "TRAVEL SOUTHWEST"
                        ];
                    break;
                case ("W"):
                    directionObject["alternatives"] = [
                            "GO W",
                            "GO WEST",
                            "TRAVEL W",
                            "TRAVEL WEST"
                        ];
                    break;
                case ("NW"):
                    directionObject["alternatives"] = [
                            "GO NW",
                            "GO NORTHWEST",
                            "TRAVEL NW",
                            "TRAVEL NORTHWEST"
                        ];
                    break;
                case ("Up"):
                    directionObject["alternatives"] = [
                            "GO UP",
                            "TRAVEL UP"
                            ];
                    break;
                case ("Down"):
                    directionObject["alternatives"] = [
                            "GO DOWN",
                            "TRAVEL DOWN"
                            ];
                    break;
            }
        }
        for (let j = 0; j < alts.length; j++) {
            directionObject.alternatives.push(alts[j].toUpperCase());
        }
        directions.push(directionObject);
    }
    return directions;
}

function getDescription (location) {
    let description = JSON.parse(JSON.stringify(game[location].description));
    let output;
    for (let i = 0; i < description.evos.length; i++) {
        let thisEvo = description.evos[i];
        let requirements = {
            "reqItems": thisEvo.reqItems,
            "reqContainers": thisEvo.reqContainers,
            "reqLocal": thisEvo.reqLocal,
            "reqGlobal": thisEvo.reqGlobal,
            "preAction": thisEvo.preAction,
            "locVisits": thisEvo.locVisits,
            "preNode": thisEvo.preNode,
            "itemEvos": thisEvo.itemEvos
        }
        if (checkRequirements(requirements)) {
            output = thisEvo.evoDes;
        }
    }

    if (!output) {
        let saveActions = save.nodes[currentNode].actions;
        if (saveActions[saveActions.length - 1] == "LOOK") {
            if (description["basicDes"].length > 0) {
                output = description["basicDes"];
            } else {
                output = description["defaultDes"];
            }
        } else {
            if (getVisits(location) > 1 && description["basicDes"].length > 0) {
                output = description["basicDes"];
            } else {
                output = description["defaultDes"];
            }
        }
    }
    return output;
}

function checkContainerComplete(container) {
    let completeReqs = container.complete;
    let currentItems = container.items;
    if (!isNaN(parseInt(completeReqs))) {
        let capacity = parseInt(completeReqs);
        if (!currentItems.length >= capacity) {
            return false;
        }
    } else {
        completeReqs = completeReqs.split(/\s*,\s*/);
        let currentItemNames = [];
        for (let i = 0; i < currentItems.length; i++) {
            currentItemNames.push(currentItems[i].name.split(/\s*,\s*/)[0].toUpperCase());
        }
        for (let i = 0; i < completeReqs.length; i++) {
            if (!currentItemNames.includes(completeReqs[i].toUpperCase())) {
                return false;
            }
        }
    }
    return true;
}

function checkRequirements(reqs) {
    let reqItems = !reqs['reqItems'] ? [] : reqs['reqItems'].split(/\s*,\s*/);
    let reqContainers = !reqs['reqContainers'] ? [] : reqs['reqContainers'].split(/\s*,\s*/);
    let reqLocal = !reqs['reqLocal'] ? [] : reqs['reqLocal'].split(/\s*,\s*/);
    let reqGlobal = !reqs['reqGlobal'] ? [] : reqs['reqGlobal'].split(/\s*,\s*/);
    let preAction = !reqs['preAction'] ? '' : reqs['preAction'];
    let locVisits = !reqs['locVisits'] ? [] : reqs['locVisits'].split(/\]\s*,\s*/);
    let preNode = !reqs['preNode'] ? '' : reqs['preNode'];
    let itemEvos = !reqs['itemEvos'] ? [] : reqs['itemEvos'].split(/\]\s*,\s*/);

    //Check for container fulfillment requirements
    for (let i = 0; i < reqContainers.length; i++) {
        let checked = false;
        let containerName = reqContainers[i].toUpperCase();
        for (const key in save.nodes) {
        //for (let j = 0; j < save.nodes.length; j++) {
            if (checked == true) {
                break;
            }
            for (let k = 0; k < save.nodes[key].containers.length; k++) {
                if (checked == true) {
                    break;
                }
                //If true, found the container that is required to be complete
                if (save.nodes[key].containers[k].name.split(/\s*,\s*/)[0].toUpperCase() == containerName) {
                    checked = true;
                    if (!checkContainerComplete(save.nodes[key].containers[k])) {
                        return false;
                    }
                }
            }
        }
    }

    //Check local node action requirements
    for (let i = 0; i < reqLocal.length; i++) {
        if (!save.nodes[currentNode].actions.includes(reqLocal[i].toUpperCase())) {
            return false;
        }
    }
    //Check global action requirements
    for (let i = 0; i < reqGlobal.length; i++) {
        if (!save.actions.includes(reqGlobal[i].toUpperCase())) {
            return false;
        }
    }
    //Check previous action requirement
    if (preAction != '' && preAction.toUpperCase() != save.actions[save.actions.length - 1]) {
        return false;
    }

    //Check location visit requirements
    for (let i = 0; i < locVisits.length; i++) {
        let locArray = JSON.parse(locVisits[i]);
        let loc = `${locArray[0]},${locArray[1]},${locArray[2]}`;
        let quant = locArray[3];
        if (quant > 0){
            if (!save.nodes.hasOwnProperty(loc)) {
                return false;
            } else {
                if (Number(save.nodes[loc].visits) < quant) {
                    return false;
                }
            }
        } else if (quant == 0) {
            if (!save.nodes.hasOwnProperty(loc)) {
                continue;
            } else {
                if (Number(save.nodes[loc].visits) != 0) {
                    return false;
                }
            }
        }
    }

    //Check previous node requirement
    if (preNode != '' & preNode != previousNode) {
        return false;
    }

    //create saved items list
    let itemArray = []
    for (let i = 0; i < save.items.length; i++) {
        itemArray.push(save.items[i].name.toUpperCase());
    }

    //check if required items exist in array
    for (let i = 0; i < reqItems.length; i++) {
        let itemIncluded = false;
        for (let j = 0; j < itemArray.length; j++) {
            if (itemArray[j].includes(reqItems[i].toUpperCase())) {
                itemIncluded = true;
                break;
            }
        }
        if (!itemIncluded) {
            return false;
        }
    }
    
    //check if evoItems exist and then if they are evolved
    for (let i = 0; i < itemEvos.length; i++) {
        let itemEvo = itemEvos[i].replace(/^\[|\]$/g, '').split(/\s*,\s*/);
        let checked = false;
        for (let j = 0; j < itemArray.length; j++) {
            let item = itemArray[j].split(/\s*,\s*/)[0];
            if (item == itemEvo[0].toUpperCase()) {
                checked = true;
                for (let k = 0; k < save.items.length; k++) {
                    if (save["items"][k].name.split(/\s*,\s*/)[0].toUpperCase() === itemEvo[0].toUpperCase()) {
                        let checkIndex = 0;
                        let evoIndex = 0;
                        for (let l = 0; l < save["items"][k].evos.length; l++) {
                            checkIndex++;
                            let reqs = {
                                "reqItems": save["items"][k].evos[l].reqItems,
                                "reqContainers": save["items"][k].evos[l].reqContainers,
                                "reqLocal": save["items"][k].evos[l].reqLocal,
                                "reqGlobal": save["items"][k].evos[l].reqGlobal,
                                "preAction": save["items"][k].evos[l].preAction,
                                "locVisits": save["items"][k].evos[l].locVisits,
                                "preNode": save["items"][k].evos[l].preNode,
                                "itemEvos": save["items"][k].evos[l].itemEvos
                            }
                            if (checkRequirements(reqs)) {
                                evoIndex = checkIndex;
                            }
                        }
                        if (evoIndex !== +itemEvo[1]) {
                            return false;
                        }
                    }
                }
            } 
        }
        if (!checked) {
            return false;
        }
    }

    return true;
}

function checkWin() {
    let win = game[currentNode].win;
    let reqs = {
        "reqItems": win.reqItems,
        "reqContainers": win.reqContainers,
        "reqLocal": win.reqLocal,
        "reqGlobal": win.reqGlobal,
        "preAction": win.preAction,
        "locVisits": win.locVisits,
        "preNode": win.preNode,
        "itemEvos": win.itemEvos
    }
    if (checkRequirements(reqs) && win.description.length > 0) {
        let max = getMaxPoints();
        displayMessage(win.description, false);
        if (max != 0) {
            let points = tallyPoints();
            displayMessage("Score: " + points.toString() + "/" + max.toString(), false);
        }
        playing = false;
    }
}

function checkLose() {
    let lose = game[currentNode].lose;
    let reqs = {
        "reqItems": lose.reqItems,
        "reqContainers": lose.reqContainers,
        "reqLocal": lose.reqLocal,
        "reqGlobal": lose.reqGlobal,
        "preAction": lose.preAction,
        "locVisits": lose.locVisits,
        "preNode": lose.preNode,
        "itemEvos": lose.itemEvos
    }
    if (checkRequirements(reqs) && lose.description.length > 0) {
        let max = getMaxPoints();
        displayMessage(lose.description, false);
        if (max != 0) {
            let points = tallyPoints();
            displayMessage("Score: " + points.toString() + "/" + max.toString(), false);
        }
        playing = false;
    }
}

function handleHint() {
    if (badAction >= 5) {
        displayMessage(game[currentNode].hint, false);
    }
}

function displayItems() {
    let validItems = [];
    if (save.nodes[currentNode].items.length > 0 && save.nodes[currentNode].visibility == 'true') {
        for (let i = 0; i < save.nodes[currentNode].items.length; i++) {
            let originNode = checkItemOrigin(save.nodes[currentNode].items[i]);
            let reqs = {
                "reqItems": save.nodes[currentNode].items[i].reqItems,
                "reqContainers": save.nodes[currentNode].items[i].reqContainers,
                "reqLocal": (originNode) ? save.nodes[currentNode].items[i].reqLocal : '',
                "reqGlobal": save.nodes[currentNode].items[i].reqGlobal,
                "preAction": save.nodes[currentNode].items[i].preAction,
                "locVisits": save.nodes[currentNode].items[i].locVisits,
                "preNode": save.nodes[currentNode].items[i].preNode,
                "itemEvos": save.nodes[currentNode].items[i].itemEvos
            }
            if (checkRequirements(reqs)) {
                let mainName = save.nodes[currentNode].items[i].name.split(/\s*,\s*/)[0];
                validItems.push(mainName);
            }
        }
        if (validItems.length > 0) {
            displayMessage("Items:", false);
            for (let i = 0; i < validItems.length; i++) {
                displayMessage(validItems[i], false);
            }
        }
    }
}

function getMaxPoints() {
    let quantity = 0;
    let nodes = Object.keys(game);
    for (let i = 0; i < nodes.length; i++) {
        let actions = Object.entries(game[nodes[i]].actions.actions);
        if (game[nodes[i]].points > 0) {
            quantity += +game[nodes[i]].points;
        }
        for (let j = 0; j < game[nodes[i]].items.length; j++) {
            if (game[nodes[i]].items[j].points > 0) {
                quantity += +game[nodes[i]].items[j].points;
            }
        }
        for (let j = 0; j < actions.length; j++) {
            if (actions[j][1].points > 0) {
                quantity += +actions[j][1].points;
            }
        }
        for (let j = 0; j < game[nodes[i]].containers.length; j++) {
            if (game[nodes[i]].containers[j].points > 0) {
                quantity += +game[nodes[i]].containers[j].points;
            }
        }
    }
    return quantity;
}

function tallyPoints() {
    let points = 0;
    let saveNodeKeys = Object.keys(save.nodes);
    for (let i = 0; i < saveNodeKeys.length; i++) {
        if (save.nodes[saveNodeKeys[i]].points > 0) {
            points += +save.nodes[saveNodeKeys[i]].points;
        }
    }
    for (let i = 0; i < save.items.length; i++) {
        if (save.items[i].points > 0) {
            points += +save.items[i].points;
        }
    }
    let gameKeys = Object.keys(game);
    for (let i = 0; i < save.actions.length; i++) {
        for (let j = 0; j < gameKeys.length; j++) {
            let actionObjects = Object.entries(game[gameKeys[j]].actions.actions);
            for (let k = 0; k < actionObjects.length; k++) {
                let mainVariant = actionObjects[k][1].actions.split(/\s*,\s*/)[0];
                if (mainVariant.toUpperCase() == save.actions[i]) {
                    points += +actionObjects[k][1].points;
                }
            }
        }
    }
    for (const key in save.nodes) {
        for (let i = 0; i < save.nodes[key].containers.length; i++) {
            if (save.nodes[key].containers[i].points > 0) {
                if (checkContainerComplete(save.nodes[key].containers[i])) {
                    points += +save.nodes[key].containers[i].points;
                }
            }
        }
    }
    return points;
}

function updateModernActions(actionList) {
    $("#modernStyleActions").empty();
    for (let i = 0; i < actionList.length; i++) {
        let html = `<button class="modernActionButton inputButton" value="${actionList[i]}">${actionList[i]}</button>`;
        $("#modernStyleActions").append(html);
    }
}

function updateModernDirections(directionList) {
    $("#modernStyleDirections").empty();
    for (let i = 0; i < directionList.length; i++) {
        let buttonValue = `${directionList[i].alternatives[0]}`;
        let html = `<button class="modernDirectionButton inputButton" value="${buttonValue}">${directionList[i].alternatives[0]}</button>`;
        $("#modernStyleDirections").append(html);
    }
}

function updateGamebookDirections(directionList) {
    $("#gamebookStyleDirections").empty();
    for (let i = 0; i < directionList.length; i++) {
        let buttonValue = `${directionList[i].alternatives[0]}`;
        let html = `<button class="gamebookDirectionButton inputButton" value="${buttonValue}">${directionList[i].alternatives[0]}</button>`;
        $("#gamebookStyleDirections").append(html);
    }
}

function filterIgnorables(action) {
    let actionParts = action.split(" ");
    for (let i = 0; i < ignorables.length; i++) {
        if (actionParts.includes(ignorables[i])) {
            let index = actionParts.indexOf(ignorables[i]);
            actionParts.splice(index, 1);
        }
    }
    action = actionParts.join(" ");
    return action
}

function pushAction(action) {
    save.actions.push(action);
    save.nodes[currentNode].actions.push(action);
}

function nodeReload() {
    cNodeDescription = getDescription(currentNode);
    cNodeDirections = getDirectionsActions(currentNode);
    cNodeItems = getDiscoveredItemsActions(currentNode);
    cPlayerItems = getExistingItemsActions();
    cContainerDeposits = getContainerDepositActions(currentNode);
    cItemInspections = getItemInspectionActions();
    cContainerWithdrawals = getContainerWithdrawalActions(currentNode);
    cNodeActions = getActions(currentNode);
    if (gameStyle == "modern") {
        updateModernDirections(cNodeDirections);
        updateModernActions(cNodeActions);
    }
    if (gameStyle == "gamebook") {
        updateGamebookDirections(cNodeDirections);
    }
    checkWin();
    checkLose();
}

function parseNode(location) {
    previousNode = `${currentNode}`;
    currentNode = location;
    addNodeToSave(currentNode);
    addVisit(currentNode);
    nodeReload();
    $('#outputSim').append(`<h3>${game[currentNode].name}</h3>`);
    displayMessage(cNodeDescription, false);
    displayItems();
}

function parseAction(input) {
    if (playing) {
        let action = input.toUpperCase();
        let sentMessage = false;

        displayMessage(input, true);

        //Filter out ignorables
        action = filterIgnorables(action);

        //Handle actions
        for (let h = 0; h < cNodeActions.length; h++) {
            if (filterIgnorables(cNodeActions[h].toUpperCase()) == action) {
                for (let i = 0; i < game[currentNode].actions.actions.length; i++) {
                    let variants = game[currentNode].actions.actions[i].actions.toUpperCase().split(/\s*,\s*/);
                    for (let m = 0; m < variants.length; m++) {
                        if (filterIgnorables(variants[m]) == action) {
                            let actionObject = JSON.parse(JSON.stringify(game[currentNode].actions.actions[i]));
                            let reqs = {
                                "reqItems": actionObject.reqItems,
                                "reqContainers": actionObject.reqContainers,
                                "reqLocal": actionObject.reqLocal,
                                "reqGlobal": actionObject.reqGlobal,
                                "preAction": actionObject.preAction,
                                "locVisits": actionObject.locVisits,
                                "preNode": actionObject.preNode,
                                "itemEvos": actionObject.itemEvos
                            }
                            if (checkRequirements(reqs)) {
                                let mainAction = actionObject.actions.split(/\s*,\s*/)[0].toUpperCase();
                                let maxTimes;
                                if (actionObject.max !== '' && actionObject.max !== null) {
                                    maxTimes = +actionObject.max;
                                } else {
                                    maxTimes = 9999;
                                }
                                let usedTimes = 0;
                                for (let j = 0; j < save.actions.length; j++) {
                                    if (save.actions[j] == mainAction) {
                                        usedTimes++;
                                    }
                                }
                                if (!(usedTimes >= maxTimes)) {
                                //Action is valid - perform action operations
                                    let costs = actionObject.costs.split(/\s*,\s*/);
                                    let drops = actionObject.drops.split(/\s*,\s*/);
                                    let visibility = actionObject.visibility;

                                    //Handle action costs
                                    if (costs != "" && costs != null) {
                                        for (let k = 0; k < costs.length; k++) {
                                            for (let l = 0; l < save.items.length; l++) {
                                                if (save.items[l].name.includes(costs[k])) {
                                                    save.items.splice(l, 1);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    //Handle action drops
                                    if (drops != "" && drops != null) {
                                        for (let k = 0; k < drops.length; k++) {
                                            for (let l = 0; l < save.items.length; l++) {
                                                if (save.items[l].name.includes(drops[k])) {
                                                    save.nodes[currentNode].items.push(save.items[l]);
                                                    save.items.splice(l, 1);
                                                }
                                            }
                                        }
                                    }
                                    //Handle action visibility
                                    switch(visibility) {
                                        case 'none':
                                            break;
                                        case 'on':
                                            save.nodes[currentNode].visibility = 'true';
                                            break;
                                        case 'off':
                                            save.nodes[currentNode].visibility = 'false';
                                        case 'switch':
                                            if (save.nodes[currentNode].visibility == 'true') {
                                                save.nodes[currentNode].visibility = 'false';
                                            } else {
                                                save.nodes[currentNode].visibility = 'true';
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                    pushAction(mainAction);
                                    displayMessage(actionObject.response, false);
                                    sentMessage = true;
                                } else {
                                    displayMessage("Can't do that anymore.", false);
                                    sentMessage = true;
                                }
                            } else {
                                displayMessage(actionObject.fail, false);
                                sentMessage = true;
                            }
                        }
                    }
                }
            }
        }

        if (action === "LOOK") {
            pushAction("LOOK");
            displayMessage(getDescription(currentNode), false);
            displayItems();
            sentMessage = true;
        }

        if (action === "SCORE") {
            pushAction("SCORE");
            let max = getMaxPoints();
            if (max == 0) {
                displayMessage("This game keeps no score.", false);
                sentMessage = true;
            } else {
                let points = tallyPoints();
                displayMessage(points.toString() + "/" + max.toString(), false);
                sentMessage = true;
            }
        }

        if (hintCommands.includes(action)) {
            pushAction("HINT");
            if (game[currentNode].hint != '') {
                displayMessage(game[currentNode].hint, false);
            } else {
                displayMessage("There is no help here.", false);
            }
            sentMessage = true;
        }

        if (inventoryCommands.includes(action)) {
            pushAction("INENTORY");
            if (save.items.length > 0) {
                displayMessage("Inventory:", false);
                for (let i = 0; i < save.items.length; i++) {
                    let name = save.items[i].name.split(/\s*,\s*/)[0];
                    displayMessage(name, false);
                    sentMessage = true;
                }
            } else {
                displayMessage("Your inventory is empty.", false);
                sentMessage = true;
            }
        }

        for (let i = 0; i < cContainerWithdrawals.verbs.length; i++) {
            //Check if withdrawal verb is present in action
            let regexp1 = new RegExp(`\s*${cContainerWithdrawals.verbs[i]}\s*`);
            if (action.match(regexp1)) {
                //check if withdrawalable item is present in action
                for (let j = 0; j < cContainerWithdrawals.items.length; j++) {
                    for (let k = 0; k < cContainerWithdrawals.items[j].length; k++) {
                        for (let l = 0; l < cContainerWithdrawals.items[j][k].length; l++) {
                            let regexp2 = new RegExp(`\s*${cContainerWithdrawals.items[j][k][l].toUpperCase()}\s*`);
                            if (action.match(regexp2)) {
                                //Check if corresponding container is present in action
                                let containerVariants = cContainerWithdrawals.containers[j];
                                for (let m = 0; m < containerVariants.length; m++) {
                                    let regexp3 = new RegExp(`\s*${containerVariants[m].toUpperCase()}\s*`);
                                    if (action.match(regexp3)) {
                                        //Action is a container withdrawal, check if requirements are satisfied
                                        let reqs;
                                        for (let q = 0; q < game[currentNode].containers.length; q++) {
                                            if (game[currentNode].containers[q].name.toUpperCase().match(regexp3)) {
                                                reqs = {
                                                    "reqItems": game[currentNode].containers[q].reqItems,
                                                    "reqContainers": game[currentNode].containers[q].reqContainers,
                                                    "reqLocal": game[currentNode].containers[q].reqLocal,
                                                    "reqGlobal": game[currentNode].containers[q].reqGlobal,
                                                    "preAction": game[currentNode].containers[q].preAction,
                                                    "locVisits": game[currentNode].containers[q].locVisits,
                                                    "preNode": game[currentNode].containers[q].preNode,
                                                    "itemEvos": game[currentNode].containers[q].itemEvos
                                                }
                                                break;
                                            }
                                        }
                                        if (checkRequirements(reqs)) {
                                        //Remove item from container and store in inventory
                                            for (let n = 0; n < save.nodes[currentNode].containers.length; n++) {
                                                if (save.nodes[currentNode].containers[n].name.includes(containerVariants[m])) {
                                                    for (let p = 0; p < save.nodes[currentNode].containers[n].items.length; p++) {
                                                        if (save.nodes[currentNode].containers[n].items[p].name.includes(cContainerWithdrawals.items[j][k][l])) {
                                                            let item = JSON.parse(JSON.stringify(save.nodes[currentNode].containers[n].items[p]));
                                                            save.nodes[currentNode].containers[n].items.splice(p,1);
                                                            save.items.push(item);
                                                            displayMessage("Done.", false);
                                                            sentMessage = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        for (let i = 0; i < cContainerDeposits.verbs.length; i++) {
            //Check if deposit verb is present in action
            let regexp1 = new RegExp(`\s*${cContainerDeposits.verbs[i]}\s*`);
            if (action.match(regexp1)) {
                //Check if depositable item is present in action
                for (let j = 0; j < cContainerDeposits.items.length; j++) {
                    for (let k = 0; k < cContainerDeposits.items[j].length; k++) {
                        let regexp2 = new RegExp(`\s*${cContainerDeposits.items[j][k].toUpperCase()}\s*`);
                        if (action.match(regexp2)) {
                            //Check if container is present in action
                            for (let l = 0; l < cContainerDeposits.containers.length; l++) {
                                for (let m = 0; m < cContainerDeposits.containers[l].length; m++) {
                                    let regexp3 = new RegExp(`\s*${cContainerDeposits.containers[l][m].toUpperCase()}\s*`);
                                    if (action.match(regexp3)) {
                                        //Action is a container deposit, check if requirements are satisfied
                                        let reqs;
                                        let thisContainer;
                                        for (let q = 0; q < game[currentNode].containers.length; q++) {
                                            if (game[currentNode].containers[q].name.toUpperCase().match(regexp3)) {
                                                thisContainer = game[currentNode].containers[q];
                                                reqs = {
                                                    "reqItems": thisContainer.reqItems,
                                                    "reqContainers": thisContainer.reqContainers,
                                                    "reqLocal": thisContainer.reqLocal,
                                                    "reqGlobal": thisContainer.reqGlobal,
                                                    "preAction": thisContainer.preAction,
                                                    "locVisits": thisContainer.locVisits,
                                                    "preNode": thisContainer.preNode,
                                                    "itemEvos": thisContainer.itemEvos
                                                }
                                                break;
                                            }
                                        }
                                        if (checkRequirements(reqs)) {
                                        //Check if item is an illegal item, and if not, then
                                        //remove item from inventory and store in container
                                            for (let n = 0; n < save.items.length; n++) {
                                                let variants = save.items[n].name.toUpperCase().split(/\s*,\s*/);
                                                if (variants.includes(cContainerDeposits.items[j][k].toUpperCase())) {
                                                    if (!thisContainer.illegal.toUpperCase().includes(variants[0])) {
                                                        let item = JSON.parse(JSON.stringify(save.items[n]));
                                                        save.items.splice(n,1);
                                                        for (let p = 0; p < save.nodes[currentNode].containers.length; p++) {
                                                            let saveVariants = save.nodes[currentNode].containers[p].name.split(/\s*,\s*/);
                                                            if (saveVariants.includes(cContainerDeposits.containers[l][m])) {
                                                                save.nodes[currentNode].containers[p].items.push(item);
                                                                displayMessage("Done.", false);
                                                                sentMessage = true;
                                                            }
                                                        }
                                                    } else {
                                                        displayMessage("That does not go there.", false);
                                                        sentMessage = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        for (let i = 0; i < cNodeDirections.length; i++) {
            for (let j = 0; j < cNodeDirections[i].alternatives.length; j++) {
                if (filterIgnorables(cNodeDirections[i].alternatives[j]) == action) {
                    if (checkRequirements(cNodeDirections[i].requirements)) {
                        parseNode(cNodeDirections[i].location);
                        return;
                    } else {
                        displayMessage("Something is preventing you from going this way.", false);
                        sentMessage = true;
                    }
                    break;
                }
            }
        }

        if (cNodeItems.includes(action)) {
            let actionItem;
            for (let i = 0; i < takeCommands.length; i++) {
                let regexp = new RegExp(`\s*${takeCommands[i]}\s*`);
                if (action.match(regexp)) {
                    actionItem = action.slice(action.match(regexp)[0].length + 1);
                    break;
                }
            }
            for (let i = 0; i < save.nodes[currentNode].items.length; i++) {
                let checked = false;
                let variants = save.nodes[currentNode].items[i].name.split(/\s*,\s*/);
                for (let j = 0; j < variants.length; j++) {
                    if (variants[j].toUpperCase() === actionItem) {
                        let discoveredItem = JSON.parse(JSON.stringify(save.nodes[currentNode].items[i]));
                        save.items.push(discoveredItem);
                        save.nodes[currentNode].items.splice(i,1);
                        displayMessage("Taken.", false);
                        checked = true;
                        sentMessage = true;
                        break;
                    }
                }
                if (checked) {
                    break;
                }
            }
        }

        if (cItemInspections.includes(action)) {
            let actionItem;
            let checked = false;
            for (let i = 0; i < itemInspectCommands.length; i++) {
                let regexp = new RegExp(`\s*${itemInspectCommands[i]}\s*`);
                if (action.match(regexp)) {
                    actionItem = action.slice(action.match(regexp)[0].length + 1);
                    break;
                }
            }
            for (let i = 0; i < save.items.length; i++) {
                let variants = save.items[i].name.split(/\s*,\s*/);
                for (let j = 0; j < variants.length; j++) {
                    if (variants[j].toUpperCase() === actionItem) {
                        if (save.items[i].evos.length > 0) {
                            let messageToDisplay;
                            for (let k = 0; k < save.items[i].evos.length; k++) {
                                let evo = save.items[i].evos[k];
                                let reqs = {
                                    "reqItems": evo.reqItems,
                                    "reqContainers": evo.reqContainers,
                                    "reqLocal": evo.reqLocal,
                                    "reqGlobal": evo.reqGlobal,
                                    "preAction": evo.preAction,
                                    "locVisits": evo.locVisits,
                                    "preNode": evo.preNode,
                                    "itemEvos": evo.itemEvos
                                }
                                if (checkRequirements(reqs)) {
                                    messageToDisplay = save.items[i].evos[k].evoDes;
                                }
                            }
                            if (messageToDisplay != undefined) {
                                displayMessage(messageToDisplay, false);
                                sentMessage = true;
                            } else {
                                displayMessage(save.items[i].description, false);
                                sentMessage = true;
                            }
                        } else {
                            displayMessage(save.items[i].description, false);
                            sentMessage = true;
                        }
                        checked = true;
                    }
                }
                if (checked) {
                    break;
                }
            }
        }

        if (cPlayerItems.includes(action)) {
            let actionItem;
            let checked = false;
            for (let i = 0; i < dropCommands.length; i++) {
                let regexp = new RegExp(`\s*${dropCommands[i]}\s*`);
                if (action.match(regexp)) {
                    actionItem = action.slice(action.match(regexp)[0].length + 1);
                    break;
                }
            }
            for (let i = 0; i < save.items.length; i++) {
                let variants = save.items[i].name.split(/\s*,\s*/);
                for (let j = 0; j < variants.length; j++) {
                    if (variants[j].toUpperCase() === actionItem) {
                        let existingItem = JSON.parse(JSON.stringify(save.items[i]));
                        save.nodes[currentNode].items.push(existingItem);
                        save.items.splice(i,1);
                        displayMessage("Dropped.", false);
                        checked = true;
                        sentMessage = true;
                        break;
                    }
                }
                if (checked) {
                    break;
                }
            }
        }

        if (!sentMessage) {
            badAction += 1;
            displayMessage(game[currentNode].actions.invalid, false);
        } else {
            badAction = 0;
        }
        handleHint();
        nodeReload();
    }
}

export { gameInit, parseAction }
