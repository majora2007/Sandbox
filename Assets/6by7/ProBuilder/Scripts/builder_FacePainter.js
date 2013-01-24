#if UNITY_EDITOR
//Paints faces on right click
var readyMaterial : Material;

function PaintFace(facePlane : GameObject)
{
	if(readyMaterial)
	{
		//undo
		Undo.RegisterUndo(facePlane.renderer, "Paint "+facePlane.name);
		//
		facePlane.renderer.material = readyMaterial;
		var matName = readyMaterial.name;
		//set static flags
		facePlane.isStatic = false;
		var baseFlags = StaticEditorFlags.BatchingStatic | StaticEditorFlags.LightmapStatic | StaticEditorFlags.OccludeeStatic;
		GameObjectUtility.SetStaticEditorFlags(facePlane, baseFlags);
		if(matName == "Collider" || matName == "Trigger")
		{
			facePlane.isStatic = false;
		}
		else if(matName == "NoDraw")
		{
			facePlane.isStatic = false;
			var noDrawFlags = StaticEditorFlags.LightmapStatic;
			GameObjectUtility.SetStaticEditorFlags(facePlane, noDrawFlags);
		}
		else if(matName == "Occluder")
		{
			facePlane.isStatic = false;
			var occluderFlags = StaticEditorFlags.OccluderStatic;
			GameObjectUtility.SetStaticEditorFlags(facePlane, occluderFlags);
		}
		//
	}
}

function CopyFace(sourceFace : GameObject, destinationFace : GameObject)
{
	//copy all settings+material from selected face to clicked face
}

function OffsetTextureToFace(sourceFace : GameObject, destinationFace : GameObject)
{
	//copy all settings+material from selected face to clicked face...
	//then, for the magic, offset the texture just right so that it "continues" the selected face!
	//to keep the magic flowing, then select the clicked face, so that clicking on yet another face will continue the flow...
	//**this just needs to be an offset of the source- ie, apply all settings, then move left by (sourceFaceLength*tiling)
	//**will need to check if up/down/left/right
	//**complex math to figure the length, since it will not be distance (hypotenuse), as the textures stretch over diagonals...
	//**the above "stretching" issue is a major one, actually! solve that before this, and then complex math will not be needed :)
}