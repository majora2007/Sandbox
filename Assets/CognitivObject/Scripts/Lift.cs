using UnityEngine;
using Emotiv;
using System.Collections;

public class Lift : MonoBehaviour {
	
	public float incomingPower = 0.0f;
	private static float modifier = 0.1f;
	
	// Use this for initialization
	void Start () {
	
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
					gObj.transform.Translate(new Vector3(0.0f, transform.position.y + liftAmount * Time.deltaTime, 0.0f));
				}
				
			} 
		} else {
			if (Input.GetKeyUp("l")) {
				
				GameObject gObj = GameState.Instance.getSelectedObject();
				
				if (gObj != null) {
					float liftAmount = incomingPower * modifier;
					gObj.transform.Translate(new Vector3(0.0f, transform.position.y + liftAmount * Time.deltaTime, 0.0f));
				}
			}
		}
	}
}
