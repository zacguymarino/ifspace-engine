import { loadDomFromNode } from './if_dom.js';
import { createMapFromGame } from './if_nodemap.js';

var game = {};

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
        visits: 0
    };

var cNode = JSON.parse(JSON.stringify(node));

function startGameSim() {
    if ($('#gameSim').css("display") == "none") {
        $('#gameSim').css("display", "block");
    } else {
        $('#gameSim').css("display", "none")
    }

}

async function saveGame() {
    let gameTitle = $('#gameTitle').val();
    let gameFile = {};
    saveCNode();
    gameFile[gameTitle] = JSON.parse(JSON.stringify(game));
    window.IFS_API.saveGame(JSON.stringify(gameFile));
}

async function loadGame() {
    await window.IFS_API.loadGame().then(rawData => {
        let loadData = JSON.parse(rawData.toString());
        let gameTitle = Object.keys(loadData)[0];
        game = loadData[gameTitle];
        cNode = loadData[gameTitle]['0,0,0'];
        loadDomFromNode(cNode);
        createMapFromGame(Object.keys(game));
        $('#gameTitle').val(gameTitle);
    })
}

function deleteNode () {
    if (cNode.location.toString() !== "0,0,0") {
        if (confirm("Are you sure you want to delete the current node?")) {
            if (game.hasOwnProperty(cNode.location.toString())) {
                delete game[cNode.location.toString()];
                cNode = JSON.parse(JSON.stringify(game["0,0,0"]));
                loadDomFromNode(cNode);
                createMapFromGame(Object.keys(game));
            }
        }
    } else {
        alert("You cannot delete the origin node.");
    }
}

function switchNode (title) {
    saveCNode();
    if (game.hasOwnProperty(title)) {
        cNode = JSON.parse(JSON.stringify(game[title]));
    } else {
        cNode = JSON.parse(JSON.stringify(node));
        cNode.location = title.split(',');
    }
    loadDomFromNode(cNode);
    saveCNode();
}

function saveCNode () {
    cNode = generateNode();
    let cTitle = cNode.location.toString();
    game[cTitle] = JSON.parse(JSON.stringify(cNode));
}

function generateNode () {
    //clear current node
    cNode = JSON.parse(JSON.stringify(node));
    //generate name
    let name = $('#name').val();
    cNode.name = name;

    //generate location
    let location = $('#location').html().split(',');
    cNode.location = location;

    //generate visibility
    let visibility = $('#visibility').is(':checked');
    if (visibility) {
        cNode.visibility = "true";
    } else {
        cNode.visibility = "false";
    }

    //generate points
    let nodePoints = $('#points').val();
    cNode.points = nodePoints;

    //generate directions
    let checkboxes = $('#directions').find('input');
    let directions = [];
    for (let input of checkboxes) {
        if ($(input).is(':checked')) {
            let direction = $(input).attr('id');
            let location = $(`#${direction}_Location`).val();
            let alternatives = $(`#${direction}_Alternatives`).val();
            let exclude = $(`#${direction}_Exclude`).is(':checked');
            let reqItems = $(`#${direction}_Items`).val();
            let reqContainers = $(`#${direction}_Containers`).val();
            let reqLocal = $(`#${direction}_Local`).val();
            let reqGlobal = $(`#${direction}_Global`).val();
            let locVisits = $(`#${direction}_Visits`).val();
            let itemEvos = $(`#${direction}_Evos`).val();

            if (exclude) {
                exclude = "true";
            } else {
                exclude = "false";
            }

            let object = {
                "direction": direction,
                "location": location,
                "alternatives": alternatives,
                "exclude": exclude,
                "reqItems": reqItems,
                "reqContainers": reqContainers,
                "reqLocal": reqLocal,
                "reqGlobal": reqGlobal,
                "locVisits": locVisits,
                "itemEvos": itemEvos
            };
            directions.push(object);
        }
    }
    cNode.directions = directions;

    //generate descriptions
    let defaultDes = $('#defaultDes').val();
    let basicDes = $('#basicDes').val();
    let descriptionObject = {
        "defaultDes": defaultDes,
        "basicDes": basicDes,
        "evos": []
    }
    let evoListDes = $('#evoListDescriptions').children();
    if (evoListDes.length > 0) {
        for (let i = 0; i < evoListDes.length; i++) {
            let baseId = $(evoListDes[i]).attr('id');
            let reqItems = $(`#${baseId}_Items`).val();
            let reqContainers = $(`#${baseId}_Containers`).val();
            let reqLocal = $(`#${baseId}_Local`).val();
            let reqGlobal = $(`#${baseId}_Global`).val();
            let locVisits = $(`#${baseId}_Visits`).val();
            let itemEvos = $(`#${baseId}_Evos`).val();
            let evoDes = $(`#${baseId}_Des`).val();

            let evo = {
                "reqItems": reqItems,
                "reqContainers": reqContainers,
                "reqLocal": reqLocal,
                "reqGlobal": reqGlobal,
                "locVisits": locVisits,
                "itemEvos": itemEvos,
                "evoDes": evoDes
            }
            descriptionObject.evos.push(evo);
        }
    }
    cNode.description = descriptionObject;

    //generate items
    let itemArray = [];
    let itemList = $('#itemList').children();
    for (let i = 0; i < itemList.length; i++) {
        let itemId = $(itemList[i]).attr('id');
        let name = $(`#${itemId}_Name`).val();
        let description = $(`#${itemId}_Des`).val();
        let verbs = $(`#${itemId}_Verbs`).val();
        let points = $(`#${itemId}_Points`).val();
        let reqItems = $(`#${itemId}_Items`).val();
        let reqContainers = $(`#${itemId}_Containers`).val();
        let reqLocal = $(`#${itemId}_Local`).val();
        let reqGlobal = $(`#${itemId}_Global`).val();
        let locVisits = $(`#${itemId}_Visits`).val();
        let itemEvos = $(`#${itemId}_Evos`).val();
        let item = {
            "name": name,
            "description": description,
            "verbs": verbs,
            "points": points,
            "reqItems": reqItems,
            "reqContainers": reqContainers,
            "reqLocal": reqLocal,
            "reqGlobal": reqGlobal,
            "locVisits": locVisits,
            "itemEvos": itemEvos,
            "evos": []
        }
        let evoDivs = $(`#${itemId}_EvoList`).children();
        let evoListItems = [];
        for (let j = 0; j < evoDivs.length; j++) {
            let baseId = $(evoDivs[j]).attr('id');
            let reqItems = $(`#${baseId}_Items`).val();
            let reqContainers = $(`#${baseId}_Containers`).val();
            let reqLocal = $(`#${baseId}_Local`).val();
            let reqGlobal = $(`#${baseId}_Global`).val();
            let locVisits = $(`#${baseId}_Visits`).val();
            let itemEvos = $(`#${baseId}_Evos`).val();
            let evoDes = $(`#${baseId}_Des`).val();
            let evo = {
                "reqItems": reqItems,
                "reqContainers": reqContainers,
                "reqLocal": reqLocal,
                "reqGlobal": reqGlobal,
                "locVisits": locVisits,
                "itemEvos": itemEvos,
                "evoDes": evoDes
            }
            evoListItems.push(evo);
        }
        item.evos = evoListItems;
        itemArray.push(item);
    }
    cNode.items = itemArray;

    //generate containers
    let containersArray = [];
    let containerList = $('#containerList').children();
    for (let i = 0; i < containerList.length; i++) {
        let containerId = $(containerList[i]).attr('id');
        let name = $(`#${containerId}_Name`).val();
        let cap = $(`#${containerId}_Capacity`).val();
        let illegal = $(`#${containerId}_Illegal`).val();
        let complete = $(`#${containerId}_Complete`).val();
        let reqItems = $(`#${containerId}_Items`).val();
        let reqContainers = $(`#${containerId}_Containers`).val();
        let reqLocal = $(`#${containerId}_Local`).val();
        let reqGlobal = $(`#${containerId}_Global`).val();
        let locVisits = $(`#${containerId}_Visits`).val();
        let itemEvos = $(`#${containerId}_Evos`).val();
        let container = {
            "name": name,
            "capacity": cap,
            "items": [],
            "complete": complete,
            "illegal": illegal,
            "reqItems": reqItems,
            "reqContainers": reqContainers,
            "reqLocal": reqLocal,
            "reqGlobal": reqGlobal,
            "locVisits": locVisits,
            "itemEvos": itemEvos
        }
        containersArray.push(container);
    }
    cNode.containers = containersArray;

    //generate actions
    let actionsObject = {
        "invalid": "",
        "actions": []
    }
    let actionArray = [];
    let actionList = $('#actionList').children();
    let invalidAction = $('#invalidAction').val();
    for (let i = 0; i < actionList.length; i++) {
        let baseId = $(actionList[i]).attr('id');
        let actions = $(`#${baseId}_Actions`).val();
        let max = $(`#${baseId}_Max`).val();
        let costs = $(`#${baseId}_Costs`).val();
        let drops = $(`#${baseId}_Drops`).val();
        let visibility = $(`#${baseId}_Visibility`).val();
        let response = $(`#${baseId}_Response`).val();
        let points = $(`#${baseId}_Points`).val();
        let reqItems = $(`#${baseId}_Items`).val();
        let reqContainers = $(`#${baseId}_Containers`).val();
        let reqLocal = $(`#${baseId}_Local`).val();
        let reqGlobal = $(`#${baseId}_Global`).val();
        let locVisits = $(`#${baseId}_Visits`).val();
        let itemEvos = $(`#${baseId}_Evos`).val();

        let action = {
            "actions": actions,
            "max": max,
            "costs": costs,
            "drops": drops,
            "visibility": visibility,
            "response": response,
            "points": points,
            "reqItems": reqItems,
            "reqContainers": reqContainers,
            "reqLocal": reqLocal,
            "reqGlobal": reqGlobal,
            "locVisits": locVisits,
            "itemEvos": itemEvos
        }
        actionArray.push(action);
    }
    actionsObject.actions = actionArray;
    actionsObject.invalid = invalidAction;
    cNode.actions = JSON.parse(JSON.stringify(actionsObject));

    //generate win
    let winDes = $('#winDes').val();
    let winReqItems = $('#win_Items').val();
    let winReqContainers = $('#win_Containers').val();
    let winReqLocal = $('#win_Local').val();
    let winReqGlobal = $('#win_Global').val();
    let winLocVisits = $('#win_Visits').val();
    let winItemEvos = $('#win_Evos').val();
    let win = {
        "description": winDes,
        "reqItems": winReqItems,
        "reqContainers": winReqContainers,
        "reqLocal": winReqLocal,
        "reqGlobal": winReqGlobal,
        "locVisits": winLocVisits,
        "itemEvos": winItemEvos
    }
    cNode.win = win;

    //generate lose
    let loseDes = $('#loseDes').val();
    let loseReqItems = $('#lose_Items').val();
    let loseReqContainers = $('#lose_Containers').val();
    let loseReqLocal = $('#lose_Local').val();
    let loseReqGlobal = $('#lose_Global').val();
    let loseLocVisits = $('#lose_Visits').val();
    let loseItemEvos = $('#lose_Evos').val();
    let lose = {
        "description": loseDes,
        "reqItems": loseReqItems,
        "reqContainers": loseReqContainers,
        "reqLocal": loseReqLocal,
        "reqGlobal": loseReqGlobal,
        "locVisits": loseLocVisits,
        "itemEvos": loseItemEvos
    }
    cNode.lose = lose;

    //generate hint
    let hint = $('#hint').val();
    cNode.hint = hint;

    return cNode;
}

export { generateNode, game, node, switchNode, saveGame, loadGame, deleteNode, startGameSim };