using UnityEngine;
using System.Collections;

public class PlayerProfileGUI : MonoBehaviour {
	
	public bool isVisible = true;
	private float startX, startY;
	
	private string tempName = string.Empty;
	
	// Use this for initialization
	void Start () {
		startX = Screen.width * 0.5f;
		startY = Screen.height * 0.5f;
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyUp("p")) {
			isVisible = !isVisible;
		}
	}
	
	void OnGUI() {
		
		if (!isVisible) return;
		
		GUI.Box (new Rect(startX, startY, 200, 200), "Player Profile");
		
		
		GUI.Label(new Rect(startX + 25, startY + 40, 80, 20), "Name:");
		if (GameState.Instance.getCurrentPlayer() == null) {
			tempName = GUI.TextField(new Rect(startX + 85, startY + 40, 60, 20), tempName);
		} else {
			tempName = GUI.TextField(new Rect(startX + 85, startY + 40, 60, 20), GameState.Instance.getCurrentPlayer().UserName);
		}
		
			
		if (GUI.Button(new Rect(startX + 80, startY + 80, 80, 20), "Create Account")) {
			Player p = new Player();
			p.UserName = tempName;
			GameState.Instance.setCurrentPlayer(p);
		}
		
		if (GUI.Button(new Rect(startX + 40, startY + 80, 40, 20), "Close")) {
			isVisible = !isVisible;
		}
	}
}
