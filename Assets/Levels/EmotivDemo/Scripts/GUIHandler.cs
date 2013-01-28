using UnityEngine;
using System.Collections;

public class GUIHandler : MonoBehaviour {
	

	// Use this for initialization
	void Start () {
		GameEventManager.PauseEvent += pauseGame;
		GameEventManager.UnpauseEvent += unpauseGame;
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
		
		GUI.Box(new Rect(Screen.width - 210, 0, 210, 20), "Selected Object:");
		
		if (GameState.Instance.getSelectedObject() != null) {
			GUI.Label(new Rect(Screen.width - 35, 0, 60, 20), GameState.Instance.getSelectedObject().name);
		} else {
			GUI.Label(new Rect(Screen.width - 35, 0, 60, 20), "none");
		}

	}
	
	void pauseGame() {
		Time.timeScale = 0;
		GameState.Instance.setPaused(true);
		//Screen.lockCursor = false;
		//Screen.showCursor = true;
	}
	
	void unpauseGame() {
		Time.timeScale = 1;
		GameState.Instance.setPaused(false);
		//Screen.lockCursor = true;
		//Screen.showCursor = false;
	}
}
