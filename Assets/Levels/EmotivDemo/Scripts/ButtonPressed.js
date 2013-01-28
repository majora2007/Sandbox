#pragma strict

var animationRoot : GameObject;

private var buttonDown : boolean = false;

function Start () {

}

function Update () {

}

function OnCollisionEnter(hit : Collision) {
	
	Debug.Log("Button pressed by " + hit.gameObject.name);
	
	if (hit) {
		animationRoot.animation.Play("button_down");
		buttonDown = true;
	}
	
	if (hit.gameObject.tag == "CognitivObject") {
		// Handle button pressed
		
		var door : GameObject = GameObject.Find("door");
		yield WaitForSeconds(1);
		door.animation.Play("door_open");
		
	}
}

// While button is pressed in down state, have light emit from button
function OnCollisionStay(hit : Collision) {
	buttonDown = true;
	
	// TODO: Light emit code goes here
}

function OnCollisionExit(hit : Collision) {
	buttonDown = false;
	
	animationRoot.animation.Play("button_up");
}