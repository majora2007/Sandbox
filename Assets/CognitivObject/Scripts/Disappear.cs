using UnityEngine;
using Emotiv;
using System.Collections;

public class Disappear : MonoBehaviour {
	
	
	public float sensitivity = 0.03f;
	
	private static float modifier = 0.1f;
	
	private bool disappear = false;
	private float currentTime;
	

	void Update () {
		
		if (!EmotivHandler.Instance.isConnected()) return;
		
		if (disappear) return;
		
		/*if (disappear) {
			if (currentTime <= Time.time) {
				Debug.Log("Times up!");
				if (transform.renderer.material.color.a < 1.0f) {
					modulateAlpha(10.0f);
					disappear = false;
				}
				
			}
		} else {*/
			EmoState emoState = EmotivHandler.Instance.getCognitiveState();
			if (emoState == null) return;
			
			if (!disappear && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_DISAPPEAR)
			{
				modulateAlpha(emoState.CognitivGetCurrentActionPower());
			} 
			
			if (transform.renderer.material.color.a <= 0.0f) {
				disappear = true;
				transform.collider.enabled = false;
				
				// Start a 1 sec time until alpha is faded back to original state
				currentTime = Time.time + 1.0f;
			} else {
				disappear = false;
				transform.collider.enabled = true;
			}
		//}
			
		
		
	}
	
	void modulateAlpha(float amount) {
		Color invisiColor = transform.renderer.material.color;
		
		float valueToBeLerped = amount * modifier;
		Debug.Log("Value to be Lerped: " + valueToBeLerped);
		
		float decrementAmt = Mathf.Lerp(1.0f, 0.0f, valueToBeLerped);
		
		invisiColor.a -= decrementAmt * Time.deltaTime;
		transform.renderer.material.color = invisiColor;
	}
}
