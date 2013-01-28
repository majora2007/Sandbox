using UnityEngine;
using Emotiv;
using System.Collections;

public class CognitivLift : MonoBehaviour {
	
	public float incomingPower = 0.0f;
	public float modifier = 0.1f;
	
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
					float liftAmount = emoState.CognitivGetCurrentActionPower() * 0.1f;
					gObj.transform.Translate(new Vector3(0.0f, gObj.transform.position.y + liftAmount * Time.deltaTime, 0.0f));
				}
				
			} 
		} else {
			if (Input.GetKeyUp("1")) {
				GameObject gObj = GameState.Instance.getSelectedObject();
				
				if (gObj != null) {
					float liftAmount = incomingPower * modifier;

					gObj.transform.Translate(new Vector3(0.0f, gObj.transform.position.y + liftAmount, 0.0f));
				}
			}
		}
		
	}
}
