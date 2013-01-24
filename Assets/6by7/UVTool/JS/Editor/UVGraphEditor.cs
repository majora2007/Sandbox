using UnityEngine;
using UnityEditor;
using System.Collections;

public class UVGraphEditor : EditorWindow {

	//[MenuItem("Window/6by7/UV Graph Window")]
	public static void Init()
	{
		ScriptableObject.CreateInstance<UVGraphEditor>().ShowUtility();
	}

	public const int WINDOW_SIZE = 512;
	void OnEnable()
	{
		this.minSize = new Vector2(WINDOW_SIZE, WINDOW_SIZE);
		this.maxSize = new Vector2(WINDOW_SIZE, WINDOW_SIZE);
	
		if(Selection.gameObjects.Length > 0)
			sel = Selection.gameObjects[0];
	}

	public void OnSelectionChange()
	{
		if(Selection.gameObjects.Length > 0)
			sel = Selection.gameObjects[0];
	}

	GameObject sel;


	// force update window
	void OnInspectorUpdate()
	{
		if(EditorWindow.focusedWindow != this)
	    	Repaint();
	}

	int padding = 150;
	int max_width_height;
	int preview_width;
	int preview_height;

	string uv_coord_info = "no coordinate selected";

	public void OnGUI()
	{
		// Cache everything or early out if no mesh filter
		if(!sel || !sel.GetComponent<MeshFilter>())
			return;

		Mesh mesh = sel.GetComponent<MeshFilter>().sharedMesh;
		GameObject[] go_array = Selection.gameObjects;
		Mesh[] mesh_array = new Mesh[go_array.Length];
		for(int i = 0; i < mesh_array.Length; i++)
			mesh_array[i] = go_array[i].GetComponent<MeshFilter>().sharedMesh;
 		Material mat = sel.GetComponent<MeshRenderer>().sharedMaterial;

		if(!mesh || !mat)
			return;

		padding = EditorGUILayout.IntSlider(padding, 1, Screen.width / 2);

		max_width_height = (Screen.width < Screen.height) ? Screen.width : Screen.height;
		max_width_height -= padding*2;
		Rect mat_coords = new Rect(padding, padding, max_width_height, max_width_height);

		Rect info_label_coords = new Rect(10, 40, Screen.width, 40);

		GUI.Label(info_label_coords, "Selected: " + uv_coord_info);
		GUI.DrawTexture(mat_coords, mat.mainTexture, ScaleMode.ScaleToFit, true, 0f);
		
		int img_width = max_width_height;

		foreach(Mesh m in mesh_array)
			for(int i = 0; i < m.uv.Length; i++)
			{
				Vector2 uv_coord = m.uv[i];
				
				uv_coord *= max_width_height;

				int pos_x, pos_y;

				pos_x = (int)uv_coord.x;
				pos_y = (int)uv_coord.y;

				int center_offset = (Screen.width / 2) - img_width /2;

				pos_x += center_offset;
				pos_y += center_offset;

				pos_y = Screen.height - pos_y;

				int b_width = 10;	// button width
				if(GUI.Button(new Rect( 
					pos_x - (b_width/2), 
					pos_y - (b_width/2), 
					b_width, b_width),
					"" + i))
				{
					uv_coord_info = m.name + " " + i + ": " + m.uv[i];
				}
			}
	}
}
