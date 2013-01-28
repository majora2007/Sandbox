using UnityEngine;
using System.Collections;

public static class CognitvEventManager {

	public delegate void CognitivEvent();
	public static event CognitivEvent LiftEvent, PushEvent, DisappearEvent, LeftEvent;

	public static void TriggerCognitivLift() {
		if (LiftEvent != null) {
			LiftEvent();
		}
	}
	
	public static void TriggerCognitivPush() {
		if (PushEvent != null) {
			PushEvent();
		}
	}
	
	public static void TriggerCognitivDisappear() {
		if (DisappearEvent != null) {
			DisappearEvent();
		}
	}
	
	public static void TriggerCognitivLeft() {
		if (LeftEvent != null) {
			LeftEvent();
		}
	}
}
