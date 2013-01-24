#if UNITY_EDITOR
#pragma strict
@script ExecuteInEditMode

//~
private var yoMomma : GameObject; //that's right. I went there. ;)
//~

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
		newHideFlags = HideFlags.NotEditable | HideFlags.HideInInspector | HideFlags.HideInHierarchy;
		gameObject.hideFlags = newHideFlags;
		gameObject.active = true;
	}
}