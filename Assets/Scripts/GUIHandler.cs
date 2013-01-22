using UnityEngine;
using System.Collections;

public class GUIHandler : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnGUI() {
		
		GUI.Box (new Rect(10, 10, 110, 90), "Emotiv Controller");
		
		if (EmotivHandler.Instance != null && EmotivHandler.Instance.isConnected()) {
			if (GUI.Button(new Rect(25, 40, 80, 20), "Disconnect")) {
				EmotivHandler.Instance.disconnect();
			}
		} else {
			if (GUI.Button(new Rect(25, 40, 80, 20), "Connect")) {
				EmotivHandler.Instance.connect();
			}
		}

	}
}
