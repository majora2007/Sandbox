using UnityEngine;
using Emotiv;
using System.Collections;

public class CognitivLeft : MonoBehaviour {
	
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
				float leftAmount = emoState.CognitivGetCurrentActionPower() * modifier;
				
				GameObject gObj = GameState.Instance.getSelectedObject();
				if (gObj != null) {
					gObj.transform.Translate(Vector3.left * leftAmount, Camera.main.transform);
				}
			} 
		} else {
			if (Input.GetKeyUp(debugKey)) {
				
				float leftAmount = incomingPower * modifier;
				GameObject gObj = GameState.Instance.getSelectedObject();
				
				if (gObj != null) {
					gObj.transform.Translate(Vector3.left * leftAmount, Camera.main.transform);
				}
				
			}
		}
	
	}
}
