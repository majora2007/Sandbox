#if UNITY_EDITOR
#pragma strict
@script ExecuteInEditMode

var myID : int = 0;
var isActive : boolean = false;
var isSelected : boolean = false;

var myMesh : Mesh;
var tileUVs : boolean = true;

var UVW_TopBottom : boolean = false;
var UVW_LeftRight : boolean = false;
var UVW_FrontBack : boolean = false;

var textureOffset : Vector3;
var textureRotation : float = 0;
var textureScale = Vector3(1.0,1.0,1.0);

var myVertHandles = new GameObject[4];
var myFillUVs = new Vector2[4];

var holdPosition : Vector3;

var uvSettings : UVSettings = new UVSettings();

private var pivot_savedUVs = new Vector2[4];

function Activate()
{
	//dev
	//transform.rotation = Quaternion.identity;
	/*
	if(showVerts)
	{
		for(theVertHandle in myVertHandles)
		{
			theVertHandle.GetComponent(builder_VertHandle).UpdateAttachedVerts();
		}
	}
	*/
	//myMesh.RecalculateNormals();
	//
	
	//for click-painting: must also enable a collider!
	if(!gameObject.GetComponent(MeshCollider))
		gameObject.AddComponent(MeshCollider);
	
	holdPosition = transform.position;
	isActive = true;
	gameObject.hideFlags = 0;
}

function DeActivate()
{
	//GenerateLightMapUVs();
	isActive = false;
	
	//set hide flags
	var baseHideFlags = HideFlags.NotEditable | HideFlags.HideInInspector;
	gameObject.hideFlags = baseHideFlags;
	
	//remove the collider added on activate
	if(gameObject.GetComponent(MeshCollider))
		DestroyImmediate(gameObject.GetComponent(MeshCollider));
}

function Setup()
{	
	myMesh = gameObject.GetComponent(MeshFilter).sharedMesh;
	// Debug.Log(gameObject.name+": Mesh Assigned. (Please ignore the above mesh error)");
	isActive = false;
	isSelected = false;	
	//set hide flags
	var baseHideFlags = HideFlags.NotEditable | HideFlags.HideInInspector;
	gameObject.hideFlags = baseHideFlags;
	//set static flags
	var matName = gameObject.renderer.sharedMaterial.name;
	gameObject.isStatic = false;
	var baseFlags = StaticEditorFlags.BatchingStatic | StaticEditorFlags.LightmapStatic | StaticEditorFlags.OccludeeStatic;
	GameObjectUtility.SetStaticEditorFlags(gameObject, baseFlags);
	if(matName == "Collider" || matName == "NoDraw" || matName == "Trigger")
	{
		gameObject.isStatic = false;
	}
	else if(matName == "Occluder")
	{
		gameObject.isStatic = false;
		var newFlags = StaticEditorFlags.OccluderStatic;
		GameObjectUtility.SetStaticEditorFlags(gameObject, newFlags);
	}
	
	myID = gameObject.GetInstanceID();

	UVW_Flatten();
}

function ActivateColliderMode()
{
	renderer.material = Resources.LoadAssetAtPath("Assets/6by7/ProBuilder/Materials/Collider.mat", typeof(Material)) as Material;
}

function UpdateUVPosition(newtextureOffset : Vector3)
{
	textureOffset = newtextureOffset;
	UVW_Flatten();
}

function UpdateUVScale(newTextureScale : Vector3)
{
	textureScale = newTextureScale;
	UVW_Flatten();
}

function UpdateUVRotation(newTextureRotation : float)
{
	textureRotation = newTextureRotation;
	UVW_Flatten();
}

function UVW_Flatten()
{
	// use only UV class calls
	UV.UpdateUVs(gameObject, uvSettings);

	return;
/*
	var meshVerts = myMesh.vertices;
	var width : float;
	var length : float;
	
	if(UVW_TopBottom)
	{
		//calc texture fill stretching
		if(!tileUVs)
		{
			// maybe useful in future, not working as needed for now
			// width = (meshVerts[0]-meshVerts[1]).magnitude;
			// length = (meshVerts[0]-meshVerts[2]).magnitude;
			// textureScale.x = 1f/width;
			// textureScale.z = 1f/length;

			var stretchedUVs_TB : Vector2[] = new Vector2[4];
			for(var tb=0;tb<4;tb++)
			{
				stretchedUVs_TB[tb] = Vector2(myFillUVs[tb].x+textureOffset.x, myFillUVs[tb].y+textureOffset.z);
				stretchedUVs_TB[tb] = UV.RotateUVs(stretchedUVs_TB[tb], textureRotation);
			}
			myMesh.uv = stretchedUVs_TB;
		}
		else
		{
			//flatten top-bottom uvs
			var uvs_TopAndBottom : Vector2[] = new Vector2[4];
			for (var i = 0 ; i < 4; i++)
			{
				uvs_TopAndBottom[i] = Vector2 ((meshVerts[i].x+textureOffset.x+.5)*textureScale.x, (meshVerts[i].z+textureOffset.z+.5)*textureScale.z);
				uvs_TopAndBottom[i] = UV.RotateUVs(uvs_TopAndBottom[i], textureRotation);
			}
			myMesh.uv = uvs_TopAndBottom;
			//
		}		
	}
	else if(UVW_LeftRight)
	{
		//calc texture fill stretching
		if(!tileUVs)
		{
			// maybe useful in future, not working as needed for now
			// width = (meshVerts[3]-meshVerts[2]).magnitude;
			// length = (meshVerts[0]-meshVerts[2]).magnitude;
			// textureScale.z = 1f/width;
			// textureScale.y = 1f/length;
			
			var stretchedUVs_LR : Vector2[] = new Vector2[4];
			for(var lr=0;lr<4;lr++)
			{
				stretchedUVs_LR[lr] = Vector2(myFillUVs[lr].x+textureOffset.x, myFillUVs[lr].y+textureOffset.y);
				stretchedUVs_LR[lr] = UV.RotateUVs(stretchedUVs_LR[lr], textureRotation);
			}
			myMesh.uv = stretchedUVs_LR;
		}
		else
		{
			//flatten left-right uvs
			var uvs_LeftAndRight : Vector2[] = new Vector2[4];
			for (var o = 0 ; o < 4; o++)
			{
				uvs_LeftAndRight[o] = Vector2 ((meshVerts[o].y+textureOffset.y+.5)*textureScale.y, (meshVerts[o].z+textureOffset.z+.5)*textureScale.z);
				uvs_LeftAndRight[o] = UV.RotateUVs(uvs_LeftAndRight[o], textureRotation);
			}
			myMesh.uv = uvs_LeftAndRight;
			//
		}
	}
	else
	{	
		//calc texture fill stretching
		if(!tileUVs)
		{	
			// maybe useful in future, not working as needed for now
			// width = (meshVerts[0]-meshVerts[1]).magnitude;
			// length = (meshVerts[0]-meshVerts[2]).magnitude;
			// textureScale.x = 1f/width;
			// textureScale.y = 1f/length;

			var stretchedUVs_FB : Vector2[] = new Vector2[4];
			for(var fb=0;fb<4;fb++)
			{
				stretchedUVs_FB[fb] = Vector2(myFillUVs[fb].x+textureOffset.x, myFillUVs[fb].y+textureOffset.y);
				stretchedUVs_FB[fb] = UV.RotateUVs(stretchedUVs_FB[fb], textureRotation);
			}
			myMesh.uv = stretchedUVs_FB;
		}
		else
		{
			//flatten front-back uvs
			var uvs_FrontAndBack : Vector2[] = new Vector2[4];
			for (var p = 0 ; p < 4; p++)
			{
				uvs_FrontAndBack[p] = Vector2 ((meshVerts[p].y+textureOffset.y+.5)*textureScale.y, (meshVerts[p].x+textureOffset.x+.5)*textureScale.x);
				uvs_FrontAndBack[p] = UV.RotateUVs(uvs_FrontAndBack[p], textureRotation);
			}
			myMesh.uv = uvs_FrontAndBack;
			//
		}
	}
	myMesh.RecalculateNormals();
*/
}

// function RotateUVs(originalUVRotation : Vector2, angleChange : float)
// {
// 	var c : float = Mathf.Cos(angleChange*Mathf.Deg2Rad);
// 	var s : float = Mathf.Sin(angleChange*Mathf.Deg2Rad);
// 	var finalUVRotation : Vector2 = Vector2(originalUVRotation.x*c - originalUVRotation.y*s, originalUVRotation.x*s + originalUVRotation.y*c);
// 	return(finalUVRotation);
// }

function ApplymyFillUVs()
{
	myMesh.uv = myFillUVs;
}

// function GenerateLightMapUVs()
// {
// 	var vertices : Vector3[]  = myMesh.vertices;
//     var uvs : Vector2[] = new Vector2[vertices.Length];
// 	//calculate the lightmapped uvs
// 	if(UVW_TopBottom)
// 	{
// 		for (var i = 0 ; i < uvs.Length; i++)
// 			uvs[i] = Vector2 (vertices[i].x, vertices[i].z);
// 	}
// 	else if(UVW_LeftRight)
// 	{
// 		for (var o = 0 ; o < uvs.Length; o++)
// 			uvs[o] = Vector2 (vertices[o].y, vertices[o].z);
// 	}
// 	else
// 	{	
// 		for (var p = 0 ; p < uvs.Length; p++)
// 			uvs[p] = Vector2 (vertices[p].x, vertices[p].y);
// 	}
// 	//set the lightmapped uvs
// 	myMesh.uv2 = uvs;
// }

function VisToggle(bitBoolean : int)
{
	var newHideFlags = 0;
	if(bitBoolean == 0)
	{
		//set hide flags
		newHideFlags = HideFlags.NotEditable | HideFlags.HideInInspector | HideFlags.HideInHierarchy;
		gameObject.hideFlags = newHideFlags;
		gameObject.active = false;		
	}
	else
	{
		//set hide flags
		newHideFlags = HideFlags.NotEditable | HideFlags.HideInInspector;
		gameObject.hideFlags = newHideFlags;
		gameObject.active = true;
	}
}

function SaveUVState()
{
	pivot_savedUVs = myMesh.uv;
}
function ReloadUVState()
{
	myMesh.uv = pivot_savedUVs;
}