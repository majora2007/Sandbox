#if UNITY_EDITOR
#pragma strict
//@script ExecuteInEditMode

var myID : int = 0;

var isSelected : boolean = false;
var isActive : boolean = false;

var collisionBox : Transform;
var collisionMesh : Mesh;
var collisionMeshVIDs = new int[3];

var acrossPlaneMesh : Mesh;
var rightPlaneMesh : Mesh;
var leftPlaneMesh : Mesh;

var acrossPlane : GameObject;
var rightPlane : GameObject;
var leftPlane : GameObject;

var acrossPlaneVID : int;
var rightPlaneVID : int;
var leftPlaneVID : int;

var currentPosition : Vector3;

private var selectedVerts = new Vector3[4];

function OnDrawGizmos()
{
	if(isActive)
	{
		if(isSelected)
		{
			Gizmos.DrawIcon(transform.position, "6by7/VertOn.tga", false);
			if(gameObject == Selection.activeGameObject)
			{
				//position label
				Handles.Label(transform.position,transform.position.ToString());
			}			
		}
		else
		{
			Gizmos.DrawIcon(transform.position, "6by7/VertOff.tga", false);
		}
	}
}

function Setup()
{
	//collisionMesh = transform.parent.GetComponent(builder_Box).collisionMesh;
	
	acrossPlaneMesh = acrossPlane.GetComponent(builder_Plane).myMesh;
	rightPlaneMesh = rightPlane.GetComponent(builder_Plane).myMesh;
	leftPlaneMesh = leftPlane.GetComponent(builder_Plane).myMesh;
	collisionMesh = transform.parent.GetComponent(builder_Box).collisionMesh;
	
	isActive = false;
	isSelected = false;
	
	DeActivate();
	
	myID = gameObject.GetInstanceID();
	
	AutoVID();
}

function Activate()
{
	isActive = true;
	isSelected = false;
	
	gameObject.active = true;
	
	//set hide flags
	var baseHideFlags = HideFlags.HideInInspector;
	gameObject.hideFlags = baseHideFlags;
	
	UpdateAttachedVerts();
}

function DeActivate()
{
	isActive = false;
	isSelected = false;
	gameObject.active = false;
	
	//set hide flags
	var baseHideFlags = HideFlags.NotEditable | HideFlags.HideInInspector | HideFlags.HideInHierarchy;
	gameObject.hideFlags = baseHideFlags;
}

function UpdateAttachedVerts() 
{
	//Debug.Log("eh?");
	currentPosition = transform.position;
	if(collisionMesh)
	{
		selectedVerts = collisionMesh.vertices;
		for(var i : int in collisionMeshVIDs)
		{
			selectedVerts[i] = collisionBox.InverseTransformPoint(transform.position);
		}
		collisionMesh.vertices = selectedVerts;
		collisionMesh.RecalculateBounds();
	}
	
	selectedVerts = acrossPlaneMesh.vertices;
	selectedVerts[acrossPlaneVID] = acrossPlane.transform.InverseTransformPoint(transform.position);
	acrossPlaneMesh.vertices = selectedVerts;
	acrossPlaneMesh.RecalculateBounds();
	acrossPlane.GetComponent(builder_Plane).UVW_Flatten();
	
	selectedVerts = rightPlaneMesh.vertices;
	selectedVerts[rightPlaneVID] = rightPlane.transform.InverseTransformPoint(transform.position);
	rightPlaneMesh.vertices = selectedVerts;
	rightPlaneMesh.RecalculateBounds();
	rightPlane.GetComponent(builder_Plane).UVW_Flatten();
	
	selectedVerts = leftPlaneMesh.vertices;
	selectedVerts[leftPlaneVID] = leftPlane.transform.InverseTransformPoint(transform.position);
	leftPlaneMesh.vertices = selectedVerts;
	leftPlaneMesh.RecalculateBounds();
	leftPlane.GetComponent(builder_Plane).UVW_Flatten();
}

function DeSelect()
{
	UpdateAttachedVerts();
	isSelected = false;
}

function Select()
{
	UpdateAttachedVerts();
	isSelected = true;
}

function WorldSpaceToMeshSpace(vert : Transform, plane : Transform)
{
	var rotatedPos = plane.rotation*vert.position*-1;
	var offsetPos = rotatedPos-plane.position;
	return(offsetPos);
}

function VisToggle(bitBoolean : int)
{
	if(bitBoolean == 0)
	{
		DeActivate();
	}
	else
	{
		DeActivate();
	}
}

function AutoVID()
{
	var i : int = 0;

	i = 0;
	var acrossVerts = acrossPlaneMesh.vertices;
	for(var theVert : Vector3 in acrossVerts)
	{
		if(acrossPlane.transform.TransformPoint(theVert) == transform.position)
			acrossPlaneVID = i;
		i++;
	}
	
	i = 0;
	var leftVerts = leftPlaneMesh.vertices;
	for(var theVert : Vector3 in leftVerts)
	{
		if(leftPlane.transform.TransformPoint(theVert) == transform.position)
			leftPlaneVID = i;
		i++;
	}
	
	i = 0;
	var rightVerts = rightPlaneMesh.vertices;
	for(var theVert : Vector3 in rightVerts)
	{
		if(rightPlane.transform.TransformPoint(theVert) == transform.position)
			rightPlaneVID = i;
		i++;
	}
}