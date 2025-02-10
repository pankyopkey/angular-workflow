
var isDarkMode = false; // is accessed by html elements (button) so must be declared in script scope

let nodeDataArray = [
    // { "key": 1, "category": "firstNode", "text": "Add First Step.." },
    { "key": 1, "figure": "RoundedLeftRectangle", "text": "When clicking ‘Test workflow’", source: 'images/ai.png' },
    { "key": 2, "figure": "RoundedRectangle", "text": "When chat message received", source: 'images/uparrow.png' },
    { "key": 4, "figure": "RoundedSquare", "text": "Basic LLM Chain" ,source: 'images/code.png'},
    { "key": 3, "figure": "Circle", "text": "Code" ,source: 'images/ai.png'},
    { "key": 5, "figure": "RoundedRectangle", "text": "Azure OpenAI Chat Model", source: 'images/ai.png' }

]
let linkDataArray = [
    { "from": -1, "to": 0 },
    { "from": -2, "to": 0 },
    { "from": -2, "to": 3 },
    { "from": -3, "to": 3 },
    { "from": 0, "to": 1 },
    { "from": 1, "to": 2 },
    { "from": 1, "to": 3 },
    { "from": 0, "to": 5 },
    { "from": 5, "to": 3 },
    { "from": 3, "to": 2 },


    { "from": 3, "to": 6 },

    { "from": 2, "to": 100 },
    { "from": 6, "to": 101 },

    { "from": 0, "to": 200 },
    { "from": 3, "to": 201 },
    { "from": 2, "to": 202 }
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
        'toolManager.mouseWheelBehavior': go.WheelMode.Zoom,
        "clickCreatingTool.archetypeNodeData": { text: "Node", color: "lightgray" },
        initialAutoScale: go.AutoScale.UniformToFill,
        'linkingTool.direction': go.LinkingDirection.ForwardsOnly,
        layout: new go.LayeredDigraphLayout({
            isInitial: true,
            isOngoing: false,
            layerSpacing: 100
        }),
        'undoManager.isEnabled': true,
        "Modified": onModified,
        "contentAlignment": go.Spot.Center,
        "initialContentAlignment": go.Spot.TopLeft,
        "animationManager.isEnabled": true,
    });

    function onSelectionChanged(node) {
        const shape = node.findObject('SHAPE');
        console.log(shape)
        if (node.isSelected) {
            if (shape) {
                shape.strokeWidth = 10;
            }
        }

        else {
            if (shape) {
                // shape.fill = "#ffffff";
                shape.strokeWidth = 2;
            }
        }

    }

    // define the Node template
    myDiagram.nodeTemplate = $(go.Node, 'Auto', {
        isShadowed: false,
        shadowBlur: 0,
        shadowColor: blueShadow,
        cursor: 'pointer',
        shadowOffset: new go.Point(4, 6),
        selectionAdorned: false,
        mouseEnter: (e, obj) => {
            changeProperty(obj, 'PlUS_LINE', 'stroke', 'red')
            changeProperty(obj, 'MENU_SECTION', 'visible', true)
        },
        mouseLeave: (e, obj) => {
            changeProperty(obj, 'PlUS_LINE', 'stroke', 'gray')
            changeProperty(obj, 'MENU_SECTION', 'visible', false)
        },
        selectionChanged: onSelectionChanged
    },
        // Main Vertical panel for layout
        $(go.Panel, "Vertical",{
            
        },

            $(go.Panel, "Horizontal", {
                name: "MENU_SECTION",
                visible: false
            },
                new go.Shape('PlusLine', {
                    name: 'SHAPE',
                    portId: '',
                    fromEndSegmentLength: 40,
                    fill: '#ffffff',
                    stroke: "#ccc",
                    strokeWidth: 1,
                    margin: 3,
                    desiredSize: new go.Size(20, 20)  // Size of the rectangle
                }),
            ),
            // First panel: This is used to create RoundedLeftRectangle shape
            $(go.Panel, "Auto",
                new go.Shape({
                    name: 'SHAPE',
                    portId: '',
                    cursor: 'pointer',
                    fromEndSegmentLength: 40,
                    fill: '#ffffff',
                    stroke: "#ccc",
                    strokeWidth: 2,
                    parameter1: 15,   // Rounded corners
                    desiredSize: new go.Size(90, 80)  // Size of the rectangle
                }
                ).bind('figure'),

                // Second panel: It is used to add shape inside shape
                $(go.Picture, {
                    name: 'INSIDE_SHAPE',
                    desiredSize: new go.Size(40, 40)
                },
                    new go.Binding("source"),

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
            )
        )
    )



    // Create a node template map
    // myDiagram.nodeTemplateMap = new go.Map();

    // myDiagram.nodeTemplateMap.add('trigger',
    //     $(go.Node, 'Auto', {
    //         isShadowed: false,
    //         shadowBlur: 0,
    //         shadowColor: blueShadow,
    //         shadowOffset: new go.Point(4, 6),
    //         selectionAdorned: false,
    //         selectionChanged: onSelectionChanged
    //     },
    //         // Main Vertical panel for layout
    //         $(go.Panel, "Vertical",

    //             $(go.Panel, "Horizontal", {
    //                 name: "MENU_SECTION",
    //                 // visible: false
    //             },
    //                 new go.Shape('PlusLine', {
    //                     name: 'SHAPE',
    //                     portId: '',
    //                     fromEndSegmentLength: 40,
    //                     fill: '#ffffff',
    //                     stroke: "#ccc",
    //                     strokeWidth: 1,
    //                     margin: 3,
    //                     desiredSize: new go.Size(20, 20)  // Size of the rectangle
    //                 }),
    //             ),
    //             // First panel: This is used to create RoundedLeftRectangle shape
    //             $(go.Panel, "Auto",
    //                 new go.Shape('RoundedLeftRectangle', {
    //                     name: 'SHAPE',
    //                     portId: '',
    //                     cursor: 'pointer',
    //                     fromEndSegmentLength: 40,
    //                     fill: '#ffffff',
    //                     stroke: "#ccc",
    //                     strokeWidth: 2,
    //                     cursor: 'move',
    //                     parameter1: 15,   // Rounded corners
    //                     desiredSize: new go.Size(90, 80)  // Size of the rectangle
    //                 }),

    //                 // Second panel: It is used to add shape inside shape
    //                 $(go.Shape, {
    //                     name: 'INSIDE_SHAPE',
    //                     strokeWidth: 5,
    //                     fill: 'gray',
    //                     stroke: 'gray',
    //                     desiredSize: new go.Size(20, 30)
    //                 },
    //                     new go.Binding("geometry", "geometry", function (value) {

    //                         if (value) {
    //                             return go.Geometry.parse(value);
    //                         }
    //                         return go.Geometry.parse('F M10 10 L20 10 L20 20 L10 20 Z');
    //                     }).makeTwoWay(),

    //                 )

    //             ),

    //             // Third panel: TextBlock (text field)
    //             $(go.Panel, "Auto",
    //                 new go.TextBlock('', {  // Empty string as placeholder for 'text' binding
    //                     wrap: go.TextBlock.WrapFit,
    //                     textAlign: "center",
    //                     maxLines: 3,
    //                     overflow: go.TextBlock.OverflowEllipsis,
    //                     alignment: go.Spot.Center,
    //                     font: bigfont,
    //                     desiredSize: new go.Size(140, NaN),
    //                     cursor: 'move',
    //                     margin: 5,
    //                     name: 'TEXTBLOCK_NAME',
    //                 }).bindTwoWay('text')  // Bind text dynamically
    //             )
    //         )
    //     )
    // );

    // myDiagram.nodeTemplateMap.add('firstNode',
    //     $(go.Node, 'Auto', {
    //         selectionAdorned: false,
    //         cursor: 'pointer',
    //         mouseEnter: (e, obj) => { changeProperty(obj, 'PlUS_LINE', 'stroke', 'red') },
    //         mouseLeave: (e, obj) => { changeProperty(obj, 'PlUS_LINE', 'stroke', 'gray') },
    //     },
    //         // Main Vertical panel for layout
    //         $(go.Panel, "Vertical",

    //             // First panel: This is used to create RoundedLeftRectangle shape
    //             $(go.Panel, "Auto",
    //                 new go.Shape('RoundedRectangle', {
    //                     name: 'SHAPE',
    //                     portId: '',
    //                     fromEndSegmentLength: 40,
    //                     fill: '#ffffff',
    //                     stroke: "#ccc",
    //                     strokeWidth: 1,
    //                     strokeDashArray: [6, 3],
    //                     desiredSize: new go.Size(90, 80)  // Size of the rectangle
    //                 }),

    //                 // Second panel: It is used to add shape inside shape
    //                 $(go.Shape, "PlusLine", {
    //                     name: 'PlUS_LINE',
    //                     strokeWidth: 5,
    //                     fill: 'gray',
    //                     stroke: 'gray',
    //                     desiredSize: new go.Size(20, 20)
    //                 }

    //                 )

    //             ),

    //             // Third panel: TextBlock (text field)
    //             $(go.Panel, "Auto",
    //                 new go.TextBlock('', {  // Empty string as placeholder for 'text' binding
    //                     wrap: go.TextBlock.WrapFit,
    //                     textAlign: "center",
    //                     maxLines: 3,
    //                     overflow: go.TextBlock.OverflowEllipsis,
    //                     alignment: go.Spot.Center,
    //                     stroke: "grey",
    //                     desiredSize: new go.Size(140, NaN),
    //                     margin: 5,
    //                     name: 'TEXTBLOCK_NAME',
    //                 }).bindTwoWay('text')  // Bind text dynamically
    //             )
    //         )
    //     )
    // );




    // myDiagram.nodeTemplateMap.add('Action',
    //     new go.Node('Auto', {
    //         isShadowed: false,
    //         shadowBlur: 2,
    //         shadowColor: blueShadow,
    //         shadowOffset: new go.Point(4, 6)
    //     })
    //         .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
    //         .add(
    //             new go.Shape('RoundedRectangle', {
    //                 name: 'SHAPE',
    //                 stroke: 'rgba(0, 0, 0, 0)',
    //                 portId: '',
    //                 fromLinkable: true,
    //                 cursor: 'pointer',
    //                 fromEndSegmentLength: 40,
    //                 fill: '#ffffff',
    //                 stroke: "#ccc",
    //                 strokeWidth: 2,
    //                 minSize: new go.Size(200, 80)

    //             }),
    //             new go.TextBlock('Source', textStyle())
    //                 .bindTwoWay('text')
    //         )
    // );
    // myDiagram.nodeTemplateMap.add('RoundedSquare',
    //     new go.Node('Auto', {
    //         isShadowed: false,
    //         shadowBlur: 2,
    //         shadowColor: blueShadow,
    //         shadowOffset: new go.Point(4, 6)
    //     })
    //         .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
    //         .add(
    //             new go.Shape('RoundedRectangle', {
    //                 name: 'SHAPE',
    //                 stroke: 'rgba(0, 0, 0, 0)',
    //                 portId: '',
    //                 fromLinkable: true,
    //                 cursor: 'pointer',
    //                 fromEndSegmentLength: 40,
    //                 fill: '#ffffff',
    //                 stroke: "#ccc",
    //                 strokeWidth: 2,
    //                 minSize: new go.Size(80, 80)

    //             }),
    //             new go.TextBlock('Source', textStyle())
    //                 .bindTwoWay('text')
    //         )
    // );
    // myDiagram.nodeTemplateMap.add('RoundedSquare',
    //     new go.Node('Auto', {
    //         isShadowed: false,
    //         shadowBlur: 2,
    //         shadowColor: blueShadow,
    //         shadowOffset: new go.Point(4, 6)
    //     })
    //         .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
    //         .add(
    //             new go.Shape('RoundedRectangle', {
    //                 name: 'SHAPE',
    //                 stroke: 'rgba(0, 0, 0, 0)',
    //                 portId: '',
    //                 fromLinkable: true,
    //                 cursor: 'pointer',
    //                 fromEndSegmentLength: 40,
    //                 fill: '#ffffff',
    //                 stroke: "#ccc",
    //                 strokeWidth: 2,
    //                 minSize: new go.Size(80, 80)

    //             }),
    //             new go.TextBlock('Source', textStyle())
    //                 .bindTwoWay('text')
    //         )
    // );

    // myDiagram.nodeTemplateMap.add('Process',
    //     $(go.Node, 'Auto', {
    //         isShadowed: false,
    //         shadowBlur: 2,
    //         shadowColor: blueShadow,
    //         shadowOffset: new go.Point(4, 6),
    //     },
    //         $(go.Panel, "Vertical",
    //             $(go.Panel, "Auto",
    //                 new go.Shape('Circle', {
    //                     name: 'SHAPE',
    //                     stroke: 'rgba(0, 0, 0, 0)',
    //                     portId: '',
    //                     //fromLinkable: true,
    //                     cursor: 'pointer',
    //                     fromEndSegmentLength: 40,
    //                     fill: '#ffffff',
    //                     stroke: "#ccc",
    //                     strokeWidth: 2,
    //                     minSize: new go.Size(40, 40),
    //                     cursor: 'move',
    //                     desiredSize: new go.Size(70, 70)
    //                 }),
    //             ),
    //             $(go.Panel, "Auto",
    //                 new go.TextBlock('Source', {
    //                     wrap: go.TextBlock.WrapFit,
    //                     textAlign: "center",
    //                     maxLines: 3,
    //                     overflow: go.TextBlock.OverflowEllipsis,
    //                     alignment: go.Spot.Center,
    //                     font: bigfont,
    //                     // maxSize: new go.Size(70, 40),
    //                     //width: 140,
    //                     desiredSize: new go.Size(140, NaN),
    //                     cursor: 'move',
    //                     margin: 5,
    //                     name: 'TEXTBLOCK_NAME',
    //                 }).bindTwoWay('text')
    //             )
    //         )
    //     )
    // );



    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate = new go.Link({ // the whole link panel
        curve: go.Curve.Bezier,
        toShortLength: 5,
        fromSpot: go.Spot.Right,
        toSpot: go.Spot.Left
    })
        .add(
            new go.Shape({ // the link shape
                stroke: lineColor,
                strokeWidth: 2.5
            }),
            new go.Shape({ // the arrowhead
                toArrow: 'Kite',
                fill: lineColor,
                stroke: lineColor,
                scale: 1.5
            })
        );


    myDiagram.model.nodeDataArray = nodeDataArray;

    myDiagram.model.linkDataArray = linkDataArray;
    console.log(myDiagram.model.nodeDataArray)


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
