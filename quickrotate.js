QuickRotatePlugin = {};

// TODO: figure out why combining these into a single function with a direction argument gets the LCS translation wrong

QuickRotatePlugin.ButtonR = function()
{
    FormIt.UndoManagement.BeginState();

    var selections = FormIt.Selection.GetSelections();
    //console.log("Selections: " + JSON.stringify(selections));
    var AABB = WSM.Utils.GetAxisAlignedBoundingBox(selections, WSM.Utils.CoordSystem.HCS);
    //console.log("AABB: " + JSON.stringify(AABB));
    
    var nHistoryID = FormIt.GroupEdit.GetEditingHistoryID();
    //console.log("Current history: " + JSON.stringify(nHistoryID));

    var midpoint = WSM.Geom.Point3d((AABB.upper.x + AABB.lower.x) * 0.5, (AABB.lower.y + AABB.upper.y) * 0.5, AABB.lower.z);
    var zvector = WSM.Geom.Vector3d(0, 0, 1)	
    var rotationcenter = WSM.Geom.Line3d(midpoint,zvector)	
    var angle = 90 * Math.PI /180;
    
    // for each object selected, execute the flip along
    for (var j = 0; j < selections.length; j++)
    {
        // if you're not in the Main History, need to calculate the depth to extract the correct history data
        var historyDepth = (selections[j]["ids"].length) -1;
        //console.log("Current history depth: " + historyDepth);        

        // get objectID of the current selection
        var nObjectID = selections[j]["ids"][historyDepth]["Object"];
        //console.log("Object ID: " + JSON.stringify(nObjectID));
        
        // define the rotation
        var rotation = WSM.Geom.MakeRotationTransform(rotationcenter,angle)	
        // change geometry using the given translation
        WSM.APITransformObjects(nHistoryID,nObjectID,rotation)	
     }

    FormIt.UndoManagement.EndState("Quick Rotate");
    console.log("Quick Rotated " + selections.length + " object(s) in History " + nHistoryID);
}
FormIt.Commands.RegisterJSCommand("QuickRotatePlugin.ButtonR");
