using UnityEngine;
using Emotiv;
using System.Collections;

public class CognitivRight : MonoBehaviour {

	public float incomingPower = 0.0f;
	public float modifier = 0.1f;
	public string debugKey;
	
	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
		if (EmotivHandler.Instance.isConnected()) {
			EmoState emoState = EmotivHandler.Instance.getCognitiveState();
		
			if ( emoState != null && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_PUSH)
			{
				// Handle lift
				float amount = emoState.CognitivGetCurrentActionPower() * modifier;
				
				GameObject gObj = GameState.Instance.getSelectedObject();
				if (gObj != null) {
					gObj.transform.Translate(Vector3.left * amount, Camera.main.transform);
				}
			} 
		} else {
			if (Input.GetKeyUp(debugKey)) {
				
				float amount = incomingPower * modifier;
				GameObject gObj = GameState.Instance.getSelectedObject();
				
				if (gObj != null) {
					gObj.transform.Translate(Vector3.right * amount, Camera.main.transform);
				}
				
			}
		}
	
	}
}
