using UnityEngine;
using Emotiv;
using System.Collections;

public class CognitivLeft : MonoBehaviour {
	
	public float incomingPower = 0.0f;
	public float modifier = 0.1f;
	
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
				float leftAmount = emoState.CognitivGetCurrentActionPower() * 0.1f;
				Ray lookAtRay = Camera.main.ScreenPointToRay(Input.mousePosition);
				
				GameObject gObj = GameState.Instance.getSelectedObject();
				if (gObj != null) {
					Vector3 position = new Vector3(gObj.transform.localPosition.x - leftAmount, gObj.transform.localPosition.y, gObj.transform.localPosition.z);
					gObj.transform.localPosition = position;
				}
			} 
		} else {
			if (Input.GetKeyUp("p")) {
				
				float pushAmount = incomingPower * modifier;
				Ray lookAtRay = Camera.main.ScreenPointToRay(Input.mousePosition);
				GameObject gObj = GameState.Instance.getSelectedObject();
				if (gObj != null) {
					gObj.rigidbody.AddForce(lookAtRay.direction * pushAmount, ForceMode.Impulse);
				}
				
			}
		}
	
	}
}