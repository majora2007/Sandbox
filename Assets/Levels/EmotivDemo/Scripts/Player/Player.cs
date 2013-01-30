using UnityEngine;
using System.Collections;

public class Player {
	
	private uint emotivUserID; // UserID for Emotiv's Control Panel
	private string userName; // A unique name for the user
	
	public Player() {
		userName = string.Empty;
		emotivUserID = 0;
	}
	
	public string UserName { get; set; }
	public uint EmotivID { get; set; }
	
}
