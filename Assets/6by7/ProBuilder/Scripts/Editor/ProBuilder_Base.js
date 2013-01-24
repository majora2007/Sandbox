class ProBuilder_Base extends EditorWindow 
{	
	//GUI
	var scrollView : Vector2;
	
	//states
	var proBuilderActive : boolean = false;
	var editGeometryMode : boolean = false;
	var gridSnapActive : boolean = false;
	var allowVertSnap : boolean = true;
	var lastSelChangeWasFilter : boolean = true;
	var sel_Dirty : boolean = false;
	var is_NoDrawVisible : boolean = true;
	var is_ZonesVisible : boolean = true;	
	//
	
	//box vars
	var allBoxes : GameObject[];
	var boxesToOptimize : int = 0;
	var boxesOptimized : int = 0;
	
	//texture vars
	var tileUVs : boolean = true;
	var textureOffset = Vector3(0f,0f,0f);
	var textureRotation : float = 0f;
	var textureScale = Vector3(1f,1f,1f);
	var vertScrollStyle : GUIStyle;
	//
	
	//selection
	var selectedItemList = new Array();
	var builderBoxSelection = new Array();
	var vertHandleSelection = new Array();
	var planeSelection = new Array();
	var sel_Obj : GameObject;
	var sel_Length : int;
	var sel_lastLength : int;
	var storedSelection : GameObject;
	var storedLength : int;
	
	//vert movement and grid snapping
	var snappedPos : Vector3;
	var gridLineColor : Color;
	var gridSnapSize : float = 1.0;
	var activeObjectPrevPos : Vector3;
	var activeObjectCurrentPos : Vector3;
	var moveHelper : Transform;
	
	//Update--
	function Update()
	{
		if(proBuilderActive)
		{
			//custom "OnSelectionChange"
			if(Selection.activeGameObject != storedSelection || Selection.gameObjects.length != storedLength)
			{
				storedSelection = Selection.activeGameObject;
				storedLength = Selection.gameObjects.length;
				FilterSelection();				
			}		
			//move verts
			if(editGeometryMode && Selection.activeTransform && !sel_Dirty)
			{
				activeObjectCurrentPos = Selection.activeTransform.position;
				if(activeObjectCurrentPos != activeObjectPrevPos) //if the active (inspector shown) vert has moved...
				{
					//VertHandleMoved();
					UpdateVertHandles();
					//now that we've moved, save the this as the "prevPosition" so we can know if we moved again
					activeObjectPrevPos = activeObjectCurrentPos; 
				}			
			}
		}
		else //just select the box, one by one
		{
			if(Selection.gameObjects.length == 1)
			{
				if(Selection.activeGameObject)
				{
					if(Selection.activeGameObject.GetComponent(builder_Plane))
					{
						var theBox = Selection.activeObject.transform.parent.gameObject;
						Selection.objects = new Array();
						Selection.activeObject = theBox;
					}
				}
			}		
		}
	}
	//--
	
	//Turn on/off geo edit mode
	function EnterGeometryMode()
	{
		sel_Dirty = true; //notify script we need to filter the selection asap
		vertHandleSelection.Clear(); //clear the vertex selection list		
		//get the builder box selection
		LockNLoadBuilderBoxes();
		//if any builder boxes selected...
		if(builderBoxSelection.length != 0)
		{
			//go through all selected Builder Boxes, and tell them to enter vertex mode
			for(theBox in builderBoxSelection)
			{	
				theBox.GetComponent(builder_Box).EnterEditMode();
			}				
			Selection.objects = new Array(); //deselect all objects
			//enter edit mode!
			editGeometryMode = true;
		}
	}
	function ExitGeometryMode()
	{
		//make sure all verts have been properly "pulled"
		for(theVertHandle in vertHandleSelection)
		{
			theVertHandle.GetComponent(builder_VertHandle).UpdateAttachedVerts();
		}
		
		//go through all selected Builder Boxes, and tell them to exit vertex mode
		for(theBox in builderBoxSelection)
		{	
			theBox.GetComponent(builder_Box).ExitEditMode();
		}
		
		Selection.objects = builderBoxSelection;
		editGeometryMode = false;
		//
	}
	
	//Handles movement of vert handles
	function UpdateVertHandles()
	{
		for(vertHandle in vertHandleSelection)
		{
			vertHandle.GetComponent(builder_VertHandle).UpdateAttachedVerts();
		}
	}
	
	//generic "deselect and lock all builder boxes, enter them in array to be called later, etc..."
	function LockNLoadBuilderBoxes()
	{
		//clear out the Builder Box selection list
		builderBoxSelection.Clear();
		//find all Builder Boxes in selection, and change selection to only them
		for(var i=0;i<Selection.gameObjects.length;i++) //go through all in selection
		{
			if(Selection.gameObjects[i].GetComponent(builder_Box)) //this is a Builder Box selected, so...
			{
				builderBoxSelection.Add(Selection.gameObjects[i]); //add it to the Builder Box Selection list
			}
		}
		//if no builder boxes selected, exit this loop and do nothing
		if(builderBoxSelection.length == 0)
		{
			return;
		}
	}
	
	//function to toggle all NoDraw planes
	function ToggleNoDraw()
	{
		if(!editGeometryMode)
		{
			allBoxes = GameObject.FindGameObjectsWithTag("BuilderBox");
			for(theBox in allBoxes)
			{
				theBox.GetComponent(builder_Box).ToggleNoDraw(is_NoDrawVisible);
			}
			is_NoDrawVisible = !is_NoDrawVisible;
		}
	}
	
	//function to toggle all NoDraw planes
	function ToggleZones()
	{
		if(!editGeometryMode)
		{
			allBoxes = GameObject.FindGameObjectsWithTag("BuilderBox");
			for(theBox in allBoxes)
			{
				theBox.GetComponent(builder_Box).ToggleZones(is_ZonesVisible);
			}
			is_ZonesVisible = !is_ZonesVisible;
		}
	}
	
	function FindVertCenter()
	{
		var sel_Center : Vector3;
		for(theVertHandle in vertHandleSelection)
		{
			sel_Center+=theVertHandle.transform.position;
		}
		sel_Center/=vertHandleSelection.length;
		return sel_Center;
	}
	
	function FilterSelection()
	{
		sel_Dirty = true;
		if(editGeometryMode)
		{
			for(theVertHandle in vertHandleSelection)
			{
				if(theVertHandle)
					theVertHandle.GetComponent(builder_VertHandle).DeSelect();
			}
			vertHandleSelection.Clear();
			
			for(var v=0;v<Selection.gameObjects.length;v++)
			{
				if(Selection.gameObjects[v].GetComponent(builder_VertHandle) && Selection.gameObjects[v].GetComponent(builder_VertHandle).isActive)
				{
					vertHandleSelection.Add(Selection.gameObjects[v]);
				}
				else if(Selection.gameObjects[v].GetComponent(builder_Plane))
				{
					vertHandleSelection = vertHandleSelection.Concat(Selection.gameObjects[v].GetComponent(builder_Plane).myVertHandles);
				}
			}
			
			if(Selection.activeTransform)
			{
				if(vertHandleSelection.length > 0)
				{
					Selection.objects = vertHandleSelection;
					activeObjectPrevPos = Selection.activeTransform.position;
					for(theVertHandle in vertHandleSelection)
					{
						theVertHandle.GetComponent(builder_VertHandle).Select();
					}
					activeObjectCurrentPos = Selection.activeTransform.position;
				}
			}
			else
				Selection.objects = new Array();
		}
		else if(proBuilderActive)//basic edit mode is on, just selecting regular
		{
			var tempArray = new Array();
			for(theObj in Selection.gameObjects)
			{
				if(theObj.GetComponent(builder_Box))
				{
					tempArray.Add(theObj);
				}
				else if(theObj.GetComponent(builder_Plane))
				{
					tempArray.Add(theObj.transform.parent.gameObject);
				}
			}
			Selection.objects = tempArray;
		}
		sel_Dirty = false;
	}
	
	function SpawnNewBox()
	{
		if(!editGeometryMode)
		{
			var newBox : GameObject;
			newBox = Instantiate((Resources.LoadAssetAtPath("Assets/6by7/ProBuilder/Prefabs/BuilderBox.prefab", typeof(Object))), Vector3.zero, Quaternion.identity);
			newBox.GetComponent(builder_Box).SetupBox();
			Selection.objects = new Array();
			Selection.activeObject = newBox;
			EditorApplication.ExecuteMenuItem("GameObject/Move To View");
			newBox.tag = "BuilderBox";
		}
	}
	
	function SpawnInstancedBox()
	{
		if(!editGeometryMode)
		{
			LockNLoadBuilderBoxes();
			var newBoxes = new Array();
			for(theBox in builderBoxSelection)
			{
				var newBox : GameObject;
				newBox = Instantiate(theBox, theBox.transform.position, theBox.transform.rotation);
				newBox.GetComponent(builder_Box).instancedBox = true;
				newBox.GetComponent(builder_Box).SetupBox();
				newBoxes.Add(newBox);
				newBox.tag = "BuilderBox";
			}
			Selection.objects = newBoxes;
		}
	}
	
	function ActivateProBuilder()
	{
		//go through all boxes, removing from array if gone, and activating if till available
		proBuilderActive = true;
		allBoxes = GameObject.FindGameObjectsWithTag("BuilderBox");
		//deselect all
		Selection.objects = new Array();
		//get vert scroll style for scrollbar
		vertScrollStyle =  EditorGUIUtility.GetBuiltinSkin(EditorSkin.Inspector).verticalScrollbar;
		//allow selection filtering
		allowSelectionFiltering = true;
	}
	
	function DeActivateProBuilder()
	{
		//exit all modes
		if(editGeometryMode)
			ExitGeometryMode();
			
		//go through all boxes, removing from array if gone, and deactivating if till available
		proBuilderActive = false;
		allBoxes = GameObject.FindGameObjectsWithTag("BuilderBox");
		
		//deselect all
		Selection.objects = new Array();
	}
}	