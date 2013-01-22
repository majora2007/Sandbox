#pragma strict

function Start () {

}

function Update () {

}

function OnControllerColliderHit(hit : ControllerColliderHit) {
	
	Debug.Log("Button pressed by " + hit.gameObject.name);
	
	if (hit.gameObject.tag == "CognitivObject") {
		// Handle button pressed
		
	}
}
