using UnityEngine;
using Emotiv;
using System.Collections;

public class Disappear : MonoBehaviour {
	
	
	public float sensitivity = 0.03f;
	
	private static float modifier = 0.1f;
	
	private bool disappear = false;
	//private float currentTime;
	

	void Update () {
		
		if (!EmotivHandler.Instance.isConnected()) return;
		
		if (disappear) return;
		

		EmoState emoState = EmotivHandler.Instance.getCognitiveState();
		if (emoState == null) return;
		
		GameObject gObj = GameState.Instance.getSelectedObject();
				
		if (gObj = null) return;
		
		if (!disappear && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_DISAPPEAR)
		{
			modulateAlpha(gObj, emoState.CognitivGetCurrentActionPower());
		} 
		
		if (transform.renderer.material.color.a <= 0.0f) {
			disappear = true;
			gObj.transform.collider.enabled = false;
			
			// Start a 1 sec time until alpha is faded back to original state
			//currentTime = Time.time + 1.0f;
		} else {
			disappear = false;
			gObj.transform.collider.enabled = true;
		}

			
		
		
	}
	
	void modulateAlpha(GameObject gObj, float amount) {
		Color invisiColor = gObj.transform.renderer.material.color;
		
		float valueToBeLerped = amount * modifier;
		Debug.Log("Value to be Lerped: " + valueToBeLerped);
		
		float decrementAmt = Mathf.Lerp(1.0f, 0.0f, valueToBeLerped);
		
		invisiColor.a -= decrementAmt * Time.deltaTime;
		gObj.transform.renderer.material.color = invisiColor;
	}
}
