@CustomEditor (ProGrids)
class ProGrids_Ed extends Editor 
{
    function OnInspectorGUI() 
	{
		if(GUILayout.Button("Delete Grid"))
		{
			DestroyImmediate(target.gameObject);
		}
    }
}