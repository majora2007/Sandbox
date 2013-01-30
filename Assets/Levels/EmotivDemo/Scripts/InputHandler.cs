using UnityEngine;
using System.Collections;

public class InputHandler : MonoBehaviour {
	
	public string cognitivLiftKey;
	public string cogntivPushKey;
	public string cognitivDisappearKey;
	public string cognitivLeftKey;
	//public string playerProfileKey;
	
	
	// Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
		
		if (Input.GetKeyDown("escape")) {
			if (!GameState.Instance.isPaused()) {
				GameEventManager.TriggerPause();
			} else {
				GameEventManager.TriggerUnpause();
			}
			
		}
	}
}
