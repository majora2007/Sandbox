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
		
			if ( emoState != null && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_RIGHT)
			{
				translateRight(emoState.CognitivGetCurrentActionPower() * modifier);
			} 
		} else {
			if (Input.GetKeyUp(debugKey)) {
				
				translateRight(incomingPower * modifier);
			}
		}
	
	}
	
	private void translateRight(float amount) {
		GameObject gObj = GameState.Instance.getSelectedObject();
				
		if (gObj != null) {
			gObj.transform.Translate(Vector3.right * amount, Camera.main.transform);
		}
	}
}
