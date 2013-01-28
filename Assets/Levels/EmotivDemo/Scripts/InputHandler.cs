using UnityEngine;
using System.Collections;

public class InputHandler : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyUp("g")) {
			if (!GameState.Instance.isPaused()) {
				Time.timeScale = 0;
				GameState.Instance.setPaused(true);
				Screen.showCursor = true;
			} else {
				Time.timeScale = 1;
				GameState.Instance.setPaused(false);
				Screen.showCursor = false;
			}
		}
	}
}
