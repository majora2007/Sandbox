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
		
			if ( emoState != null && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_LEFT)
			{
				translateLeft(emoState.CognitivGetCurrentActionPower() * modifier);
			} 
		} else {
			if (Input.GetKeyUp(debugKey)) {
				
				translateLeft(incomingPower * modifier);
				
			}
		}
	
	}
	
	private void translateLeft(float amount) {
		GameObject gObj = GameState.Instance.getSelectedObject();
				
		if (gObj != null) {
			gObj.transform.Translate(Vector3.left * amount, Camera.main.transform);
		}
	}
}
