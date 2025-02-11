
var isDarkMode = false; // is accessed by html elements (button) so must be declared in script scope

let nodeDataArray = [
    // { "key": 1, "category": "firstNode", "text": "Add First Step.." },
    { "key": 1, "figure": "RoundedLeftRectangle", "text": "When clicking ‘Test workflow’", source: 'images/ai.png', type: 'RoundedLeftRectangle' },
    { "key": 2, "figure": "RoundedRectangle", "text": "When chat message received", source: 'images/uparrow.png', type: '' },
    { "key": 4, "figure": "Square", "text": "Basic LLM Chain", source: 'images/code.png', type: 'Square' },
    { "key": 3, "figure": "Circle", "text": "Code", source: 'images/ai.png', type: 'Circle' },
    { "key": 5, "figure": "RoundedRectangle", "text": "Azure OpenAI Chat Model", source: 'images/ai.png', type: '' },
    { "key": 6, "figure": "RoundedRectangle", "text": "Block chain", source: 'images/ai.png', type: 'RoundedRectangle' }

]
let linkDataArray = [
    { "from": 1, "to": 2 },
    { "from": 2, "to": 3 },
    { "from": 3, "to": 4 },
    { "from": 3, "to": 5 },
]


// colors are almost entirely defined up here to allow for easier theming
var yellow = '#FFB400';

var green = '#7FB800';
var blue = '#00A6ED';
var red = '#D73909';
var white = '#DCE9F9';

var blueShadow = '#407090';
var greenShadow = '#406050';
var yellowShadow = '#804040';
var redShadow = '#705020';

var selectColor = 'dodgerBlue';
var undesiredEventTextColor = 'whitesmoke';

var lineColor = '#0D2C54';

var bigfont = 'bold 10pt Helvetica, Arial, sans-serif';
var smallfont = 'bold 11pt Helvetica, Arial, sans-serif';

function init() {


    const $ = go.GraphObject.make;

    myDiagram = new go.Diagram('myDiagramDiv', {
        // have mouse wheel events zoom in and out instead of scroll up and down
        //'toolManager.mouseWheelBehavior': go.WheelMode.Zoom,
        //"clickCreatingTool.archetypeNodeData": { text: "Node", color: "lightgray" },
        //initialAutoScale: go.AutoScale.UniformToFill,
        allowDrop: true,
        // 'linkingTool.toLinkable':true,
        // 'linkingTool.fromLinkable':true,
        "undoManager.isEnabled": true,
        "linkingTool.portGravity": 60,
        "relinkingTool.portGravity": 60,
        grid: $(go.Panel, "Grid", { gridCellSize: new go.Size(20, 20) }, $(go.Shape, "LineH", { strokeDashArray: [1, 20], stroke: '#7e8186' })),
        layout: new go.LayeredDigraphLayout({
            isInitial: true,
            isOngoing: false,
            isRealtime: true,
            layerSpacing: 100
        }),
        'undoManager.isEnabled': true,
        "Modified": onModified,
        // "contentAlignment": go.Spot.Center,
        // "initialContentAlignment": go.Spot.TopLeft,
        "animationManager.isEnabled": true,
        // "draggingTool.isEnabled": false,
    });

    function onSelectionChanged(node) {
        const shape = node.findObject('Palceholder');
        console.log(shape)
        if (node.isSelected) {
            if (shape) {
                shape.fill = '#e6e9ed';
            }
        }

        else {
            if (shape) {
                // shape.fill = "#ffffff";
                shape.fill = 'transparent';
            }
        }

        hideContextMenu()
    }

    // This is the actual HTML context menu:
    let cxElement = document.getElementById('contextMenu');

    // an HTMLInfo object is needed to invoke the code to set up the HTML cxElement
    let myContextMenu = new go.HTMLInfo({
        show: showContextMenu,
        hide: hideContextMenu
    });

    // define the Node template
    myDiagram.nodeTemplate = $(go.Node, 'Auto', {
        isShadowed: false,
        shadowBlur: 0,
        shadowColor: blueShadow,
        cursor: 'pointer',
        contextMenu: myContextMenu,
        selectionAdorned: false,
        shadowOffset: new go.Point(4, 6),
        locationSpot: go.Spot.Center,
        locationObjectName: "SHAPE_FIGURE",
        name: 'NodeDiagram',
        mouseEnter: (e, obj) => {
            changeProperty(obj, 'PlUS_LINE', 'stroke', 'red')
            if(obj.data.type !='PlusLine'){
                changeProperty(obj, 'MENU_SECTION', 'visible', true);
            }
            showSmallPorts(obj, true)
        },
        mouseLeave: (e, obj) => {
            changeProperty(obj, 'PlUS_LINE', 'stroke', 'gray')
            changeProperty(obj, 'MENU_SECTION', 'visible', false);
            showSmallPorts(obj, false)
        },
        selectionChanged: onSelectionChanged
    },
        // Main Vertical panel for layout
        $(go.Shape, { strokeWidth: 0, fill: "transparent" }),
        $(go.Panel, "Vertical", {},

            $(go.Panel, "Auto", { height: 30, defaultStretch: go.Stretch.Horizontal, alignment: go.Spot.TopCenter, alignmentFocus: go.Spot.BottomLeft, },
                $(go.Panel, "Horizontal", { name: "MENU_SECTION", visible: false, defaultStretch: go.Stretch.Horizontal, alignment: go.Spot.TopRight, alignmentFocus: go.Spot.BottomLeft, },
                    $(go.Picture, {
                        name: 'INSIDE_SHAPE',
                        desiredSize: new go.Size(12, 12),
                        source: 'images/play-button.png',
                        margin: new go.Margin(0, 5, 5, 0),
                        filter: 'grayscale(100%)',
                        click: (e, obj) => {
                            console.log(obj)
                        },
                        mouseEnter: (e, obj) => {
                            obj.filter = 'grayscale(0%)'
                        },
                        mouseLeave: (e, obj) => {
                            obj.filter = 'grayscale(100%)'
                        },
                    }),
                    $(go.Picture, {
                        name: 'INSIDE_SHAPE',
                        desiredSize: new go.Size(12, 12),
                        source: 'images/delete.png',
                        filter: 'grayscale(100%)',
                        margin: new go.Margin(0, 5, 5, 0),
                        filter: 'grayscale(100%)',
                        click: (e, obj) => {
                            console.log(obj)
                        },
                        mouseEnter: (e, obj) => {
                            obj.filter = 'grayscale(0%)'
                        },
                        mouseLeave: (e, obj) => {
                            obj.filter = 'grayscale(100%)'
                        },
                    }),
                    $(go.Picture, {
                        name: 'INSIDE_SHAPE',
                        desiredSize: new go.Size(12, 12),
                        source: 'images/power-switch.png',
                        filter: 'grayscale(100%)',
                        margin: new go.Margin(0, 5, 5, 0),
                        filter: 'grayscale(100%)',
                        click: (e, obj) => {
                            console.log(obj)
                        },
                        mouseEnter: (e, obj) => {
                            obj.filter = 'grayscale(0%)'
                        },
                        mouseLeave: (e, obj) => {
                            obj.filter = 'grayscale(100%)'
                        },
                    }),
                    $(go.Picture, {
                        name: 'INSIDE_SHAPE',
                        desiredSize: new go.Size(12, 12),
                        filter: 'grayscale(100%)',
                        source: 'images/dots.png',
                        margin: new go.Margin(0, 5, 5, 0),
                        filter: 'grayscale(100%)',
                        click: (e, obj) => {
                            console.log(obj)
                            showContextMenu(obj, myDiagram)
                        },
                        mouseEnter: (e, obj) => {
                            obj.filter = 'grayscale(0%)'
                        },
                        mouseLeave: (e, obj) => {
                            obj.filter = 'grayscale(100%)'
                        },
                    }),
                    
                )
            ),
            // First panel: This is used to create RoundedLeftRectangle shape
            $(go.Panel, "Auto",
                $(go.Shape,
                    { name: 'Palceholder', strokeWidth: 0, fill: "transparent", },
                    new go.Binding("figure"),
                    new go.Binding("parameter1", "figure", v => {
                        if (v == 'RoundedRectangle') {
                            return 15;
                        }
                        else if (v == 'RoundedLeftRectangle') {
                            return 10;
                        }
                        else if (v == 'Circle') {
                            return 8;
                        } else {
                            return 8
                        }
                    }),
                    new go.Binding("desiredSize", "type", v => {

                        if (v == 'RoundedRectangle') {
                            return new go.Size(220, 100);
                        }
                        else if (v == 'RoundedLeftRectangle') {
                            return new go.Size(110, 100);
                        }
                        else if (v == 'Circle') {
                            return new go.Size(135, 135);
                        }
                        else if (v == "Square") {
                            return new go.Size(110, 110);
                        }
                        else if (v == "PlusLine") {
                            return new go.Size(40, 40);
                        }
                        else {
                            return new go.Size(110, 100)
                        }
                    }),

                ),
                $(go.Panel, "Spot",
                    {
                        fromLinkable: true,
                        toLinkable: true,
                    },
                    $(go.Shape, {
                        name: 'SHAPE_FIGURE',
                        portId: '',
                        cursor: 'pointer',
                        //fromEndSegmentLength: 40,
                        fill: '#ffffff',
                        stroke: "#7e8186",
                        strokeWidth: 2,
                        // fromLinkable: true, 
                        // toLinkable: true,
                        // parameter1: 15,   // Rounded corners
                        // desiredSize: new go.Size(90, 80),  // Size of the rectangle,
                        // selectionAdorned: false,
                        fromLinkable: true,
                        fromLinkableSelfNode: false,
                        fromLinkableDuplicates: true,
                        toLinkable: true,
                        toLinkableSelfNode: false,
                        toLinkableDuplicates: true,
                    },
                        new go.Binding("figure"),
                        new go.Binding("parameter1", "figure", v => {
                            if (v == 'RoundedRectangle') {
                                return 8;
                            }
                            else if (v == 'RoundedLeftRectangle') {
                                return 15;
                            }
                            else if (v == 'Circle' || v == 'PlusLine') {
                                return 0;
                            } else {
                                return 8
                            }
                        }),
                        new go.Binding("desiredSize", "type", v => {

                            if (v == 'RoundedRectangle') {
                                return new go.Size(200, 80);
                            }
                            else if (v == 'RoundedLeftRectangle') {
                                return new go.Size(90, 80);
                            }
                            else if (v == 'Circle') {
                                return new go.Size(80, 80);
                            } 
                            else if (v == "Square") {
                                return new go.Size(90, 90);
                            }
                            else if (v == "PlusLine") {
                                return new go.Size(30, 30);
                            }
                             else {
                                return new go.Size(90, 80)
                            }
                        }),
                    ),

                    makePort("T", go.Spot.Top, true, true),
                    makePort("B", go.Spot.Bottom, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("L", go.Spot.Left, true, true),

                    // Second panel: It is used to add shape inside shape
                    $(go.Panel, 'Horizontal',
                        $(go.Picture, {
                            name: 'INSIDE_SHAPE',
                            desiredSize: new go.Size(40, 40)
                        },
                            new go.Binding("source"),
                            new go.Binding("desiredSize", "type", v => v == 'RoundedRectangle' ? new go.Size(30, 30) : new go.Size(40, 40)),
                            new go.Binding("visible", "type", v => v != 'PlusLine'),

                        ),
                        new go.TextBlock('', {  // Empty string as placeholder for 'text' binding
                            wrap: go.TextBlock.WrapFit,
                            textAlign: "center",
                            maxLines: 3,
                            overflow: go.TextBlock.OverflowEllipsis,
                            alignment: go.Spot.Center,
                            font: bigfont,
                            desiredSize: new go.Size(140, NaN),
                            margin: 5,
                            name: 'TEXTBLOCK_NAME',
                        }).bindTwoWay('text')
                            .bind("visible", "type", v => v == 'RoundedRectangle')
                    ),
                    {
                        toolTip: $(
                            go.Adornment,
                            "Auto",
                            $(go.Shape, { fill: "#000000" }),
                            $(go.TextBlock, { stroke: '#ffffff', margin: 6, maxSize: new go.Size(400, NaN) }, new go.Binding("text", "text"))
                        ),
                    },
                    // makePort("T", go.Spot.Top, true, true),
                    // makePort("B", go.Spot.Bottom, true, true),
                    // makePort("R", go.Spot.Right, true, true),
                    // makePort("L", go.Spot.Left, true, true),
                )

            ),

            // Third panel: TextBlock (text field)
            $(go.Panel, "Auto",
                new go.TextBlock('', {  // Empty string as placeholder for 'text' binding
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    maxLines: 3,
                    overflow: go.TextBlock.OverflowEllipsis,
                    alignment: go.Spot.Center,
                    font: bigfont,
                    desiredSize: new go.Size(140, NaN),
                    margin: 5,
                    name: 'TEXTBLOCK_NAME',
                }).bindTwoWay('text')  // Bind text dynamically
                    .bind("visible", "type", v => v != 'RoundedRectangle' && v!= 'PlusLine')
            )
        ),
        // { // handle mouse enter/leave events to show/hide the ports
        //     mouseEnter: (e, node) => showSmallPorts(node, true),
        //     mouseLeave: (e, node) => showSmallPorts(node, false)
        // },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    )




    myDiagram.linkTemplate = $(go.Link,

        {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 50,
            toShortLength: 0,
            relinkableFrom: false,
            relinkableTo: false,
            // reshapable: true,
            // resegmentable: true,
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides
        },
        {
            selectable: false,
            mouseEnter: (e, obj) => {
                changeProperty(obj, 'LINK_MENU_SECTION', 'visible', true);
                const shape = obj.findObject('LINK_LINE');
                const toArrowTip = obj.findObject('AH');
                if (shape && toArrowTip) {
                    shape.stroke = '#e74266';
                    toArrowTip.fill = '#e74266';
                    toArrowTip.stroke = '#e74266';

                }
            },
            mouseLeave: (e, obj) => {
                changeProperty(obj, 'LINK_MENU_SECTION', 'visible', false)
                const shape = obj.findObject('LINK_LINE');
                const toArrowTip = obj.findObject('AH');
                if (shape && toArrowTip) {
                    shape.stroke = '#7e8186';
                    toArrowTip.fill = '#7e8186';
                    toArrowTip.stroke = '#7e8186';
                }
                // shape.stroke = '#7e8186';
            },
        },
        $(go.Shape, { isPanelMain: true, strokeWidth: 20, stroke: "transparent" }),
        $(go.Shape, { name: 'LINK_LINE', isPanelMain: true, stroke: "#7e8186", strokeWidth: 2, toLinkable: true, toLinkableSelfNode: true }), // the main path
        $(go.Shape, { name: "AH", toArrow: "RoundedTriangle", scale: 1.2, fill: "#7e8186", stroke: "#7e8186", toLinkable: true, toLinkableSelfNode: true }),  // the arrowhead

        $(go.Panel, "Horizontal",
            { margin: new go.Margin(-20, 20, -20, 20), name: 'LINK_MENU_SECTION', visible: false },
            $(go.Panel, 'Spot', { margin: 3, cursor: 'pointer' },
                {
                    mouseEnter: (e, obj) => {
                        const shape = obj.findObject('IMG_BOX');
                        const image = obj.findObject('INSIDE_SHAPE');
                        if (shape && image) {
                            shape.stroke = '#e74266';
                            image.filter = 'grayscale(0%)'
                        }
                    },
                    mouseLeave: (e, obj) => {
                        const shape = obj.findObject('IMG_BOX');
                        const image = obj.findObject('INSIDE_SHAPE');
                        if (shape && image) {
                            shape.stroke = '#7e8186';
                            image.filter = 'grayscale(100%)'
                        }
                    },
                    click: (e, obj) => {

                        addNewNode(obj.part.fromNode, myDiagram, 'RoundedLeftRectangle')
                        
                    },
                },
                new go.Shape("RoundedRectangle", { name: 'IMG_BOX', width: 20, height: 20, strokeWidth: 1, fill: '#fff', stroke: "#7e8186" }),
                $(go.Panel, "Spot",
                    $(go.Picture, {
                        name: 'INSIDE_SHAPE',
                        desiredSize: new go.Size(14, 14),
                        source: 'images/add.png',
                        filter: 'grayscale(100%)',
                        margin: 2,
                        filter: 'grayscale(100%)',
                        imageStretch: go.ImageStretch.Uniform,
                        click: (e, obj, p) => {

                            let fromNode = obj.fromNode;
                            let toNode = obj.toNode;
                            console.log(obj, fromNode)
                        },
                        // stroke:'#e74266',
                    }),
                )
            ),
            $(go.Panel, 'Spot', { margin: 3, cursor: 'pointer' },
                {
                    mouseEnter: (e, obj) => {
                        const shape = obj.findObject('IMG_BOX');
                        const image = obj.findObject('INSIDE_SHAPE');
                        if (shape && image) {
                            shape.stroke = '#e74266';
                            image.filter = 'grayscale(0%)'
                        }
                    },
                    mouseLeave: (e, obj) => {
                        const shape = obj.findObject('IMG_BOX');
                        const image = obj.findObject('INSIDE_SHAPE');
                        if (shape && image) {
                            shape.stroke = '#7e8186';
                            image.filter = 'grayscale(100%)'
                        }
                    },
                    click: (e, obj) => {
                        console.log(obj)
                    },
                },
                new go.Shape("RoundedRectangle", { name: 'IMG_BOX', width: 20, height: 20, strokeWidth: 1, fill: '#fff', stroke: "#7e8186" }),
                $(go.Panel, "Spot",
                    $(go.Picture, {
                        name: 'INSIDE_SHAPE',
                        desiredSize: new go.Size(14, 14),
                        source: 'images/delete.png',
                        filter: 'grayscale(100%)',
                        margin: 2,
                        filter: 'grayscale(100%)',
                        imageStretch: go.ImageStretch.Uniform,
                        // stroke:'#e74266',
                    }),
                )
            ),
        )

    )


    myDiagram.addModelChangedListener((e) => {
        if (e.isTransactionFinished) {

            myDiagram.nodes.each((node) => {
                if (node.findLinksOutOf().count == 0 && node.data.type != 'PlusLine') {
                    addNewNode(node, myDiagram, 'PlusLine')
                }
            });
        }
    }
    )



    const dataModel = {
        "class": "GraphLinksModel",
        "nodeDataArray": nodeDataArray,
        "linkDataArray": linkDataArray
    }

    myDiagram.model = go.Model.fromJson(dataModel);

    function showContextMenu(obj, diagram, tool) {
        // Show only the relevant buttons given the current state.
        selectedNode = obj;
        cxElement.classList.add('show-menu');
        // we don't bother overriding positionContextMenu, we just do it here:
        var mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = mousePt.x + 130 + 'px';
        cxElement.style.top = mousePt.y + 'px';

    }

    function hideContextMenu() {
        cxElement.classList.remove('show-menu');
    }



}


function changeProperty(node, key, property, value) {
    const shape = node.findObject(key);
    if (shape) {
        shape[property] = value;
    }


}


window.addEventListener('DOMContentLoaded', init);


function onModified(e) {
    console.log("this is called when graph is modified", e)
}

function textStyle() {
    return {
        margin: 10,
        wrap: go.Wrap.Fit,
        textAlign: 'center',
        editable: true,
        font: bigfont
    };
}

function makePort(name, spot, output, input) {
    const $ = go.GraphObject.make;
    return $(go.Shape, "Circle",
        {

            fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
            stroke: null,
            desiredSize: new go.Size(11, 11),
            alignment: spot,  // align the port on the main Shape
            alignmentFocus: spot,  // just inside the Shape
            portId: name,  // declare this object to be a "port"
            fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
            fromLinkable: true, toLinkable: true,  // declare whether the user may draw links to/from here
            cursor: "pointer"
        },
        {
            toolTip: $(
                go.Adornment,
                "Auto",
                $(go.Shape, { fill: "#000000" }),
                $(go.TextBlock, { stroke: '#ffffff', margin: 6, maxSize: new go.Size(400, NaN), text: 'Drag sequence flow to connect task.' })
            ),
        },
        new go.Binding("visible", "type", v => v != 'PlusLine'),
    );
}
function showSmallPorts(node, show) {
    node.ports.each(port => {
        if (port.portId !== "") {  // don't change the default port, which is the big shape
            port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
    });
}

function hideCX() {
    if (myDiagram.currentTool instanceof go.ContextMenuTool) {
        myDiagram.currentTool.doCancel();
    }
}
selectedNode = null;
function addNewNode(selectedNode, myDiagram, type) {
    let pos = selectedNode.location;

    let newPos = new go.Point(pos.x + 200, pos.y);
    let newNodeData = { "key": myDiagram.model.nodeDataArray.length + 1, "figure": type, "text": "new node", source: 'images/ai.png', loc: '0 0', type: type,'loc':newPos.toString() }
    myDiagram.model.addNodeData(newNodeData);




    let linkData1 = {
        from: selectedNode.data.key,
        to: newNodeData.key
    };

    let linkData2 = null;

    if (selectedNode.findLinksOutOf().count > 0) {
        let outgoingLink = selectedNode.findLinksOutOf().first();
        myDiagram.model.removeLinkData(outgoingLink.data);
        linkData2 = {
            from: newNodeData.key,
            to: outgoingLink.toNode.data.key
        };
    }


    myDiagram.model.addLinkData(linkData1);
    if (linkData2) {
        myDiagram.model.addLinkData(linkData2);
    }

    myDiagram.layoutDiagram(true);

}
