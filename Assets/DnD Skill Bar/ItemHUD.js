// Texture variables
private var icon1 : Texture2D;
private var icon2 : Texture2D;
private var highlight : Texture2D;
private var activated : Texture2D;
private var slotBG : Texture2D;
 
private var clickInfo = new Array();							// Information where the mouse has clicked
private var hoverInfo = new Array();							// Information where the mouse is currently hovering
private var dragMode : boolean = false;							// If we are dragging or not
 
private var actionList = new Array();							// List of action classes, rects, and requirements
private var bagList = new Array();								// List of bag classes, rects, and requirements
 
function Awake  () {
	//	These should be loaded in Awake  ().
	//	Resouces.Load doesn't like being called in the declaration stage.
	icon1 = Resources.Load("action-icon-1");
	icon2 = Resources.Load("action-icon-2");
	highlight = Resources.Load("slot-highlight");
	activated = Resources.Load("slot-active-highlight");
	slotBG = Resources.Load("slots-bg");
}
 
function Start() {
	// Set actionList attributes
	actionList = new Array(12);
	for(i=0; i<actionList.length; i++) actionList[i] = new Array(4);
	for(i=0; i<actionList.length; i++) {
		actionList[i][1] = Rect(203+(i*29),203, 24, 24);        // Set slot rect
		actionList[i][2] = new Array("action");     // Set slot restrictions
	}
	// Set actionList keymappings
	actionList[0][3] = KeyCode.Alpha1;
	actionList[1][3] = KeyCode.Alpha2;
	actionList[2][3] = KeyCode.Alpha3;
	actionList[3][3] = KeyCode.Alpha4;
	actionList[4][3] = KeyCode.Alpha5;
	actionList[5][3] = KeyCode.Alpha6;
	actionList[6][3] = KeyCode.Alpha7;
	actionList[7][3] = KeyCode.Alpha8;
	actionList[8][3] = KeyCode.Alpha9;
	actionList[9][3] = KeyCode.Alpha0;
	actionList[10][3] = KeyCode.Minus;
	actionList[11][3] = KeyCode.Equals;
 
	// Set bagList attributes
	/*bagList = new Array(12);
	for(i=0; i<bagList.length; i++)
		bagList[i] = new Array(3);
	for(i=0; i<bagList.length; i++) {
		bagList[i][1] = Rect(203+(i*29), 237, 24, 24);      // Set slot rect
		bagList[i][2] = new Array("action");                        // Set slot restrictions
	}*/
}
function Update (){
	// Handle mouse button down event
	if(Input.GetMouseButtonDown(0))
		storeMouseLoc();
	// Handle mouse down event
	if(Input.GetMouseButton(0))
		dragCheck();
	// Handle mouse up event
	if(Input.GetMouseButtonUp(0))
		compareMouseLoc();
}
 
function OnGUI(){
	// Reset mouse over info to null
	hoverInfo = new Array();
 
	// Draw the slot backgrounds
	GUI.DrawTexture(Rect(200,200,349,30), slotBG);
	//GUI.DrawTexture(Rect(200,234,349,30), slotBG);
 
	// Add to buttons
	if(GUI.Button(Rect(200,300,200,25), "Add items to action bar")){
		var openSlot = getNextSlot(actionList);
		if(openSlot != -1){
			actionList[openSlot][0] = new classEvilSmile();
		}
	}
	/*if(GUI.Button(Rect(200,330,200,25), "Add items to bags")){
		openSlot = getNextSlot(bagList);
		if(openSlot != -1)
			bagList[openSlot][0] = new classFistPunch();
	}*/
 
	// Draw Action Bar GUI
	for(i=0; i<actionList.length; i++){
		// If there is an item class in the slot, draw the button
		if(actionList[i][0] != null)
			drawButton(actionList[i][1], actionList[i][0].icon, i, actionList);
		// Otherwise just check if the mouse is over the rect
		else
			checkRectHover(actionList[i][1], null, i, actionList);
	}
 
	// Draw Bag GUI
	/*for(i=0; i<bagList.length; i++){
		// If there is an item class in the slot, draw the button
		if(bagList[i][0] != null)
			drawButton(bagList[i][1], bagList[i][0].icon, i, bagList);
		// Otherwise just check if the mouse is over the rect
		else
			checkRectHover(bagList[i][1], null, i, bagList);
	}*/
 
	// Handle keyboard input
	getKeyInput();
 
	// If we are dragging, draw the drag icon
	if(dragMode)	drawDragIcon();
}
 
// Custom function to draw a GUI icon and store information at the same time
function drawButton(rect, image, index, pointer){
	var drawIcon : boolean = true;								// Boolean for if we should draw the icon (dragging)
	if(clickInfo.length > 0)											// If there was a previous click
		if(clickInfo[0] == rect && dragMode)					// If the clicked rectangle is this rect and we are dragging
			drawIcon = false;										// Dont draw the icon
	if(drawIcon)														// If we are good to draw the icon
		GUI.DrawTexture(rect, image);							// Draw the icon
	checkRectHover(rect, image, index, pointer);			// Now check if the mouse is hovering over the rect
}
 
// Checks if mouse is hovering over a rect
function checkRectHover(rect, image, index, pointer){
	if(rect.Contains(getMousePos())){							// Check for mouse over
		hoverInfo.Push(rect);										// Store the rect info
		hoverInfo.Push(image);										// Store the icon info
		hoverInfo.Push(index);										// Store the index info
		hoverInfo.Push(pointer[index][0]);						// Store if slot contains an obj
		hoverInfo.Push(pointer);									// Pointer to class array
		hoverInfo.Push(getMousePos());						// Store click position
		if(pointer[index][0]){										// If there is an item that our mouse is over
			if(!Input.GetMouseButton(0))
				GUI.DrawTexture(rect, highlight);				// Draw mouse over highlight
			else
				GUI.DrawTexture(rect, activated);				// Draw in use highlight
		}
	}
}
 
// Stores current location on mouse down, only if we are above an item
function storeMouseLoc(){
	if(hoverInfo.length > 0 && hoverInfo[3] != null)
		clickInfo = hoverInfo;
}
 
// Checks for mouse dragging
function dragCheck(){
	if(clickInfo.length > 0)
		if((getMousePos() - clickInfo[5]).sqrMagnitude > 60) dragMode = true;
}
 
// Compares current location to stored location on mouse up
function compareMouseLoc(){
	// If we clicked a slot, and we are above a slot now, and there was an item in the previous slot
	if(hoverInfo.length > 0 && clickInfo.length > 0){
		// If we are in the same bar and same location and not dragging, use the item
		if(hoverInfo[2] == clickInfo[2] && checkReq(clickInfo[4][hoverInfo[2]][0].type, hoverInfo[4][hoverInfo[2]][2]) && !dragMode){
			// If there is an item in the slot, use it
			if(clickInfo[4][clickInfo[2]][0]){
				clickInfo[4][clickInfo[2]][0].use();
			}
		}
		// If we are in the same bar and same location and dragging, do nothing
		if(hoverInfo[2] == clickInfo[2] && hoverInfo[4] == clickInfo[4] && dragMode){
		}
		// If there is an item in the slot we are moving to
		if(hoverInfo[4][hoverInfo[2]][0]){
			var clickedItemReq = checkReq(clickInfo[4][clickInfo[2]][0].type, hoverInfo[4][hoverInfo[2]][2]);
			var hoverItemReq = checkReq(hoverInfo[4][hoverInfo[2]][0].type, clickInfo[4][clickInfo[2]][2]);
			if(clickedItemReq && hoverItemReq){
				var clickSwap = clickInfo[4][clickInfo[2]][0];
				var hoverSwap = hoverInfo[4][hoverInfo[2]][0];
				clickInfo[4][clickInfo[2]][0] = hoverSwap;
				hoverInfo[4][hoverInfo[2]][0] = clickSwap;
			}
		}
		// If the slot is empty that we are moving to
		else{
			// Check if click item can move to empty slot
			if(checkReq(clickInfo[4][clickInfo[2]][0].type, hoverInfo[4][hoverInfo[2]][2])){
				hoverInfo[4][hoverInfo[2]][0] = clickInfo[4][clickInfo[2]][0];
				clickInfo[4][clickInfo[2]][0] = null;
			}
		}
	}
	// If we clicked an item, but are not above an item now, destroy the item
	else if(hoverInfo.length == 0 && clickInfo.length > 0){
		clickInfo[4][clickInfo[2]][0] = null;
	}
	clickInfo = new Array();			// Reset mouse clickInfo
	dragMode = false;					// Reset dragMode
}
 
// Returns a rect that is slightly smaller then the given rect
function getHoverRect(hoverRect){
	hoverRect.x += 1;
	hoverRect.y += 1;
	hoverRect.width -= 1;
	hoverRect.height -= 1;
	return hoverRect;
}
 
// Returns the next available open slot in specified list, -1 if none found
function getNextSlot(list){
	var slotFound = -1;
	for(i=0; i<list.length; i++){
		if(!list[i][0]){
			slotFound = i;
			break;
		}
	}
	return slotFound;
}
 
// Returns true or false if item meets list requirements
function checkReq(item, list){
	var result = false;
	for(i=0; i<list.length; i++){
		if(item == list[i]){
			result = true;
			break;
		}
	}
	return result;
}
 
// Draws the icon that is dragging
function drawDragIcon(){
	var pos = getMousePos();
	GUI.DrawTexture(Rect(pos.x - 15, pos.y - 15, 24, 24), clickInfo[1]);
}
 
// Returns the real mouse position
function getMousePos(){
	var pos : Vector2 = new Vector2(Input.mousePosition.x, (Screen.height - Input.mousePosition.y));
	return pos;
}
 
// Function that checks for keyboard input from user
function getKeyInput(){
	for(i=0; i<actionList.length; i++){
		if(Input.GetKey(actionList[i][3]) && actionList[i][0]){
			GUI.DrawTexture(actionList[i][1], activated);
		}
		else if(Input.GetKeyUp(actionList[i][3]) && actionList[i][0]){
			actionList[i][0].use();
		}
	}
}