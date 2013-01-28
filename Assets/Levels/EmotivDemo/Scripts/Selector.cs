using UnityEngine;
using System.Collections;

//[RequireComponent(typeof(Halo))]
public class Selector : MonoBehaviour {
	
	public Material highlightMaterial;
	
	private RaycastHit hit = new RaycastHit();
	private Ray lookAtRay = new Ray();
	private GameObject prevSelected;
	private Material prevMaterial;
	private Material[] prevMaterials;
	public bool highlightEffect = false;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		
		lookAtRay = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		if (Physics.Raycast(lookAtRay, out hit, 100.0f ) && Input.GetMouseButtonDown(0)) {
			if (hit.collider.gameObject.tag == "CognitivObject") {
				GameObject selectedObject = hit.collider.gameObject;

				
				if (prevSelected == null ) { // On first run
					GameState.Instance.setSelectedObject(selectedObject);
					prevSelected = selectedObject;
				} else if (prevSelected != selectedObject)
				{
					GameState.Instance.setSelectedObject(selectedObject);
					if (highlightEffect) {
						prevSelected.renderer.materials = prevMaterials;
					}
					prevSelected = selectedObject;
				}
				
				if (highlightEffect) {
					prevMaterials = selectedObject.renderer.materials;
					
					Material[] selectedMaterials = new Material[selectedObject.renderer.materials.Length + 1];
					selectedObject.renderer.materials.CopyTo(selectedMaterials, 0);
					selectedMaterials[selectedMaterials.Length - 1] = highlightMaterial;
					selectedObject.renderer.materials = selectedMaterials;
				}
			}
		}
	}
}
