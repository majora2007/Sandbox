using UnityEngine;
using Emotiv;
using System.Collections;
using System.Collections.Generic;


public class EmotivHandler : MonoBehaviour {
	
	private static EmotivHandler instance;
	
	protected EmoEngine engine; // Access to the EDK is viaa the EmoEngine 
    private uint userID; // userID is used to uniquely identify a user's headset
	private Profile profile;
	
	private EmoState cogState = null;
	private Dictionary<EdkDll.EE_DataChannel_t, double[]> data;
	
	private static float bufferSize = 1.0f;

    private float elapsedTime = 0;
	
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
		
		// This should be called every second...
        elapsedTime += Time.deltaTime;
        if (elapsedTime > bufferSize)
        {
            data = engine.GetData(userID);
            elapsedTime = 0;

            if (data == null) return;
        }
	}
	
	public uint getActiveUser() {
		return (userID);
	}
	
	public static EmoEngine getEmoEngine() {
		if (instance.engine == null) return EmoEngine.Instance;
		else return instance.engine;
	}
	
	public void connect() {
		engine = EmoEngine.Instance;
		
		engine.EmoEngineConnected += new EmoEngine.EmoEngineConnectedEventHandler(engine_EmoEngineConnected);
        //engine.UserAdded += new EmoEngine.UserAddedEventHandler(engine_userAdded_event);

		engine.CognitivEmoStateUpdated += new EmoEngine.CognitivEmoStateUpdatedEventHandler(engine_CognitiveEmoStateUpdated);
		
		engine.Connect();
		
	}
	
	public void disconnect() {
		try {
			engine.Disconnect();
		} catch {}
		
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
		
		Debug.Log("EmoEngine Connected!");
		userID = e.userId;
		engine.LoadUserProfile(0, "C:/Users/jvmilazz/Desktop/Joseph.emu"); 
		userID = 0;
		engine.DataAcquisitionEnable(userID, true);
		engine.EE_DataSetBufferSizeInSec(bufferSize); 
		Debug.Log ("User ID: " + userID);
	}
	
	void engine_userAdded_event(object sender, EmoEngineEventArgs e) {
		Debug.Log("User Added Event has occured");

		/*
		// enable data aquisition for this user
		engine.DataAcquisitionEnable(userID, true);
		
		// ask for up to 1 second of buffered data
        engine.EE_DataSetBufferSizeInSec(1.0f); 
		
		// I don't need to do profile handling myself.
		profile = EmoEngine.Instance.GetUserProfile(userID);
        profile.GetBytes();*/
		
	}
	
	void engine_EmoStateUpdated(object sender, EmoStateUpdatedEventArgs args) {
		
		EmoState emoState = args.emoState; 
		
		//Debug.Log("User has lower face expression : " + emoState.ExpressivGetLowerFaceAction().ToString() + " of strength " + emoState.ExpressivGetLowerFaceActionPower().ToString() ); 	

		
	}
	
	void engine_CognitiveEmoStateUpdated(object sender, EmoStateUpdatedEventArgs args) {
		cogState = args.emoState;
		EmoState emoState = args.emoState;
	
		//Debug.Log("User has cognitive action : " + emoState.CognitivGetCurrentAction().ToString() + " of strength " + emoState.CognitivGetCurrentActionPower().ToString() ); 		
	}
	
	public EmoState getCognitiveState() {
		return cogState;
	}

}
