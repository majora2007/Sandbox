#pragma strict

var animationRoot : GameObject;

function Start () {

}

function Update () {

}

function OnCollisionEnter(hit : Collision) {
	
	Debug.Log("Button pressed by " + hit.gameObject.name);
	
	if (hit) {
		animationRoot.animation.Play("button_down");
	} else {
		animationRoot.animation.Play("button_up");
	}
	
	if (hit.gameObject.tag == "CognitivObject") {
		// Handle button pressed
		
		var door : GameObject = GameObject.Find("door");
		yield WaitForSeconds(1);
		door.animation.Play("door_open");
		
		
		
	}
}
