#pragma strict

private var hasWon : boolean = false;

function Update() {

}

function OnTriggerEntered(collision : Collision) {
	if (collision.gameObject.tag == "player") {
		hasWon = true;
	}
} 