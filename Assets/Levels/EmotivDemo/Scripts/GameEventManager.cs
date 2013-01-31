using UnityEngine;
using System.Collections;

public static class GameEventManager {
	
	public delegate void GameEvent();
	public static event GameEvent GameStartEvent, GameOverEvent, PauseEvent, UnpauseEvent, DebugModeEvent;

	public static void TriggerGameStart() {
		if (GameStartEvent != null) {
			GameStartEvent();
		}
	}
	
	public static void TriggerGameOver() {
		if (GameOverEvent != null) {
			GameOverEvent();
		}
	}
	
	public static void TriggerPause() {
		if (PauseEvent != null) {
			PauseEvent();
		}
	}
	
	public static void TriggerUnpause() {
		if (UnpauseEvent != null) {
			UnpauseEvent();
		}
	}
	
	public static void TriggerDebugModeEvent() {
		if (DebugModeEvent != null) {
			DebugModeEvent();
		}
	}
}
