using UnityEngine;
using System.Collections;

public class InputHandler : MonoBehaviour {
	
	private GameObject parent;
	
	// Use this for initialization
	void Start () {
		parent = this.gameObject;
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
