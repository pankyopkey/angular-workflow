
var isDarkMode = false; // is accessed by html elements (button) so must be declared in script scope

let nodeDataArray = [
    { "key": 1, "category": "RoundedLeftRectangle", "text": "When clicking ‘Test workflow’" },
    { "key": 2, "category": "RoundedLeftRectangle", "text": "When chat message received" },
    { "key": 4, "category": "RoundedRectangle", "text": "Basic LLM Chain" },
    { "key": 3, "category": "RoundedSquare", "text": "Code" },
    { "key": 5, "category": "Circle", "text": "Azure OpenAI Chat Model" },

    

    

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
            isInitial: false,
            isOngoing: false,
            layerSpacing: 100
        }),
        'undoManager.isEnabled': true,
        "Modified": onModified,
        "contentAlignment": go.Spot.TopLeft,
        "initialContentAlignment": go.Spot.TopLeft,
        "animationManager.isEnabled": true,
        "InitialLayoutCompleted": e => {
            // if not all Nodes have real locations, force a layout to happen
            if (!e.diagram.nodes.all(n => n.location.isReal())) {
              e.diagram.layoutDiagram(true);
            }
        }
    });


    // define the Node template
    myDiagram.nodeTemplate = new go.Node('Auto', {
        isShadowed: false,
        shadowBlur: 2,
        shadowColor: yellowShadow,
        shadowOffset: new go.Point(4, 6)
    })
        .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
        .add(
            new go.Shape('Rectangle', {
                fill: yellow,
                stroke: 'rgba(0, 0, 0, 0)',
                portId: '',
                fromLinkable: true,
                toLinkable: true,
                cursor: 'pointer',
                toEndSegmentLength: 50,
                fromEndSegmentLength: 40
            }),
            new go.TextBlock('Page', {
                margin: 10,
                font: bigfont,
                editable: true
            })
                .bindTwoWay('text')
        );



    // myDiagram.nodeTemplateMap.add('RoundedLeftRectangle',
    //     new go.Node('Auto', {
    //         isShadowed: false,
    //         shadowBlur: 2,
    //         shadowColor: blueShadow,
    //         shadowOffset: new go.Point(4, 6)
    //     })
    //         .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
    //         .add(
    //             new go.Shape('RoundedLeftRectangle', {
    //                 name: 'SHAPE',
    //                 stroke: 'rgba(0, 0, 0, 0)',
    //                 portId: '',
    //                 fromLinkable: true,
    //                 cursor: 'pointer',
    //                 fromEndSegmentLength: 40,
    //                 parameter1:15,
    //                 fill:'#ffffff',
    //                 stroke:"#ccc",
    //                 strokeWidth:2,
    //                 minSize:new go.Size(90, 80)
    //             }),
    //             new go.TextBlock('Source', textStyle())
    //                 .bindTwoWay('text')
    //         )
    // );

    myDiagram.nodeTemplateMap.add('RoundedLeftRectangle',
        $(go.Node,'Auto', {
            isShadowed: false,
            shadowBlur: 2,
            shadowColor: blueShadow,
            shadowOffset: new go.Point(4, 6),
        }, 
        $(go.Panel, "Vertical",
            $(go.Panel, "Auto",
                new go.Shape('RoundedLeftRectangle', {
                    name: 'SHAPE',
                    stroke: 'rgba(0, 0, 0, 0)',
                    portId: '',
                    //fromLinkable: true,
                    cursor: 'pointer',
                    fromEndSegmentLength: 40,
                    fill:'#ffffff',
                    stroke:"#ccc",
                    strokeWidth:2,
                    minSize:new go.Size(40, 40),
                    cursor: 'move',
                    parameter1:15,
                    desiredSize:new go.Size(90, 80)
                }),
            ),
            $(go.Panel, "Auto",
                new go.TextBlock('Source',{
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    maxLines: 3,
                    overflow: go.TextBlock.OverflowEllipsis,
                    alignment: go.Spot.Center,
                    font: bigfont,
                    // maxSize: new go.Size(70, 40),
                    //width: 140,
                    desiredSize: new go.Size(140, NaN),
                    cursor: 'move',
                    margin: 5,
                    name: 'TEXTBLOCK_NAME',
                }).bindTwoWay('text')
            )
        )
        )
    );

    myDiagram.nodeTemplateMap.add('RoundedRectangle',
        new go.Node('Auto', {
            isShadowed: false,
            shadowBlur: 2,
            shadowColor: blueShadow,
            shadowOffset: new go.Point(4, 6)
        })
            .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
            .add(
                new go.Shape('RoundedRectangle', {
                    name: 'SHAPE',
                    stroke: 'rgba(0, 0, 0, 0)',
                    portId: '',
                    fromLinkable: true,
                    cursor: 'pointer',
                    fromEndSegmentLength: 40,
                    fill:'#ffffff',
                    stroke:"#ccc",
                    strokeWidth:2,
                    minSize:new go.Size(200, 80)

                }),
                new go.TextBlock('Source', textStyle())
                    .bindTwoWay('text')
            )
    );
    myDiagram.nodeTemplateMap.add('RoundedSquare',
        new go.Node('Auto', {
            isShadowed: false,
            shadowBlur: 2,
            shadowColor: blueShadow,
            shadowOffset: new go.Point(4, 6)
        })
            .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
            .add(
                new go.Shape('RoundedRectangle', {
                    name: 'SHAPE',
                    stroke: 'rgba(0, 0, 0, 0)',
                    portId: '',
                    fromLinkable: true,
                    cursor: 'pointer',
                    fromEndSegmentLength: 40,
                    fill:'#ffffff',
                    stroke:"#ccc",
                    strokeWidth:2,
                    minSize:new go.Size(80, 80)

                }),
                new go.TextBlock('Source', textStyle())
                    .bindTwoWay('text')
            )
    );
    myDiagram.nodeTemplateMap.add('RoundedSquare',
        new go.Node('Auto', {
            isShadowed: false,
            shadowBlur: 2,
            shadowColor: blueShadow,
            shadowOffset: new go.Point(4, 6)
        })
            .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
            .add(
                new go.Shape('RoundedRectangle', {
                    name: 'SHAPE',
                    stroke: 'rgba(0, 0, 0, 0)',
                    portId: '',
                    fromLinkable: true,
                    cursor: 'pointer',
                    fromEndSegmentLength: 40,
                    fill:'#ffffff',
                    stroke:"#ccc",
                    strokeWidth:2,
                    minSize:new go.Size(80, 80)

                }),
                new go.TextBlock('Source', textStyle())
                    .bindTwoWay('text')
            )
    );

    myDiagram.nodeTemplateMap.add('Circle',
        $(go.Node,'Auto', {
            isShadowed: false,
            shadowBlur: 2,
            shadowColor: blueShadow,
            shadowOffset: new go.Point(4, 6),
        }, 
        $(go.Panel, "Vertical",
            $(go.Panel, "Auto",
                new go.Shape('Circle', {
                    name: 'SHAPE',
                    stroke: 'rgba(0, 0, 0, 0)',
                    portId: '',
                    //fromLinkable: true,
                    cursor: 'pointer',
                    fromEndSegmentLength: 40,
                    fill:'#ffffff',
                    stroke:"#ccc",
                    strokeWidth:2,
                    minSize:new go.Size(40, 40),
                    cursor: 'move',
                    desiredSize:new go.Size(70, 70)
                }),
            ),
            $(go.Panel, "Auto",
                new go.TextBlock('Source',{
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    maxLines: 3,
                    overflow: go.TextBlock.OverflowEllipsis,
                    alignment: go.Spot.Center,
                    font: bigfont,
                    // maxSize: new go.Size(70, 40),
                    //width: 140,
                    desiredSize: new go.Size(140, NaN),
                    cursor: 'move',
                    margin: 5,
                    name: 'TEXTBLOCK_NAME',
                }).bindTwoWay('text')
            )
        )
        )
    );

    // Undesired events have special adornments that allows adding and removing additional "reasons"
    var UndesiredEventAdornmentModify = new go.Adornment('Spot')
        .add(
            new go.Panel('Auto')
                .add(
                    new go.Shape({
                        fill: null,
                        stroke: selectColor,
                        strokeWidth: 4
                    }),
                    new go.Placeholder()
                ),
            // the button to create a new reason, at the bottom-left corner
            go.GraphObject.build('Button', {
                alignment: new go.Spot(1, 1, -5, -5),
                click: addReason
            }) // this function is defined below
                .bindObject('visible', '', (a) => !a.diagram.isReadOnly)
                .add(
                    new go.Shape('TriangleDown', { desiredSize: new go.Size(10, 10) })
                ),
            //the button to remove the most recent reason, above the "create" button
            go.GraphObject.build('Button', {
                alignment: new go.Spot(1, 1, -5, -22),
                click: removeReason
            }) //this function is also defined below
                .bindObject('visible', '', (a) => !a.diagram.isReadOnly)
                .add(
                    new go.Shape('TriangleUp', { desiredSize: new go.Size(10, 10) })
                )
        );

    var reasonTemplate = new go.Panel('Horizontal')
        .add(
            new go.TextBlock('•', {
                margin: 4,
                stroke: undesiredEventTextColor,
                font: smallfont
            }),
            new go.TextBlock('Reason', {
                margin: 4,
                maxSize: new go.Size(200, NaN),
                wrap: go.Wrap.Fit,
                stroke: undesiredEventTextColor,
                editable: true,
                font: smallfont
            })
                .bindTwoWay('text')
        );

    myDiagram.nodeTemplateMap.add('UndesiredEvent',
        new go.Node('Auto', {
            isShadowed: true,
            shadowBlur: 2,
            shadowColor: redShadow,
            shadowOffset: new go.Point(4, 6),
            selectionAdornmentTemplate: UndesiredEventAdornmentModify
        })
            .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
            .add(
                new go.Shape('RoundedRectangle', {
                    fill: red,
                    stroke: null,
                    portId: '',
                    toLinkable: true,
                    toEndSegmentLength: 50
                }),
                new go.Panel('Vertical', { defaultAlignment: go.Spot.Top })
                    .add(
                        new go.TextBlock('Drop', {
                            ...textStyle(),
                            stroke: undesiredEventTextColor,
                            minSize: new go.Size(80, NaN)
                        })
                            .bindTwoWay('text'),
                        new go.Panel('Vertical', {
                            defaultAlignment: go.Spot.TopLeft,
                            itemTemplate: reasonTemplate
                        })
                            .bindTwoWay('itemArray', 'reasonsList')
                    )
            )
    );

    myDiagram.nodeTemplateMap.add('Comment',
        new go.Node('Auto')
            .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
            .add(
                new go.Shape('Rectangle', {
                    portId: '',
                    fill: white,
                    stroke: null,
                    fromLinkable: true
                }),
                new go.TextBlock('A comment', {
                    margin: 10,
                    maxSize: new go.Size(200, NaN),
                    wrap: go.Wrap.Fit,
                    editable: true,
                    font: smallfont
                })
                    .bindTwoWay('text')
                // no ports, because no links are allowed to connect with a comment
            )
    );

    // clicking the add button on an UndesiredEvent node inserts a new text object into the panel
    function addReason(e, obj) {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.reasonsList;
        myDiagram.startTransaction('add reason');
        myDiagram.model.addArrayItem(arr, {});
        myDiagram.commitTransaction('add reason');
    }

    // clicking the remove button will remove the most recent text object added to the panel
    function removeReason(e, obj) {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var arr = adorn.adornedPart.data.reasonsList;
        myDiagram.startTransaction('remove reason');
        myDiagram.model.removeArrayItem(arr, arr.length - 1);
        myDiagram.commitTransaction('remove reason');
    }

    // clicking the button of a default node inserts a new node to the right of the selected node,
    // and adds a link to that new node
    function addNodeAndLink(e, obj) {
        var adorn = obj.part;
        if (adorn === null) return;
        e.handled = true;
        var diagram = adorn.diagram;
        diagram.startTransaction('Add State');
        // get the node data for which the user clicked the button
        var fromNode = adorn.adornedPart;
        var fromData = fromNode.data;
        // create a new "State" data object, positioned off to the right of the adorned Node
        var toData = { text: 'new' };
        var p = fromNode.location;
        toData.loc = p.x + 200 + ' ' + p.y; // the "loc" property is a string, not a Point object
        // add the new node data to the model
        var model = diagram.model;
        model.addNodeData(toData);
        // create a link data from the old node data to the new node data
        var linkdata = {};
        linkdata[model.linkFromKeyProperty] = model.getKeyForNodeData(fromData);
        linkdata[model.linkToKeyProperty] = model.getKeyForNodeData(toData);
        // and add the link data to the model
        model.addLinkData(linkdata);
        // select the new Node
        var newnode = diagram.findNodeForData(toData);
        diagram.select(newnode);
        diagram.commitTransaction('Add State');
    }

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

    // comments will have different links
    myDiagram.linkTemplateMap.add('Comment',
        new go.Link({
            fromSpot: go.Spot.Center,
            toSpot: go.Spot.Center
        })
            .add(
                new go.Shape({
                    strokeWidth: 1.5,
                    stroke: 'darkgreen'
                })
            )
    );

    // when a new link is created, determine what template to use
    myDiagram.addDiagramListener('LinkDrawn', (e) => {
        var link = e.subject;
        if (link.fromNode.category === 'Comment') {
            link.category = 'Comment';
        }
    });

    var palette = new go.Palette('myPaletteDiv', {
        // share the template map with the Palette
        nodeTemplateMap: myDiagram.nodeTemplateMap,
        autoScale: go.AutoScale.Uniform // everything always fits in viewport
    });

    palette.model.nodeDataArray = [
        { category: 'Source' },
        {}, // default node
        { category: 'DesiredEvent' },
        { category: 'UndesiredEvent', reasonsList: [{}] },
        { category: 'Comment' }
    ];
    myDiagram.model.nodeDataArray = nodeDataArray;
    myDiagram.model.linkDataArray = linkDataArray;
    console.log(myDiagram.model.nodeDataArray )


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
