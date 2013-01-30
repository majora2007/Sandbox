using UnityEngine;
using Emotiv;
using System.Collections;

public class CognitivPush : MonoBehaviour {
	
	public float incomingPower = 0.0f;
	public float modifier = 0.1f;
	public string debugKey;
	
	private Ray lookAtRay;
	
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (EmotivHandler.Instance.isConnected()) {
			EmoState emoState = EmotivHandler.Instance.getCognitiveState();
		
			if ( emoState != null && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_PUSH) {
				push(emoState.CognitivGetCurrentActionPower() * modifier);
			} 
		} else {
			if (Input.GetKeyUp(debugKey)) {
				push(incomingPower * modifier);
			}
		}
	
	}
	
	private void push(float amount) {
		lookAtRay = Camera.main.ScreenPointToRay(Input.mousePosition);
		GameObject gObj = GameState.Instance.getSelectedObject();
		
		if (gObj != null && gObj.rigidbody != null) {
			gObj.rigidbody.AddForce(lookAtRay.direction * amount, ForceMode.Impulse);
		}
	}
}
