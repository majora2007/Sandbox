
class classEvilSmile {
	// Class Properties
	var type = "action";									// Class type (checked if slot has restrictions in place)
 
	// Action Properties
	static var icon : Texture2D = Resources.Load("action-icon-2");
	static var description : String = "Evil Smiley Attack.";
 
	// The generic use function for the action
	function use(){
		Debug.Log(description);						// Do stuff
	}
}