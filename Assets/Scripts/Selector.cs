using UnityEngine;
using System.Collections;

//[RequireComponent(typeof(Halo))]
public class Selector : MonoBehaviour {
	
	private RaycastHit hit = new RaycastHit();
	private Ray lookAtRay = new Ray();
	
	public static GameObject selectedObject;
	private GameObject prevSelected;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		
		lookAtRay = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if (Physics.Raycast(lookAtRay, out hit, 10.0f ) && Input.GetMouseButtonDown(0)) {
			if (hit.collider.gameObject.tag == "CognitivObject") {
				prevSelected = selectedObject;
				selectedObject = hit.collider.gameObject;
				Debug.Log ("I selected " + selectedObject.name);
			}
		}
		
		/*if (selectedObject != null && prevSelected != null) {
			if (!prevSelected.Equals(selectedObject)) {
				(prevSelected.GetComponent("Halo") as Behaviour).enabled = false;
				(selectedObject.GetComponent("Halo") as Behaviour).enabled = true;
			} else {
				(selectedObject.GetComponent("Halo") as Behaviour).enabled = true;
			}
		}*/
		
		
		
	}
}
