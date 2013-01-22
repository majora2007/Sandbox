using UnityEngine;
using System.Collections;
using System;

public class ClockAnimator : MonoBehaviour {
	
	public Transform hours, minutes, seconds;
	
	private const float hrsToDegrees = 360.0f / 12.0f;
	private const float minsToDegrees = 360.0f / 12.0f;
	private const float secsToDegrees = 360.0f / 12.0f;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		DateTime time = DateTime.Now;
		hours.localRotation = Quaternion.Euler(0.0f, 0.0f, time.Hour * -hrsToDegrees);
		minutes.localRotation = Quaternion.Euler(0.0f, 0.0f, time.Minute * -minsToDegrees);
		seconds.localRotation = Quaternion.Euler(0.0f, 0.0f, time.Second * -secsToDegrees);
	}
}
