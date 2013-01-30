using UnityEngine;
using System.Collections;

public class GameState {
	
	private static volatile GameState instance;
	private static object _lock = new object();
	
	private bool paused = false;
	private GameObject selectedObject;
	private Player currentPlayer;
	
	
	static GameState() {}
	private GameState() {}
	
	public static GameState Instance
	{
		get
		{
			if (instance == null) {
				
				lock (_lock) {
					if (instance == null) {
						instance = new GameState();
					}
				}
			}
			
			return instance;
		}
	}
	
	public bool isPaused() {
		return paused;
	}
	
	public void setPaused(bool pauseState) {
		paused = pauseState;
	}
	
	public GameObject getSelectedObject() {
		return selectedObject;
	}
	
	public void setSelectedObject(GameObject selected) {
		selectedObject = selected;
	}
	
	public Player getCurrentPlayer() {
		return currentPlayer;
	}
	
	public void setCurrentPlayer(Player player) {
		currentPlayer = player;
	}
	
	
}
