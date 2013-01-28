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
				GameObject gObj = GameState.Instance.getSelectedObject();
				
				if (gObj != null) {
					float liftAmount = emoState.CognitivGetCurrentActionPower() * modifier;
					gObj.transform.Translate(Vector3.up * liftAmount);
				}
				
			} 
		} else {
			if (Input.GetKeyUp(liftKey)) {
				GameObject gObj = GameState.Instance.getSelectedObject();
				
				if (gObj != null) {
					float liftAmount = incomingPower * modifier;
					
					gObj.transform.Translate(Vector3.up * liftAmount);
					
				}
			}
		}
		
	}
}
