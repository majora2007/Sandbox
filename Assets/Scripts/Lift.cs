using UnityEngine;
using Emotiv;
using System.Collections;

public class Lift : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		
		if (EmotivHandler.Instance.isConnected()) {
			EmoState emoState = EmotivHandler.Instance.getCognitiveState();
		
			if ( emoState != null && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_LIFT)
			{
				// Handle lift
				float liftAmount = emoState.CognitivGetCurrentActionPower() * 0.01f;
				
				transform.Translate(new Vector3(0.0f, transform.position.y + liftAmount, 0.0f));
				
			} 
		} else {
			if (Input.GetKeyUp("r")) {
				transform.Translate(new Vector3(0.0f, transform.position.y + 0.1f, 0.0f));
			}
		}
		
			
		
		
		
		
		
	
	}
}
