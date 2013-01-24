#if UNITY_EDITOR
#pragma downcast
@script ExecuteInEditMode

var boxDensity : float = 1.0;
var boxVolume : float = 1.0;
var boxMass : float = 1.0;

var myID : int = 0;

var collisionBox : GameObject;
var collisionMesh : Mesh;
var colliderEnabled : boolean = false;

var topPlane : GameObject;
var bottomPlane : GameObject;
var leftPlane : GameObject;
var rightPlane : GameObject;
var frontPlane : GameObject;
var backPlane : GameObject;

var fh_top : GameObject;
var fh_bottom : GameObject;
var fh_left : GameObject;
var fh_right : GameObject;
var fh_front : GameObject;
var fh_back : GameObject;

var vh_BLBk : GameObject;
var vh_BLF : GameObject;
var vh_BRBk : GameObject;
var vh_BRF : GameObject;
var vh_TLBk : GameObject;
var vh_TLF : GameObject;
var vh_TRBk : GameObject;
var vh_TRF : GameObject;

var vertHandles = new GameObject[8]; 
var myPlanes = new GameObject[6];

var currentPosition : Vector3;
var moveDir : Vector3;
enum gridTypes {xz, xy, yz};
var gridType : gridTypes;
var gridSnapAmount : float;
var gridCenterPos : Vector3;
var gridLineColor : Color;
//

//
function Strip()
{
	for(var theVertHandle : GameObject in vertHandles)
	{
		DestroyImmediate(theVertHandle);
	}
	for(var thePlane : GameObject in myPlanes)
	{
		thePlane.hideFlags = 0;
		DestroyImmediate(thePlane.GetComponent(builder_Plane));
		if(thePlane.GetComponent(MeshRenderer).sharedMaterial.name == "NoDraw")
			DestroyImmediate(thePlane);
		else
			thePlane.active = true;
	}
	DestroyImmediate(this);
}
//

//
function AddPhysics()
{
	SetupBox();
	if(!gameObject.GetComponent(Rigidbody))
	{
		gameObject.AddComponent(Rigidbody);
	}
	boxVolume = VolumeOfMesh();
	boxMass = boxVolume*boxDensity;
	rigidbody.mass = boxMass;	
}
function RemovePhysics()
{
	SetupBox();
	if(gameObject.GetComponent(Rigidbody))
	{
		DestroyImmediate(gameObject.GetComponent(Rigidbody));
	}
}

//--

function EnterEditMode()
{
	SetupBox();
	//ReCenterPivot();
	
	
	for(var theVertHandle : GameObject in vertHandles)
	{
		theVertHandle.GetComponent(builder_VertHandle).Activate();
	}
	for(var thePlane : GameObject in myPlanes)
	{
		thePlane.GetComponent(builder_Plane).Activate();
	}
	//set hide flags
	var newHideFlags = HideFlags.NotEditable | HideFlags.HideInInspector;
	gameObject.hideFlags = newHideFlags;
	
	
}
function ExitEditMode()
{
	//ReCenterPivot();
	
	for(var theVertHandle : GameObject in vertHandles)
	{
		theVertHandle.GetComponent(builder_VertHandle).DeActivate();
	}
	for(var thePlane : GameObject in myPlanes)
	{
		thePlane.GetComponent(builder_Plane).DeActivate();
	}
	if(colliderEnabled)
		gameObject.GetComponent(MeshCollider).convex = true;
	
	//set hide flags
	//var newHideFlags = HideFlags.HideInInspector;
	gameObject.hideFlags = 0;
	
	//ReCenterPivot();
}

//--

//--

function ReCenterPivot()
{
	var centerPos : Vector3;
	centerPos = vh_BRF.transform.position;
	var startPos = new Vector3[vertHandles.length];
	var i : int = 0;
	
	//verts
	for(var theVertHandle : GameObject in vertHandles)
	{
		startPos[i] = theVertHandle.transform.position;
		i++;
	}
	
	//uvs
	for(var thePlane : GameObject in myPlanes)
	{
		thePlane.GetComponent(builder_Plane).SaveUVState();
	}
	
	//move the box
	transform.position = centerPos;
	
	//move all this box's vert handles back to their original positions, and update thier verts
	var o : int = 0;
	for(var theVertHandle : GameObject in vertHandles)
	{
		theVertHandle.transform.position = startPos[o];
		theVertHandle.GetComponent(builder_VertHandle).UpdateAttachedVerts();
		o++;
	}
	
	//uvs
	for(var thePlane : GameObject in myPlanes)
	{
		thePlane.GetComponent(builder_Plane).ReloadUVState();
	}
	
	//do the same for planes...
	//
	//and the same for the collision box.
	//
}

function ToggleNoDraw(hide : boolean)
{
	for(var thePlane : GameObject in myPlanes)
	{
		if(thePlane)
		{
			if(thePlane.renderer.sharedMaterial.name == "NoDraw") 
			{
				if(hide)
					thePlane.active = false;
				else
					thePlane.active = true;
			}
		}
		else
		{
			Debug.LogError(gameObject.name+" is missing one of it's faces- please delete the box and recreate it. Remember not to delete any ProBuilder sub-items!");
		}
	}
}
function ToggleZones(hide : boolean)
{
	for(var thePlane : GameObject in myPlanes)
	{
		if(thePlane)
		{
			if(thePlane.renderer.sharedMaterial.name == "Collider" || thePlane.renderer.sharedMaterial.name == "Trigger" || thePlane.renderer.sharedMaterial.name == "Occluder")
			{
				if(hide)
					thePlane.active = false;
				else
					thePlane.active = true;
			}
		}
		else
		{
			Debug.LogError(gameObject.name+" is missing one of it's faces- please delete the box and recreate it. Remember not to delete any ProBuilder sub-items!");
		}
	}
}

/*
function Optimize()
{
	for(var thePlane : GameObject in myPlanes)
	{
		if(thePlane)
		{
			if(thePlane.renderer.sharedMaterial.name == "NoDraw" || thePlane.renderer.sharedMaterial.name == "Collider" || thePlane.renderer.sharedMaterial.name == "Trigger" || thePlane.renderer.sharedMaterial.name == "Occluder")
			{
				thePlane.active = false;
			}
		}
		else
		{
			Debug.LogError(gameObject.name+" is missing one of it's faces- please delete the box and recreate it. Remember not to delete any ProBuilder sub-items!");
		}
	}
}

function DeOptimize()
{
	for(var thePlane : GameObject in myPlanes)
	{
		thePlane.active = true;
	}
}
*/

function SetupBox()
{
	if(myID != gameObject.GetInstanceID())
	{	
        CreateUniqueMeshes();

		collisionMesh = collisionBox.GetComponent(MeshFilter).sharedMesh;
		myID = gameObject.GetInstanceID();

		//plane setup
		for(thePlane in myPlanes)
		{
			thePlane.GetComponent(builder_Plane).Setup();
		}
		
		//vert handle setup
		for(theVertHandle in vertHandles)
		{
			theVertHandle.GetComponent(builder_VertHandle).Setup();
		}
		
		//set hide flags
		var baseHideFlags = HideFlags.NotEditable | HideFlags.HideInInspector | HideFlags.HideInHierarchy;
		collisionBox.hideFlags = baseHideFlags;
		
		ReCenterPivot();
	}
}

/*
 *    Make the meshes attached to this box unique, allowing the use
 *    of sharedMesh (Unity is doing this already when you call .mesh instead
 *    of .sharedMesh).
 */
function CreateUniqueMeshes()
{
    for(var t : Transform in gameObject.transform as Transform)
    {
        var mf : MeshFilter = t.gameObject.GetComponent(typeof(MeshFilter)) as MeshFilter;

        if(mf)
        {
            var m : Mesh = mf.sharedMesh;
            mf.sharedMesh = Mesh.Instantiate(m);
        }
    }
}

function EnableCollider()
{
	if(!colliderEnabled)
	{
		colliderEnabled = true;
		if(!gameObject.GetComponent(MeshCollider))
		{
			gameObject.AddComponent(MeshCollider);
			gameObject.GetComponent(MeshCollider).sharedMesh = collisionMesh;
			gameObject.GetComponent(MeshCollider).convex = true;
		}
		else
		{
			gameObject.GetComponent(MeshCollider).enabled = true;
			gameObject.GetComponent(MeshCollider).sharedMesh = collisionMesh;
			gameObject.GetComponent(MeshCollider).convex = true;
		}
	}	
}

function DisableCollider()
{
	if(colliderEnabled)
	{
		colliderEnabled = false;
		if(gameObject.GetComponent(MeshCollider))
		{
			gameObject.GetComponent(MeshCollider).enabled = false;
		}	
	}
}

function VolumeOfMesh()
{
	var meshVolume : float = 0;
	var meshVerts : Vector3[] = collisionMesh.vertices;
	var meshTris : int[] = collisionMesh.triangles;
	
	for(var i=0;i<collisionMesh.triangles.length; i+=3)
	{
		var vert1 : Vector3 = meshVerts[meshTris[i+0]];
		var vert2 : Vector3 = meshVerts[meshTris[i+1]];
		var vert3 : Vector3 = meshVerts[meshTris[i+2]];
		
		meshVolume += SignedVolumeOfTriangle(vert1, vert2, vert3);
	}
	
	return Mathf.Abs(meshVolume);
}

function SignedVolumeOfTriangle(p1 : Vector3, p2 : Vector3, p3 : Vector3)
{
	var v321 : float = p3.x * p2.y * p1.z;
	var v231 : float = p2.x * p3.y * p1.z;
	var v312 : float = p3.x * p1.y * p2.z;
	var v132 : float = p1.x * p3.y * p2.z;
	var v213 : float = p2.x * p1.y * p3.z;
	var v123 : float = p1.x * p2.y * p3.z;
	
	return (1.0f / 6.0f) * (-v321 + v231 + v312 - v132 - v213 + v123);
}