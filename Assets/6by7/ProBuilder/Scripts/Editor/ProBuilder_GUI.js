class ProBuilder_GUI extends ProBuilder_Base 
{
	
    @MenuItem("Window/6by7/ProBuilder (v1.7.3, Free)")
    static function Init()
	{
        var window = GetWindow(ProBuilder_GUI, true, "ProBuilder");
        window.Show();
    }	
	
	//force exit texture or geo mode if window is closed
	function OnDisable()
	{
		if(editGeometryMode)
			ExitGeometryMode(); //this part probably needs "cleanup" as well?
			
		DeActivateProBuilder();
	}
	//
	
	// force gui update -- hacky
	function OnInspectorUpdate()
	{
		// don't update when editing uvs.  this is because the uv window
		// handles mesh selection using Unity's native methods, as opposed
		// to probuilder's.
		if(EditorWindow.focusedWindow != this)
	    	Repaint();
	}

	//GUI	
    function OnGUI() 
	{
		var window = this;
		window.minSize = Vector2(110,300);
		window.maxSize = Vector2(110,300);
		
        EditorGUILayout.BeginVertical();
			if(!proBuilderActive)			
			{
				if(GUILayout.Button("Activate"))
				{
					var tagSetup : boolean = true;
					try
					{
						var test = GameObject.FindWithTag("BuilderBox");
					}
					catch(error)
					{
						Debug.Log("Please create a tag called 'BuilderBox' first!");
						tagSetup = false;
					}
					if(tagSetup)
						ActivateProBuilder();					
				}
			}
			else
			{
				//Begin super-scroll
				vertScrollStyle =  EditorGUIUtility.GetBuiltinSkin(EditorSkin.Inspector).verticalScrollbar;
				scrollView = EditorGUILayout.BeginScrollView(scrollView, GUIStyle.none, vertScrollStyle, GUILayout.Height (position.height));
				//
				
				if(GUILayout.Button("De-Activate", GUILayout.Width(position.width-6)))
				{
					DeActivateProBuilder();
				}
				EditorGUILayout.Space();
				EditorGUILayout.LabelField("Box Actions");
				if(GUILayout.Button("New Box", GUILayout.Width(position.width-6)))
				{
					SpawnNewBox();
				}
				if(GUILayout.Button("Enable Collider", GUILayout.Width(position.width-6)))
				{
					EditorUtility.DisplayDialog("Enable Automatic Collision", "When pressed, ProBuilder will auto-generate matching collision for the selected blocks. Sorry, not available in free version.", "Okay");
				}
				if(GUILayout.Button("Disable Collider", GUILayout.Width(position.width-6)))
				{
					EditorUtility.DisplayDialog("Disable Automatic Collision", "When pressed, ProBuilder will no longer auto-generate matching collision for the selected blocks. Sorry, not available in free version.", "Okay");
				}
				EditorGUILayout.Space();
				EditorGUILayout.LabelField("Vis Toggles");
				if(GUILayout.Button("Toggle NoDraw", GUILayout.Width(position.width-6)))
				{
					EditorUtility.DisplayDialog("Toggle NoDraw Visibility", "When pressed, ProBuilder will toggle the visibility of all 'NoDraw' faces. Sorry, not available in free version.", "Okay");
				}
				if(GUILayout.Button("Toggle Zones", GUILayout.Width(position.width-6)))
				{
					EditorUtility.DisplayDialog("Toggle 'Zone' Visibility", "When pressed, ProBuilder will toggle the visibility of all 'Occluder', 'Trigger', and 'Collision' faces. Sorry, not available in free version.", "Okay");
				}				
				
				EditorGUILayout.Space();
				
				//geometry
				EditorGUILayout.Space();
				EditorGUILayout.LabelField("Geometry");
				if(!editGeometryMode)
				{
					if(GUILayout.Button("Edit Selected", GUILayout.Width(position.width-6)))
					{
						EnterGeometryMode();
					}
				}
				else
				{
					if(GUILayout.Button("Done", GUILayout.Width(position.width-6)))
					{
						ExitGeometryMode();
					}
				}
				EditorGUILayout.Space();
				EditorGUILayout.LabelField("Texturing");
				if(GUILayout.Button("Edit Selected", GUILayout.Width(position.width-6)))
				{
					EditorUtility.DisplayDialog("Texturing and UV Control", "ProBuilder allows you to paint a different material on each and every face of a block. Then, use the UV Controls to adjust the offset, scale, and rotation of the texture. You can even flip, swap, and 'stretch to fill' a face's UVs! However, these features are only available in the paid version.", "Okay");
				}

				//End super-scroll
				EditorGUILayout.EndScrollView();
				//
			}			
        EditorGUILayout.EndVertical();
    }
	//
}	