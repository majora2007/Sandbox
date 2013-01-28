using UnityEngine;
using System.Collections;

public class InputHandler : MonoBehaviour {
	
	public string cognitivLiftKey;
	public string cogntivPushKey;
	public string cognitivDisappearKey;
	public string cognitivLeftKey;
	
	//private GameObject parent;
	
	
	// Use this for initialization
	void Start () {
		//parent = this.gameObject;
		
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
