using UnityEngine;
using Emotiv;
using System.Collections;

public class CognitivLift : MonoBehaviour {
	
	public float incomingPower = 0.0f;
	public float modifier = 0.1f;
	public string liftKey;
	
	void Start() {	
	}
	
	// Update is called once per frame
	void Update () {
		
		if (EmotivHandler.Instance.isConnected()) {
			EmoState emoState = EmotivHandler.Instance.getCognitiveState();
		
			if ( emoState != null && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_LIFT)
			{
				lift(emoState.CognitivGetCurrentActionPower() * modifier);
			} 
		} else {
			if (Input.GetKeyUp(liftKey)) {
				lift(incomingPower * modifier);
			}
		}
		
	}
	
	void lift(float amount) {
		GameObject gObj = GameState.Instance.getSelectedObject();
		
		if (gObj != null) {
			gObj.transform.Translate(Vector3.up * amount);
		}
	}
}
