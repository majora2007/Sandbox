using UnityEngine;
using Emotiv;
using System.Collections;
using System.Collections.Generic;


public class EmotivHandler : MonoBehaviour {
	
	private static EmotivHandler instance;
	
	private EmoEngine engine; // Access to the EDK is viaa the EmoEngine 
    private int userID = -1; // userID is used to uniquely identify a user's headset
	private Profile profile;
	private EmoState cogState = null;
	
	private Dictionary<EdkDll.EE_DataChannel_t, double[]> data;
	
	
	public static EmotivHandler Instance
	{
		get
		{
			if (instance == null) {
				instance = new GameObject("EmotivHandler").AddComponent<EmotivHandler>();
			}
			
			return instance;
		}
	}
	
	public void OnApplicationQuit() 
	{
		instance = null;
	}
	
	// Update is called once per frame
	void Update () {
		
		if (engine == null) return;
		
		
		// Handle any waiting events
        engine.ProcessEvents();
		
		// If the user has not yet connected, do not proceed
        if ((int)userID == -1)
            return;
		
		data = engine.GetData((uint) userID);


        if (data == null)
        {
            return;
        }

        /*int _bufferSize = data[EdkDll.EE_DataChannel_t.TIMESTAMP].Length; // 4
		Debug.Log ("Buffer Size: " + _bufferSize);
		
		for (int i = 0; i < _bufferSize; i++)
        {
            // Extract Gyroscope data (channels 17 and 18)

            Debug.Log(data[EdkDll.EE_DataChannel_t.GYROX][i] + ", " + data[EdkDll.EE_DataChannel_t.GYROY][i]);
        }*/
	
	}
	
	public void connect() {
		engine = EmoEngine.Instance;
		
		engine.EmoEngineConnected += new EmoEngine.EmoEngineConnectedEventHandler(engine_EmoEngineConnected);
        //engine.UserAdded += new EmoEngine.UserAddedEventHandler(engine_userAdded_event);

		engine.CognitivEmoStateUpdated += new EmoEngine.CognitivEmoStateUpdatedEventHandler(engine_CognitiveEmoStateUpdated);
		
		engine.Connect();
		
	}
	
	public void disconnect() {
		engine.Disconnect();
		engine = null;
	}
	
	public Dictionary<EdkDll.EE_DataChannel_t, double[]> getRawData() {
		return data;
	}
	
	public double[] getDataChannel(EdkDll.EE_DataChannel_t channel) {
		return data[channel];
	}
	
	public bool isConnected() {
		return (engine != null && engine.EngineGetNumUser() > 0);
	}
	
	void engine_EmoEngineConnected(object sender, EmoEngineEventArgs e) {
		
		Debug.Log("Engine Connected!");
		userID = (int) e.userId;
		engine.LoadUserProfile(0, "C:/Users/jvmilazz/Desktop/Joseph.emu"); 
	}
	
	void engine_userAdded_event(object sender, EmoEngineEventArgs e) {
		Debug.Log("User Added Event has occured");

		/*
		// enable data aquisition for this user
		engine.DataAcquisitionEnable((uint) userID, true);
		
		// ask for up to 1 second of buffered data
        engine.EE_DataSetBufferSizeInSec(0.5f); 
		
		// I don't need to do profile handling myself.
		profile = EmoEngine.Instance.GetUserProfile(0);
        profile.GetBytes();*/
		
	}
	
	void engine_EmoStateUpdated(object sender, EmoStateUpdatedEventArgs args) {
		
		EmoState emoState = args.emoState; 
		
		Debug.Log("User has lower face expression : " + emoState.ExpressivGetLowerFaceAction().ToString() + " of strength " + emoState.ExpressivGetLowerFaceActionPower().ToString() ); 	

		
	}
	
	void engine_CognitiveEmoStateUpdated(object sender, EmoStateUpdatedEventArgs args) {
		cogState = args.emoState;
		EmoState emoState = args.emoState;
	
		Debug.Log("User has cognitive action : " + emoState.CognitivGetCurrentAction().ToString() + " of strength " + emoState.CognitivGetCurrentActionPower().ToString() ); 		
	}
	
	public EmoState getCognitiveState() {
		return cogState;
	}

}
