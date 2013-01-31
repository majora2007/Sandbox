using UnityEngine;
using System.Collections;

public class PlayerRules : MonoBehaviour {
	
	public Transform player;
	
	public float groundFloorLimit = -6f;
	
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		if (player.position.y <= groundFloorLimit) {
			// Player dies!
		}
	}
}
