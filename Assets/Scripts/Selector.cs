using UnityEngine;
using System.Collections;

public class Selector : MonoBehaviour {
	
	private RaycastHit hit = new RaycastHit();
	private Ray lookAtRay = new Ray();
	
	public static GameObject selectedObject;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		
		lookAtRay = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if (Physics.Raycast(lookAtRay, out hit, 10.0f ) && Input.GetMouseButtonDown(0)) {
			if (hit.collider.gameObject.tag == "CognitivObject") {
				selectedObject = hit.collider.gameObject;
				Debug.Log ("I selected " + selectedObject.name);
			}
		}
	}
}
