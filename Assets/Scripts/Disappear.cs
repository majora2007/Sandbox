using UnityEngine;
using Emotiv;
using System.Collections;

public class Disappear : MonoBehaviour {
	
	private bool disappear = false;
	public float sensitivity = 0.03f;
	
	
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
		if (!EmotivHandler.Instance.isConnected()) return;
		
			
		EmoState emoState = EmotivHandler.Instance.getCognitiveState();
		if (emoState == null) return;
		
		if (!disappear && emoState.CognitivGetCurrentAction() == EdkDll.EE_CognitivAction_t.COG_DISAPPEAR)
		{
			modulateAlpha(emoState);
		} 
		
		if (transform.renderer.material.color.a <= 0.0f) {
			disappear = true;
			transform.collider.enabled = false;
		} else {
			disappear = false;
			transform.collider.enabled = true;
		}
		
	}
	
	void modulateAlpha(EmoState emoState) {
		Color invisiColor = transform.renderer.material.color;
		
		float valueToBeLerped = emoState.CognitivGetCurrentActionPower();
		if (valueToBeLerped < 1) {
			valueToBeLerped += Time.deltaTime * sensitivity;
		} else if (valueToBeLerped > 1) {
			valueToBeLerped -= Time.deltaTime * sensitivity;
		}
		Debug.Log("Value to be Lerped: " + valueToBeLerped);
		float decrementAmt = Mathf.Lerp(255.0f, 0.0f, valueToBeLerped) * 0.01f;
		invisiColor.a -= decrementAmt;
		//invisiColor.a = decrementAmt;
		Debug.Log ("Decrement Amount: " + decrementAmt + "  Alpha: " + invisiColor.a);
		transform.renderer.material.color = invisiColor;
	}
}
