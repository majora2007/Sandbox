using UnityEngine;
using System.Collections;

public class CognitivObject : MonoBehaviour {

    public float liftSensitivity;// { get; set; }
    public float disappearSensitivity;// { get; set; }
    public float leftSensitivity;// { get; set; }
    public float rightSensitivity;// { get; set; }
    public float pushSensitivity;// { get; set; }

	// Use this for initialization
	void Start () {
        transform.tag = "CognitivObject";
	}
}
