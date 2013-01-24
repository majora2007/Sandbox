@CustomEditor (builder_FacePainter)
class FacePainter_Ed extends Editor 
{
	function OnSceneGUI()
	{
		if(Event.current.type == EventType.MouseDown && Event.current.button == 1) 
		{
			RayTest();
		}
	}
    function OnInspectorGUI() 
	{
		//DrawDefaultInspector();		
    }
	
	function RayTest()
	{
		var worldRay = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
		var hitInfo : RaycastHit;
		if(Physics.Raycast(worldRay, hitInfo, 1000))
		{
			if(hitInfo.collider.gameObject.GetComponent(builder_Plane))
			{
				target.GetComponent(builder_FacePainter).PaintFace(hitInfo.collider.gameObject);
			}
		}
	}
}