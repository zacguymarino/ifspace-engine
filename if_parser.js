import {game, 
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
    customExamines} from './if_generate.js';

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
var previousInput = "";

var save;

var takeCommands = ["GET","TAKE", "PICK UP", "OBTAIN", "GRAB"];
var dropCommands = ["DROP", "PUT DOWN", "DISCARD"];
var inventoryCommands = ["INVENTORY", "INV", "I", "INVEN"];
var hintCommands = ["HINT", "HELP"];
var lookCommands = ["LOOK", "L"];
var itemInspectCommands = ["INSPECT", "LOOK", "EXAMINE", "X"];
var ignorables = ["A", "AN", "THE", "TO", "FOR", "AT"];
var containerWithdrawals = ["TAKE", "GET", "RETRIEVE", "WITHDRAWAL", "OBTAIN"];
var containerDeposits = ["STORE","DEPOSIT","PLACE","PUT"];

function gameInit() {
    if (customDeposits["customDeposits"] != [""]) {
        if (customDeposits["includeDefaults"] == "true") {
            for (let i = 0; i < customDeposits["customDeposits"].length; i++) {
                containerDeposits.push(customDeposits["customDeposits"][i].toUpperCase());
            }
        } else {
            containerDeposits = [];
            for (let i = 0; i < customDeposits["customDeposits"].length; i++) {
                containerDeposits.push(customDeposits["customDeposits"][i].toUpperCase());
            }
        }
    }
    if (customWithdrawals["customWithdrawals"] != [""]) {
        if (customWithdrawals["includeDefaults"] == "true") {
            for (let i = 0; i < customWithdrawals["customWithdrawals"].length; i++) {
                containerWithdrawals.push(customWithdrawals["customWithdrawals"][i].toUpperCase());
            }
        } else {
            containerWithdrawals = [];
            for (let i = 0; i < customWithdrawals["customWithdrawals"].length; i++) {
                containerWithdrawals.push(customWithdrawals["customWithdrawals"][i].toUpperCase());
            }
        }
    }
    if (customTakes["customTakes"] != [""]) {
        if (customTakes["includeDefaults"] == "true") {
            for (let i = 0; i < customTakes["customTakes"].length; i++) {
                takeCommands.push(customTakes["customTakes"][i].toUpperCase());
            }
        } else {
            takeCommands = [];
            for (let i = 0; i < customTakes["customTakes"].length; i++) {
                takeCommands.push(customTakes["customTakes"][i].toUpperCase());
            }
        }
    }
    if (customDrops["customDrops"] != [""]) {
        if (customDrops["includeDefaults"] == "true") {
            for (let i = 0; i < customDrops["customDrops"].length; i++) {
                dropCommands.push(customDrops["customDrops"][i].toUpperCase());
            }
        } else {
            dropCommands = [];
            for (let i = 0; i < customDrops["customDrops"].length; i++) {
                dropCommands.push(customDrops["customDrops"][i].toUpperCase());
            }
        }
    }
    if (customIgnorables["customIgnorables"] != [""]) {
        if (customIgnorables["includeDefaults"] == "true") {
            for (let i = 0; i < customIgnorables["customIgnorables"].length; i++) {
                ignorables.push(customIgnorables["customIgnorables"][i].toUpperCase());
            }
        } else {
            ignorables = [];
            for (let i = 0; i < customIgnorables["customIgnorables"].length; i++) {
                ignorables.push(customIgnorables["customIgnorables"][i].toUpperCase());
            }
        }
    }
    if (customLooks["customLooks"] != [""]) {
        if (customLooks["includeDefaults"] == "true") {
            for (let i = 0; i < customLooks["customLooks"].length; i++) {
                lookCommands.push(customLooks["customLooks"][i].toUpperCase());
            }
        } else {
            lookCommands = [];
            for (let i = 0; i < customLooks["customLooks"].length; i++) {
                lookCommands.push(customLooks["customLooks"][i].toUpperCase());
            }
        }
    }
    if (customExamines["customExamines"] != [""]) {
        if (customExamines["includeDefaults"] == "true") {
            for (let i = 0; i < customExamines["customExamines"].length; i++) {
                itemInspectCommands.push(customExamines["customExamines"][i].toUpperCase());
            }
        } else {
            itemInspectCommands = [];
            for (let i = 0; i < customExamines["customExamines"].length; i++) {
                itemInspectCommands.push(customExamines["customExamines"][i].toUpperCase());
            }
        }
    }
    playing = true;
    previousNode = "0,0,0";
    currentNode = "0,0,0";
    badAction = 0;
    save = {
        "items": [],
        "actions": [],
        "nodes": {}
    };
    for (let i = 0; i < initItems.length; i++) {
        save.items.push(initItems[i]);
    }
    $('#outputSim').empty();
    $('#outputSim').append(`<h1>${gameTitle}</h1>`);
    if (IFID) {
        $('#outputSim').append(`<h6>IFID: ${IFID}</h6>`);
    }
    if (gameAuthor.length > 0) {
        $('#outputSim').append(`<h6>Created by: ${gameAuthor}</h6>`);
    }
    parseNode(currentNode);
}

function addNodeToSave (location) {
    if (!save["nodes"].hasOwnProperty(location)) {
        let visibility = JSON.parse(JSON.stringify(game[location].visibility));
        let points = JSON.parse(JSON.stringify(game[location].points));
        let description = JSON.parse(JSON.stringify(game[location].description));
        let nodeInit = {
            "visibility": visibility,
            "visits": "0",
            "items": JSON.parse(JSON.stringify(game[location].items)),
            "containers": JSON.parse(JSON.stringify(game[location].containers)),
            "description": description,
            "actions": [],
            "points": points,
            "fails": {"total": "0", "consecutive": "0"},
            "valids": {"total": "0", "consecutive": "0"}
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

function getActions() {
    let actions = [];
    if (gameStyle == "modern") {
        for (let i = 0; i < game[currentNode].actions.actions.length; i++) {
            let reqs = {
                "reqItemsNot": game[currentNode].actions.actions[i].reqItemsNot,
                "reqContainersNot": game[currentNode].actions.actions[i].reqContainersNot,
                "reqLocalNot": game[currentNode].actions.actions[i].reqLocalNot,
                "reqGlobalNot": game[currentNode].actions.actions[i].reqGlobalNot,
                "preActionNot": game[currentNode].actions.actions[i].preActionNot,
                "locVisitsNot": game[currentNode].actions.actions[i].locVisitsNot,
                "preNodeNot": game[currentNode].actions.actions[i].preNodeNot,
                "itemEvosNot": game[currentNode].actions.actions[i].itemEvosNot,
                "pastDesNot": game[currentNode].actions.actions[i].pastDesNot,
                "reqFailsNot": game[currentNode].actions.actions[i].reqFailsNot,
                "reqValidsNot": game[currentNode].actions.actions[i].reqValidsNot,
                "reqAll": game[currentNode].actions.actions[i].reqAll,
                "reqItems": game[currentNode].actions.actions[i].reqItems,
                "reqContainers": game[currentNode].actions.actions[i].reqContainers,
                "reqLocal": game[currentNode].actions.actions[i].reqLocal,
                "reqGlobal": game[currentNode].actions.actions[i].reqGlobal,
                "preAction": game[currentNode].actions.actions[i].preAction,
                "locVisits": game[currentNode].actions.actions[i].locVisits,
                "preNode": game[currentNode].actions.actions[i].preNode,
                "itemEvos": game[currentNode].actions.actions[i].itemEvos,
                "pastDes": game[currentNode].actions.actions[i].pastDes,
                "reqFails": game[currentNode].actions.actions[i].reqFails,
                "reqValids": game[currentNode].actions.actions[i].reqValids,
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
        for (let i = 0; i < globalActions.length; i++) {
            let reqs = {
                "reqItemsNot": globalActions[i].reqItemsNot,
                "reqContainersNot": globalActions[i].reqContainersNot,
                "reqLocalNot": globalActions[i].reqLocalNot,
                "reqGlobalNot": globalActions[i].reqGlobalNot,
                "preActionNot": globalActions[i].preActionNot,
                "locVisitsNot": globalActions[i].locVisitsNot,
                "preNodeNot": globalActions[i].preNodeNot,
                "itemEvosNot": globalActions[i].itemEvosNot,
                "pastDesNot": globalActions[i].pastDesNot,
                "reqFailsNot": globalActions[i].reqFailsNot,
                "reqValidsNot": globalActions[i].reqValidsNot,
                "reqAll": globalActions[i].reqAll,
                "reqItems": globalActions[i].reqItems,
                "reqContainers": globalActions[i].reqContainers,
                "reqLocal": globalActions[i].reqLocal,
                "reqGlobal": globalActions[i].reqGlobal,
                "preAction": globalActions[i].preAction,
                "locVisits": globalActions[i].locVisits,
                "preNode": globalActions[i].preNode,
                "itemEvos": globalActions[i].itemEvos,
                "pastDes": globalActions[i].pastDes,
                "reqFails": globalActions[i].reqFails,
                "reqValids": globalActions[i].reqValids
            }
            let reqCheck = checkRequirements(reqs);
            if (!reqCheck && globalActions[i].fail.length == 0) {
                continue;
            } else {
                let variants = globalActions[i].actions.split(/\s*,\s*/);
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
        for (let i = 0; i < globalActions.length; i++) {
            let variants = globalActions[i].actions.split(/\s*,\s*/);
            for (let j = 0; j < variants.length; j++) {
                actions.push(variants[j]);
            }
        }
    }
    return actions;
}

function getContainerDepositActions(location) {
    let actionParts = {
        "verbs": containerDeposits,
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
        "verbs": containerWithdrawals,
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
            "reqItemsNot": items[i].reqItemsNot,
            "reqContainersNot": items[i].reqContainersNot,
            "reqLocalNot": items[i].reqLocalNot,
            "reqGlobalNot": items[i].reqGlobalNot,
            "preActionNot": items[i].preActionNot,
            "locVisitsNot": items[i].locVisitsNot,
            "preNodeNot": items[i].preNodeNot,
            "itemEvosNot": items[i].itemEvosNot,
            "pastDesNot": items[i].pastDesNot,
            "reqFailsNot": items[i].reqFailsNot,
            "reqValidsNot": items[i].reqValidsNot,
            "reqAll": items[i].reqAll,
            "reqItems": items[i].reqItems,
            "reqContainers": items[i].reqContainers,
            "reqLocal": (originNode) ? items[i].reqLocal: '',
            "reqGlobal": items[i].reqGlobal,
            "preAction": (originNode) ? items[i].preAction: '',
            "locVisits": items[i].locVisits,
            "preNode": (originNode) ? items[i].preNode: '',
            "itemEvos": items[i].itemEvos,
            "pastDes": items[i].pastDes,
            "reqFails": items[i].reqFails,
            "reqValids": items[i].reqValids
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
    let existingItems = JSON.parse(JSON.stringify(save.items));
    let discoveredItems = JSON.parse(JSON.stringify(save.nodes[currentNode].items));
    let items = existingItems.concat(discoveredItems);
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
            "reqItemsNot": game[location].directions[i].reqItemsNot,
            "reqContainersNot": game[location].directions[i].reqContainersNot,
            "reqLocalNot": game[location].directions[i].reqLocalNot,
            "reqGlobalNot": game[location].directions[i].reqGlobalNot,
            "preActionNot": game[location].directions[i].preActionNot,
            "locVisitsNot": game[location].directions[i].locVisitsNot,
            "preNodeNot": game[location].directions[i].preNodeNot,
            "itemEvosNot": game[location].directions[i].itemEvosNot,
            "pastDesNot": game[location].directions[i].pastDesNot,
            "reqFailsNot": game[location].directions[i].reqFailsNot,
            "reqValidsNot": game[location].directions[i].reqValidsNot,
            "reqAll": game[location].directions[i].reqAll,
            "reqItems": game[location].directions[i].reqItems,
            "reqContainers": game[location].directions[i].reqContainers,
            "reqLocal": game[location].directions[i].reqLocal,
            "reqGlobal": game[location].directions[i].reqGlobal,
            "preAction": game[location].directions[i].preAction,
            "locVisits": game[location].directions[i].locVisits,
            "preNode": game[location].directions[i].preNode,
            "itemEvos": game[location].directions[i].itemEvos,
            "pastDes": game[location].directions[i].pastDes,
            "reqFails": game[location].directions[i].reqFails,
            "reqValids": game[location].directions[i].reqValids
        };
        let directionObject = {
            "direction": thisDirection,
            "alternatives": [],
            "location": thisLocation,
            "requirements": reqs
        };
        let alts = game[location].directions[i].alternatives.split(/\s*,\s*/);
        let exclude = game[location].directions[i].exclude;

        if (exclude != "true") {
            switch (thisDirection) {
                case ("N"):
                    directionObject["alternatives"] = [
                            "N",
                            "NORTH",
                            "GO N",
                            "GO NORTH",
                            "TRAVEL N",
                            "TRAVEL NORTH"
                        ];
                    break;
                case ("NE"):
                    directionObject["alternatives"] = [
                            "NE",
                            "NORTHEAST",
                            "GO NE",
                            "GO NORTHEAST",
                            "TRAVEL NE",
                            "TRAVEL NORTHEAST"
                        ];
                    break;
                case ("E"):
                    directionObject["alternatives"] = [
                            "E",
                            "EAST",
                            "GO E",
                            "GO EAST",
                            "TRAVEL E",
                            "TRAVEL EAST"
                        ];
                    break;
                case ("SE"):
                    directionObject["alternatives"] = [
                            "SE",
                            "SOUTHEAST",
                            "GO SE",
                            "GO SOUTHEAST",
                            "TRAVEL SE",
                            "TRAVEL SOUTHEAST"
                        ];
                    break;
                case ("S"):
                    directionObject["alternatives"] = [
                            "S",
                            "SOUTH",
                            "GO S",
                            "GO SOUTH",
                            "TRAVEL S",
                            "TRAVEL SOUTH"
                        ];
                    break;
                case ("SW"):
                    directionObject["alternatives"] = [
                            "SW",
                            "SOUTHWEST",
                            "GO SW",
                            "GO SOUTHWEST",
                            "TRAVEL SW",
                            "TRAVEL SOUTHWEST"
                        ];
                    break;
                case ("W"):
                    directionObject["alternatives"] = [
                            "W",
                            "WEST",
                            "GO W",
                            "GO WEST",
                            "TRAVEL W",
                            "TRAVEL WEST"
                        ];
                    break;
                case ("NW"):
                    directionObject["alternatives"] = [
                            "NW",
                            "NORTHWEST",
                            "GO NW",
                            "GO NORTHWEST",
                            "TRAVEL NW",
                            "TRAVEL NORTHWEST"
                        ];
                    break;
                case ("Up"):
                    directionObject["alternatives"] = [
                            "U",
                            "UP",
                            "GO UP",
                            "TRAVEL UP"
                            ];
                    break;
                case ("Down"):
                    directionObject["alternatives"] = [
                            "D",
                            "DOWN",
                            "GO DOWN",
                            "TRAVEL DOWN"
                            ];
                    break;
            }
        }
        for (let j = 0; j < alts.length; j++) {
            if (alts[j] != "") {
                directionObject.alternatives.push(alts[j].toUpperCase());
            }
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
        let reqs = {
            "reqItemsNot": thisEvo.reqItemsNot,
            "reqContainersNot": thisEvo.reqContainersNot,
            "reqLocalNot": thisEvo.reqLocalNot,
            "reqGlobalNot": thisEvo.reqGlobalNot,
            "preActionNot": thisEvo.preActionNot,
            "locVisitsNot": thisEvo.locVisitsNot,
            "preNodeNot": thisEvo.preNodeNot,
            "itemEvosNot": thisEvo.itemEvosNot,
            "pastDesNot": thisEvo.pastDesNot,
            "reqFailsNot": thisEvo.reqFailsNot,
            "reqValidsNot": thisEvo.reqValidsNot,
            "reqAll": thisEvo.reqAll,
            "reqItems": thisEvo.reqItems,
            "reqContainers": thisEvo.reqContainers,
            "reqLocal": thisEvo.reqLocal,
            "reqGlobal": thisEvo.reqGlobal,
            "preAction": thisEvo.preAction,
            "locVisits": thisEvo.locVisits,
            "preNode": thisEvo.preNode,
            "itemEvos": thisEvo.itemEvos,
            "pastDes": thisEvo.pastDes,
            "reqFails": thisEvo.reqFails,
            "reqValids": thisEvo.reqValids
        }
        if (checkRequirements(reqs)) {
            save.nodes[location].description.evos[i].passed = "true";
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
    let reqAll = !reqs.reqAll ? "false" : reqs.reqAll;
    let reqItemsNot = !reqs.reqItemsNot ? "false" : reqs.reqItemsNot;
    let reqContainersNot = !reqs.reqContainersNot ? "false" : reqs.reqContainersNot;
    let reqLocalNot = !reqs.reqLocalNot ? "false" : reqs.reqLocalNot;
    let reqGlobalNot = !reqs.reqGlobalNot ? "false" : reqs.reqGlobalNot;
    let preActionNot = !reqs.preActionNot ? "false" : reqs.preActionNot;
    let locVisitsNot = !reqs.locVisitsNot ? "false" : reqs.locVisitsNot;
    let preNodeNot = !reqs.preNodeNot ? "false" : reqs.preNodeNot;
    let itemEvosNot = !reqs.itemEvosNot ? "false" : reqs.itemEvosNot;
    let pastDesNot = !reqs.pastDesNot ? "false" : reqs.pastDesNot;
    let reqFailsNot = !reqs.reqFailsNot ? "false" : reqs.reqFailsNot;
    let reqValidsNot = !reqs.reqValidsNot ? "false" : reqs.reqValidsNot;
    let reqItems = !reqs['reqItems'] ? [] : reqs['reqItems'].split(/\s*,\s*/);
    let reqContainers = !reqs['reqContainers'] ? [] : reqs['reqContainers'].split(/\s*,\s*/);
    let reqLocal = !reqs['reqLocal'] ? [] : reqs['reqLocal'].split(/\s*,\s*/);
    let reqGlobal = !reqs['reqGlobal'] ? [] : reqs['reqGlobal'].split(/\s*,\s*/);
    let preAction = !reqs['preAction'] ? '' : reqs['preAction'];
    let locVisits = !reqs['locVisits'] ? [] : reqs['locVisits'].match(/\[(?:[^,]*,){3}[^,]*\]/g);
    let preNode = !reqs['preNode'] ? '' : reqs['preNode'];
    let itemEvos = !reqs['itemEvos'] ? [] : reqs['itemEvos'].split(/\]\s*,\s*/);
    let pastDes = !reqs['pastDes'] ? [] : reqs['pastDes'].match(/\[(?:[^,]*,){3}[^,]*\]/g);
    let reqFails = !reqs['reqFails'] ? {"reqFails": "", "consecutive": "false"} : reqs['reqFails'];
    let reqValids = !reqs['reqValids'] ? {"reqValids": "", "consecutive": "false"} : reqs['reqValids'];
    //Check for container fulfillment requirements
    for (let i = 0; i < reqContainers.length; i++) {
        let checked = false;
        let containerName = reqContainers[i].toUpperCase();
        for (const key in save.nodes) {
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
                    if (!checkContainerComplete(save.nodes[key].containers[k]) && reqAll == "true") {
                        if (reqContainersNot != "true") {
                            return false;
                        }
                    } else if (checkContainerComplete(save.nodes[key].containers[k]) && reqAll != "true") {
                        if (reqContainersNot != "true") {
                            return true;
                        }
                    } else if (!checkContainerComplete(save.nodes[key].containers[k]) && reqAll != "true") {
                        if (reqContainersNot == "true") {
                            return true;
                        }
                    } else if (checkContainerComplete(save.nodes[key].containers[k]) && reqAll == "true") {
                        if (reqContainersNot == "true") {
                            return false;
                        }
                    }
                }
            }
        }
    }

    //Check local node action requirements
    for (let i = 0; i < reqLocal.length; i++) {
        if (!save.nodes[currentNode].actions.includes(reqLocal[i].toUpperCase()) && reqAll == "true") {
            if (reqLocalNot != "true") {
                return false;
            }
        } else if (save.nodes[currentNode].actions.includes(reqLocal[i].toUpperCase()) && reqAll != "true") {
            if (reqLocalNot != "true") {
                return true;
            }
        } else if (!save.nodes[currentNode].actions.includes(reqLocal[i].toUpperCase()) && reqAll != "true") {
            if (reqLocalNot == "true") {
                return true;
            }
        } else if (save.nodes[currentNode].actions.includes(reqLocal[i].toUpperCase()) && reqAll == "true") {
            if (reqLocalNot == "true") {
                return false;
            }
        }
    }

    //Check global action requirements
    for (let i = 0; i < reqGlobal.length; i++) {
        if (!save.actions.includes(reqGlobal[i].toUpperCase()) && reqAll == "true") {
            if (reqGlobalNot != "true") {
                return false;
            }
        } else if (save.actions.includes(reqGlobal[i].toUpperCase()) && reqAll != "true") {
            if (reqGlobalNot != "true") {
                return true;
            }
        } else if (!save.actions.includes(reqGlobal[i].toUpperCase()) && reqAll != "true") {
            if (reqGlobalNot == "true") {
                return true;
            }
        } else if (save.actions.includes(reqGlobal[i].toUpperCase()) && reqAll == "true") {
            if (reqGlobalNot == "true") {
                return false;
            }
        }
    }

    //Check previous action requirement
    if (preAction != '' && preAction.toUpperCase() != save.actions[save.actions.length - 1] && reqAll == "true") {
        if (preActionNot != "true") {
            return false;
        }
    } else if (preAction != '' && preAction.toUpperCase() == save.actions[save.actions.length - 1] && reqAll != "true") {
        if (preActionNot == "true") {
            return true;
        }
    } else if (preAction != '' && preAction.toUpperCase() != save.actions[save.actions.length - 1] && reqAll != "true") {
        if (preActionNot == "true") {
            return true;
        }
    } else if (preAction != '' && preAction.toUpperCase() == save.actions[save.actions.length - 1] && reqAll == "true") {
        if (preActionNot == "true") {
            return false;
        }
    }

    //Check location visit requirements
    for (let i = 0; i < locVisits.length; i++) {
        let locArray = JSON.parse(locVisits[i]);
        let loc = `${locArray[0]},${locArray[1]},${locArray[2]}`;
        let quant = locArray[3];
        if (quant > 0){
            if (!save.nodes.hasOwnProperty(loc) && reqAll == "true") {
                if (locVisitsNot != "true") {
                    return false;
                }
            } else if (!save.nodes.hasOwnProperty(loc) && reqAll != "true") {
                if (locVisitsNot == "true") {
                    return true;
                }
            } else {
                if (Number(save.nodes[loc].visits) < quant && reqAll == "true") {
                    if (locVisitsNot != "true") {
                        return false;
                    }
                } else if (Number(save.nodes[loc].visits) >= quant && reqAll != "true") {
                    if (locVisitsNot != "true") {
                        return true;
                    }
                } else if (Number(save.nodes[loc].visits) < quant && reqAll != "true") {
                    if (locVisitsNot == "true") {
                        return true;
                    }
                } else if (Number(save.nodes[loc].visits) >= quant && reqAll == "true") {
                    if (locVisitsNot == "true") {
                        return false;
                    }
                }
            }
        } else if (quant == 0) {
            if (!save.nodes.hasOwnProperty(loc) && reqAll == "true") {
                if (locVisitsNot == "true") {
                    return false;
                }
            } else if (!save.nodes.hasOwnProperty(loc) && reqAll != "true") {
                if (locVisitsNot != "true") {
                    return true;
                }
            } else {
                if (Number(save.nodes[loc].visits) != 0 && reqAll == "true") {
                    if (locVisitsNot != "true") {
                        return false;
                    }
                } else if (Number(save.nodes[loc].visits) == 0 && reqAll != "true") {
                    if (locVisitsNot != "true") {
                        return true;
                    }
                } else if (Number(save.nodes[loc].visits) != 0 && reqAll != "true") {
                    if (locVisitsNot == "true") {
                        return true;
                    }
                } else if (Number(save.nodes[loc].visits) == 0 && reqAll == "true") {
                    if (locVisitsNot == "true") {
                        return false;
                    }
                }
            }
        }
    }

    //Check previous node requirement
    if (preNode != '' && preNode != previousNode && reqAll == "true") {
        if (preNodeNot != "true") {
            return false;
        }
    } else if (preNode != '' && preNode == previousNode && reqAll != "true") {
        if (preNodeNot != "true") {
            return true;
        }
    } else if (preNode != '' && preNode != previousNode && reqAll != "true") {
        if (preNodeNot == "true") {
            return true;
        }
    } else if (preNode != '' && preNode == previousNode && reqAll == "true") {
        if (preNodeNot == "true") {
            return false;
        }
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
        if (!itemIncluded && reqAll == "true") {
            if (reqItemsNot != "true") {
                return false;
            }
        } else if (itemIncluded && reqAll != "true") {
            if (reqItemsNot != "true") {
                return true;
            }
        } else if (!itemIncluded && reqAll != "true") {
            if (reqItemsNot == "true") {
                return true;
            }
        } else if (itemIncluded && reqAll == "true") {
            if (reqItemsNot == "true") {
                return false;
            }
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
                    if (save["items"][k].name.split(/\s*,\s*/)[0].toUpperCase() == itemEvo[0].toUpperCase()) {
                        let checkIndex = 0;
                        let evoIndex = 0;
                        for (let l = 0; l < save["items"][k].evos.length; l++) {
                            checkIndex++;
                            let reqs = {
                                "reqItemsNot": save["items"][k].evos[l].reqItemsNot,
                                "reqContainersNot": save["items"][k].evos[l].reqContainersNot,
                                "reqLocalNot": save["items"][k].evos[l].reqLocalNot,
                                "reqGlobalNot": save["items"][k].evos[l].reqGlobalNot,
                                "preActionNot": save["items"][k].evos[l].preActionNot,
                                "locVisitsNot": save["items"][k].evos[l].locVisitsNot,
                                "preNodeNot": save["items"][k].evos[l].preNodeNot,
                                "itemEvosNot": save["items"][k].evos[l].itemEvosNot,
                                "pastDesNot": save["items"][k].evos[l].pastDesNot,
                                "reqFailsNot": save["items"][k].evos[l].reqFailsNot,
                                "reqValidsNot": save["items"][k].evos[l].reqValidsNot,
                                "reqAll": save["items"][k].evos[l].reqAll,
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
                        if (evoIndex != +itemEvo[1] && reqAll == "true") {
                            if (itemEvosNot != "true") {
                                return false;
                            }
                        } else if (evoIndex == +itemEvo[1] && reqAll != "true") {
                            if (itemEvosNot != "true") {
                                return true;
                            }
                        } else if (evoIndex != +itemEvo[1] && reqAll != "true") {
                            if (itemEvosNot == "true") {
                                return true;
                            }
                        } else if (evoIndex == +itemEvo[1] && reqAll == "true") {
                            if (itemEvosNot == "true") {
                                return false;
                            }
                        }
                    }
                }
            } 
        }
        if (!checked && reqAll == "true") {
            if (itemEvosNot != "true") {
                return false;
            }
        }
        if (!checked && reqAll != "true") {
            if (itemEvosNot == "true") {
                return true;
            }
        }
    }

    //check if given node evolution stage 'passed' value is true
    for (let i = 0; i < pastDes.length; i++) {
        let locArray = JSON.parse(pastDes[i]);
        let loc = `${locArray[0]},${locArray[1]},${locArray[2]}`;
        let stage = locArray[3];
        if (stage > 0){
            if (!save.nodes.hasOwnProperty(loc) && reqAll == "true") {
                if (pastDesNot != "true") {
                    return false;
                }
            } else if (!save.nodes.hasOwnProperty(loc) && reqAll != "true") {
                if (pastDesNot == "true") {
                    return true;
                }
            } else {
                let nodeEvos = save.nodes[loc].description.evos;
                if (typeof nodeEvos[stage - 1] == "undefined" && reqAll == "true") {
                    if (pastDesNot != "true") {
                        return false;
                    }
                } else if (typeof nodeEvos[stage - 1] == "undefined" && reqAll != "true") {
                    if (pastDesNot == "true") {
                        return true;
                    }
                } else {
                    if (nodeEvos[stage - 1].passed != "true" && reqAll == "true") {
                        if (pastDesNot != "true") {
                            return false;
                        }
                    } else if (nodeEvos[stage - 1].passed == "true" && reqAll != "true") {
                        if (pastDesNot != "true") {
                            return true;
                        }
                    } else if (nodeEvos[stage - 1].passed != "true" && reqAll != "true") {
                        if (pastDesNot == "true") {
                            return true;
                        }
                    } else if (nodeEvos[stage - 1].passed == "true" && reqAll == "true") {
                        if (pastDesNot == "true") {
                            return false;
                        }
                    }
                }
            }
        } else {
            if (!save.nodes.hasOwnProperty(loc) && reqAll == "true") {
                if (pastDesNot != "true") {
                    return false;
                }
            } else if (!save.nodes.hasOwnProperty(loc) && reqAll != "true") {
                if (pastDesNot == "true") {
                    return true;
                }
            } else if (save.nodes.hasOwnProperty(loc) && reqAll != "true") {
                if (pastDesNot != "true") {
                    return true;
                }
            } else if (save.nodes.hasOwnProperty(loc) && reqAll == "true") {
                if (pastDesNot == "true") {
                    return false;
                }
            }
        }
    }
    //check reqFails
    if (+reqFails["reqFails"] != 0) {
        let quantity = +reqFails["reqFails"];
        let consecutive = reqFails["consecutive"];
        if (consecutive == "true") {
            if (quantity > +save.nodes[currentNode]["fails"]["consecutive"] && reqAll == "true") {
                if (reqFailsNot != "true") {
                    return false;
                }
            } else if (quantity <= +save.nodes[currentNode]["fails"]["consecutive"] && reqAll != "true") {
                if (reqFailsNot != "true") {
                    return true;
                }
            } else if (quantity > +save.nodes[currentNode]["fails"]["consecutive"] && reqAll != "true") {
                if (reqFailsNot == "true") {
                    return true;
                }
            } else if (quantity <= +save.nodes[currentNode]["fails"]["consecutive"] && reqAll == "true") {
                if (reqFailsNot == "true") {
                    return false;
                }
            }
        } else {
            if (quantity > +save.nodes[currentNode]["fails"]["total"] && reqAll == "true") {
                if (reqFailsNot != "true") {
                    return false;
                }
            } else if (quantity <= +save.nodes[currentNode]["fails"]["total"] && reqAll != "true") {
                if (reqFailsNot != "true") {
                    return true;
                }
            } else if (quantity > +save.nodes[currentNode]["fails"]["total"] && reqAll != "true") {
                if (reqFailsNot == "true") {
                    return true;
                }
            } else if (quantity <= +save.nodes[currentNode]["fails"]["total"] && reqAll == "true") {
                if (reqFailsNot == "true") {
                    return false;
                }
            }
        }
    }

    //check reqValids
    if (+reqValids["reqValids"] != 0) {
        let quantity = +reqValids["reqValids"];
        let consecutive = reqValids["consecutive"];
        if (consecutive == "true") {
            if (quantity > +save.nodes[currentNode]["valids"]["consecutive"] && reqAll == "true") {
                if (reqValidsNot != "true") {
                    return false;
                }
            } else if (quantity <= +save.nodes[currentNode]["valids"]["consecutive"] && reqAll != "true") {
                if (reqValidsNot != "true") {
                    return true;
                }
            } else if (quantity > +save.nodes[currentNode]["valids"]["consecutive"] && reqAll != "true") {
                if (reqValidsNot == "true") {
                    return true;
                }
            } else if (quantity <= +save.nodes[currentNode]["valids"]["consecutive"] && reqAll == "true") {
                if (reqValidsNot == "true") {
                    return false;
                }
            }
        } else {
            if (quantity > +save.nodes[currentNode]["valids"]["total"] && reqAll == "true") {
                if (reqValidsNot != "true") {
                    return false;
                }
            } else if (quantity <= +save.nodes[currentNode]["valids"]["total"] && reqAll != "true") {
                if (reqValidsNot != "true") {
                    return true;
                }
            } else if (quantity > +save.nodes[currentNode]["valids"]["total"] && reqAll != "true") {
                if (reqValidsNot == "true") {
                    return true;
                }
            } else if (quantity <= +save.nodes[currentNode]["valids"]["total"] && reqAll == "true") {
                if (reqValidsNot == "true") {
                    return false;
                }
            }
        }
    }
    //check if no requirements
    if (reqContainers.length == 0 &&
        reqLocal.length == 0 &&
        reqGlobal.length == 0 &&
        preAction == '' &&
        locVisits.length == 0 &&
        preNode == '' &&
        reqItems.length == 0 &&
        itemEvos.length == 0 &&
        pastDes.length == 0 &&
        +reqFails["reqFails"] == 0 &&
        +reqValids["reqValids"] == 0) {
            return true;
        }
        
    if (reqAll == "true") {
        return true;
    } else {
        return false;
    }
}

function checkWin() {
    let win = game[currentNode].win;
    let reqs = {
        "reqItemsNot": win.reqItemsNot,
        "reqContainersNot": win.reqContainersNot,
        "reqLocalNot": win.reqLocalNot,
        "reqGlobalNot": win.reqGlobalNot,
        "preActionNot": win.preActionNot,
        "locVisitsNot": win.locVisitsNot,
        "preNodeNot": win.preNodeNot,
        "itemEvosNot": win.itemEvosNot,
        "pastDesNot": win.pastDesNot,
        "reqFailsNot": win.reqFailsNot,
        "reqValidsNot": win.reqValidsNot,
        "reqAll": win.reqAll,
        "reqItems": win.reqItems,
        "reqContainers": win.reqContainers,
        "reqLocal": win.reqLocal,
        "reqGlobal": win.reqGlobal,
        "preAction": win.preAction,
        "locVisits": win.locVisits,
        "preNode": win.preNode,
        "itemEvos": win.itemEvos,
        "pastDes": win.pastDes,
        "reqFails": win.reqFails,
        "reqValids": win.reqValids
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
        "reqItemsNot": lose.reqItemsNot,
        "reqContainersNot": lose.reqContainersNot,
        "reqLocalNot": lose.reqLocalNot,
        "reqGlobalNot": lose.reqGlobalNot,
        "preActionNot": lose.preActionNot,
        "locVisitsNot": lose.locVisitsNot,
        "preNodeNot": lose.preNodeNot,
        "itemEvosNot": lose.itemEvosNot,
        "pastDesNot": lose.pastDesNot,
        "reqFailsNot": lose.reqFailsNot,
        "reqValidsNot": lose.reqValidsNot,
        "reqAll": lose.reqAll,
        "reqItems": lose.reqItems,
        "reqContainers": lose.reqContainers,
        "reqLocal": lose.reqLocal,
        "reqGlobal": lose.reqGlobal,
        "preAction": lose.preAction,
        "locVisits": lose.locVisits,
        "preNode": lose.preNode,
        "itemEvos": lose.itemEvos,
        "pastDes": lose.pastDes,
        "reqFails": lose.reqFails,
        "reqValids": lose.reqValids
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
        if (game[currentNode].hint != "") {
            displayMessage("Hint: " + game[currentNode].hint, false);
        }
    }
}

function displayItems() {
    let validItems = [];
    if (save.nodes[currentNode].items.length > 0 && save.nodes[currentNode].visibility == 'true') {
        for (let i = 0; i < save.nodes[currentNode].items.length; i++) {
            let originNode = checkItemOrigin(save.nodes[currentNode].items[i]);
            let reqs = {
                "reqItemsNot": save.nodes[currentNode].items[i].reqItemsNot,
                "reqContainersNot": save.nodes[currentNode].items[i].reqContainersNot,
                "reqLocalNot": save.nodes[currentNode].items[i].reqLocalNot,
                "reqGlobalNot": save.nodes[currentNode].items[i].reqGlobalNot,
                "preActionNot": save.nodes[currentNode].items[i].preActionNot,
                "locVisitsNot": save.nodes[currentNode].items[i].locVisitsNot,
                "preNodeNot": save.nodes[currentNode].items[i].preNodeNot,
                "itemEvosNot": save.nodes[currentNode].items[i].itemEvosNot,
                "pastDesNot": save.nodes[currentNode].items[i].pastDesNot,
                "reqFailsNot": save.nodes[currentNode].items[i].reqFailsNot,
                "reqValidsNot": save.nodes[currentNode].items[i].reqValidsNot,
                "reqAll": save.nodes[currentNode].items[i].reqAll,
                "reqItems": save.nodes[currentNode].items[i].reqItems,
                "reqContainers": save.nodes[currentNode].items[i].reqContainers,
                "reqLocal": (originNode) ? save.nodes[currentNode].items[i].reqLocal : '',
                "reqGlobal": save.nodes[currentNode].items[i].reqGlobal,
                "preAction": save.nodes[currentNode].items[i].preAction,
                "locVisits": save.nodes[currentNode].items[i].locVisits,
                "preNode": save.nodes[currentNode].items[i].preNode,
                "itemEvos": save.nodes[currentNode].items[i].itemEvos,
                "pastDes": save.nodes[currentNode].items[i].pastDes,
                "reqFails": save.nodes[currentNode].items[i].reqFails,
                "reqValids": save.nodes[currentNode].items[i].reqValids
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

function increaseFails(currentNode) {
    let total = +save.nodes[currentNode].fails["total"];
    let consecutive = +save.nodes[currentNode].fails["consecutive"];
    total += 1;
    consecutive += 1;
    save.nodes[currentNode].fails["total"] = total.toString();
    save.nodes[currentNode].fails["consecutive"] = consecutive.toString();
    save.nodes[currentNode].valids["consecutive"] = "0";
}

function increaseValids(currentNode) {
    let total = +save.nodes[currentNode].valids["total"];
    let consecutive = +save.nodes[currentNode].valids["consecutive"];
    total += 1;
    consecutive += 1;
    save.nodes[currentNode].valids["total"] = total.toString();
    save.nodes[currentNode].valids["consecutive"] = consecutive.toString();
    save.nodes[currentNode].fails["consecutive"] = "0";
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
    if (playing) {
        $('#outputSim').append(`<h3>${game[currentNode].name}</h3>`);
        displayMessage(cNodeDescription, false);
        displayItems();
    }
}

function parseAction(input) {
    if (playing) {
        let action = input.toUpperCase();
        let sentMessage = false;

        displayMessage(input, true);

        //Update previous input
        previousInput = input;

        //Filter out ignorables
        action = filterIgnorables(action);

        //Handle actions
        let foundMatch = false;
        let isGlobal = false;
        for (let h = 0; h < cNodeActions.length; h++) {
            if (filterIgnorables(cNodeActions[h].toUpperCase()) == action) {
                for (let i = 0; i < globalActions.length; i++) {
                    if (isGlobal == true) {
                        break;
                    }
                    let variants = globalActions[i].actions.toUpperCase().split(/\s*,\s*/);
                    for (let j = 0; j < variants.length; j++) {
                        if (filterIgnorables(variants[j]) == action) {
                            game[currentNode].actions.actions.push(globalActions[i]);
                            isGlobal = true;
                            break;
                        }
                    }
                }
                for (let i = 0; i < game[currentNode].actions.actions.length; i++) {
                    let variants = game[currentNode].actions.actions[i].actions.toUpperCase().split(/\s*,\s*/);
                    for (let m = 0; m < variants.length; m++) {
                        if (filterIgnorables(variants[m]) == action && foundMatch == false) {
                            foundMatch = true;
                            let actionObject = JSON.parse(JSON.stringify(game[currentNode].actions.actions[i]));
                            let reqs = {
                                "reqItemsNot": actionObject.reqItemsNot,
                                "reqContainersNot": actionObject.reqContainersNot,
                                "reqLocalNot": actionObject.reqLocalNot,
                                "reqGlobalNot": actionObject.reqGlobalNot,
                                "preActionNot": actionObject.preActionNot,
                                "locVisitsNot": actionObject.locVisitsNot,
                                "preNodeNot": actionObject.preNodeNot,
                                "itemEvosNot": actionObject.itemEvosNot,
                                "pastDesNot": actionObject.pastDesNot,
                                "reqFailsNot": actionObject.reqFailsNot,
                                "reqValidsNot": actionObject.reqValidsNot,
                                "reqAll": actionObject.reqAll,
                                "reqItems": actionObject.reqItems,
                                "reqContainers": actionObject.reqContainers,
                                "reqLocal": actionObject.reqLocal,
                                "reqGlobal": actionObject.reqGlobal,
                                "preAction": actionObject.preAction,
                                "locVisits": actionObject.locVisits,
                                "preNode": actionObject.preNode,
                                "itemEvos": actionObject.itemEvos,
                                "pastDes": actionObject.pastDes,
                                "reqFails": actionObject.reqFails,
                                "reqValids": actionObject.reqValids
                            }
                            if (checkRequirements(reqs)) {
                                let mainAction = actionObject.actions.split(/\s*,\s*/)[0].toUpperCase();
                                let maxTimes;
                                if (actionObject.max != '' && actionObject.max != null) {
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
                            if (isGlobal == true) {
                                game[currentNode].actions.actions.splice(i, 1);
                            }
                        }
                    }
                }
            }
        }

        //If sentMessage is true, custom actions trump everything so do not continue
        if (sentMessage != true) {
            if (lookCommands.includes(action)) {
                pushAction("LOOK");
                displayMessage(getDescription(currentNode), false);
                displayItems();
                sentMessage = true;
            }

            if (action == "SCORE") {
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
                                                        "reqItemsNot": game[currentNode].containers[q].reqItemsNot,
                                                        "reqContainersNot": game[currentNode].containers[q].reqContainersNot,
                                                        "reqLocalNot": game[currentNode].containers[q].reqLocalNot,
                                                        "reqGlobalNot": game[currentNode].containers[q].reqGlobalNot,
                                                        "preActionNot": game[currentNode].containers[q].preActionNot,
                                                        "locVisitsNot": game[currentNode].containers[q].locVisitsNot,
                                                        "preNodeNot": game[currentNode].containers[q].preNodeNot,
                                                        "itemEvosNot": game[currentNode].containers[q].itemEvosNot,
                                                        "pastDesNot": game[currentNode].containers[q].pastDesNot,
                                                        "reqFailsNot": game[currentNode].containers[q].reqFailsNot,
                                                        "reqValidsNot": game[currentNode].containers[q].reqValidsNot,
                                                        "reqAll": game[currentNode].containers[q].reqAll,
                                                        "reqItems": game[currentNode].containers[q].reqItems,
                                                        "reqContainers": game[currentNode].containers[q].reqContainers,
                                                        "reqLocal": game[currentNode].containers[q].reqLocal,
                                                        "reqGlobal": game[currentNode].containers[q].reqGlobal,
                                                        "preAction": game[currentNode].containers[q].preAction,
                                                        "locVisits": game[currentNode].containers[q].locVisits,
                                                        "preNode": game[currentNode].containers[q].preNode,
                                                        "itemEvos": game[currentNode].containers[q].itemEvos,
                                                        "pastDes": game[currentNode].containers[q].pastDes,
                                                        "reqFails": game[currentNode].containers[q].reqFails,
                                                        "reqValids": game[currentNode].containers[q].reqValids
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
                                                        "reqItemsNot": thisContainer.reqItemsNot,
                                                        "reqContainersNot": thisContainer.reqContainersNot,
                                                        "reqLocalNot": thisContainer.reqLocalNot,
                                                        "reqGlobalNot": thisContainer.reqGlobalNot,
                                                        "preActionNot": thisContainer.preActionNot,
                                                        "locVisitsNot": thisContainer.locVisitsNot,
                                                        "preNodeNot": thisContainer.preNodeNot,
                                                        "itemEvosNot": thisContainer.itemEvosNot,
                                                        "pastDesNot": thisContainer.pastDesNot,
                                                        "reqFailsNot": thisContainer.reqFailsNot,
                                                        "reqValidsNot": thisContainer.reqValidsNot,
                                                        "reqAll": thisContainer.reqAll,
                                                        "reqItems": thisContainer.reqItems,
                                                        "reqContainers": thisContainer.reqContainers,
                                                        "reqLocal": thisContainer.reqLocal,
                                                        "reqGlobal": thisContainer.reqGlobal,
                                                        "preAction": thisContainer.preAction,
                                                        "locVisits": thisContainer.locVisits,
                                                        "preNode": thisContainer.preNode,
                                                        "itemEvos": thisContainer.itemEvos,
                                                        "pastDes": thisContainer.pastDes,
                                                        "reqFails": thisContainer.reqFails,
                                                        "reqValids": thisContainer.reqValids
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
                        if (variants[j].toUpperCase() == actionItem) {
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
                let inspectableItems = JSON.parse(JSON.stringify(save.items.concat(save.nodes[currentNode].items)));

                for (let i = 0; i < inspectableItems.length; i++) {
                    let variants = inspectableItems[i].name.split(/\s*,\s*/);
                    for (let j = 0; j < variants.length; j++) {
                        if (variants[j].toUpperCase() == actionItem) {
                            let reqs = {
                                "reqItemsNot": inspectableItems[i].reqItemsNot,
                                "reqContainersNot": inspectableItems[i].reqContainersNot,
                                "reqLocalNot": inspectableItems[i].reqLocalNot,
                                "reqGlobalNot": inspectableItems[i].reqGlobalNot,
                                "preActionNot": inspectableItems[i].preActionNot,
                                "locVisitsNot": inspectableItems[i].locVisitsNot,
                                "preNodeNot": inspectableItems[i].preNodeNot,
                                "itemEvosNot": inspectableItems[i].itemEvosNot,
                                "pastDesNot": inspectableItems[i].pastDesNot,
                                "reqFailsNot": inspectableItems[i].reqFailsNot,
                                "reqValidsNot": inspectableItems[i].reqValidsNot,
                                "reqAll": inspectableItems[i].reqAll,
                                "reqItems": inspectableItems[i].reqItems,
                                "reqContainers": inspectableItems[i].reqContainers,
                                "reqLocal": inspectableItems[i].reqLocal,
                                "reqGlobal": inspectableItems[i].reqGlobal,
                                "preAction": inspectableItems[i].preAction,
                                "locVisits": inspectableItems[i].locVisits,
                                "preNode": inspectableItems[i].preNode,
                                "itemEvos": inspectableItems[i].itemEvos,
                                "pastDes": inspectableItems[i].pastDes,
                                "reqFails": inspectableItems[i].reqFails,
                                "reqValids": inspectableItems[i].reqValids
                            }
                            if (checkRequirements(reqs)) {
                                if (inspectableItems[i].evos.length > 0) {
                                    let messageToDisplay;
                                    for (let k = 0; k < inspectableItems[i].evos.length; k++) {
                                        let evo = inspectableItems[i].evos[k];
                                        reqs = {
                                            "reqItemsNot": evo.reqItemsNot,
                                            "reqContainersNot": evo.reqContainersNot,
                                            "reqLocalNot": evo.reqLocalNot,
                                            "reqGlobalNot": evo.reqGlobalNot,
                                            "preActionNot": evo.preActionNot,
                                            "locVisitsNot": evo.locVisitsNot,
                                            "preNodeNot": evo.preNodeNot,
                                            "itemEvosNot": evo.itemEvosNot,
                                            "pastDesNot": evo.pastDesNot,
                                            "reqFailsNot": evo.reqFailsNot,
                                            "reqValidsNot": evo.reqValidsNot,
                                            "reqAll": evo.reqAll,
                                            "reqItems": evo.reqItems,
                                            "reqContainers": evo.reqContainers,
                                            "reqLocal": evo.reqLocal,
                                            "reqGlobal": evo.reqGlobal,
                                            "preAction": evo.preAction,
                                            "locVisits": evo.locVisits,
                                            "preNode": evo.preNode,
                                            "itemEvos": evo.itemEvos,
                                            "pastDes": evo.pastDes,
                                            "reqFails": evo.reqFails,
                                            "reqValids": evo.reqValids
                                        }
                                        if (checkRequirements(reqs)) {
                                            messageToDisplay = inspectableItems[i].evos[k].evoDes;
                                        }
                                    }
                                    if (messageToDisplay != undefined) {
                                        displayMessage(messageToDisplay, false);
                                        sentMessage = true;
                                    } else {
                                        displayMessage(inspectableItems[i].description, false);
                                        sentMessage = true;
                                    }
                                } else {
                                    displayMessage(inspectableItems[i].description, false);
                                    sentMessage = true;
                                }
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
                        if (variants[j].toUpperCase() == actionItem) {
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
                let message
                badAction += 1;
                increaseFails(currentNode);
                if (game[currentNode].actions.evos.length == 0 && game[currentNode].actions.invalid == "") {
                    message = "This did nothing.";
                } else {
                    message = game[currentNode].actions.invalid;
                }
                for (let i = 0; i < game[currentNode].actions.evos.length; i++) {
                    let evo = game[currentNode].actions.evos[i];
                    let reqs = {
                        "reqItemsNot": evo.reqItemsNot,
                        "reqContainersNot": evo.reqContainersNot,
                        "reqLocalNot": evo.reqLocalNot,
                        "reqGlobalNot": evo.reqGlobalNot,
                        "preActionNot": evo.preActionNot,
                        "locVisitsNot": evo.locVisitsNot,
                        "preNodeNot": evo.preNodeNot,
                        "itemEvosNot": evo.itemEvosNot,
                        "pastDesNot": evo.pastDesNot,
                        "reqFailsNot": evo.reqFailsNot,
                        "reqValidsNot": evo.reqValidsNot,
                        "reqAll": evo.reqAll,
                        "reqItems": evo.reqItems,
                        "reqContainers": evo.reqContainers,
                        "reqLocal": evo.reqLocal,
                        "reqGlobal": evo.reqGlobal,
                        "preAction": evo.preAction,
                        "locVisits": evo.locVisits,
                        "preNode": evo.preNode,
                        "itemEvos": evo.itemEvos,
                        "pastDes": evo.pastDes,
                        "reqFails": evo.reqFails,
                        "reqValids": evo.reqValids
                    }
                    if (checkRequirements(reqs)) {
                        message = game[currentNode].actions.evos[i].evoDes;
                    }
                }
                displayMessage(message, false);
            } else {
                badAction = 0;
                increaseValids(currentNode);
            }
        }
        
        handleHint();
        nodeReload();
    }
}

export { gameInit,
    parseAction,
    containerDeposits,
    containerWithdrawals,
    takeCommands,
    dropCommands,
    ignorables,
    lookCommands,
    itemInspectCommands,
    previousInput }
