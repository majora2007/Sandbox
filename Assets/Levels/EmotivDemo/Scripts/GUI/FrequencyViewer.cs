using UnityEngine;
using System.Collections;

public class FrequencyViewer : MonoBehaviour {
	
	private double[] data;
	
	private int alphaWaves = 0;
	
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
		if (!EmotivHandler.Instance.isConnected()) return;
		
		// Get data from AF3 channel
		data = EmotivHandler.Instance.getDataChannel(Emotiv.EdkDll.EE_DataChannel_t.AF3);
		
		
		int numPeaks = 0;
		// Find number of peaks for one seconds worth of data in range of alpha (40-100 microVolts). 
		// Note, I do not remove the dc offset, thus baseline is at 4000 uV.
		for (int i = 0; i < data.Length; i++) {
			//Debug.Log ("data[" + i + "] = " + data[i]);
			if ((data[i + 1] - data[i] < 0) && data[i] >= (4200 + 40) && data[i] <= (4200 + 100)) {
				numPeaks++;
			}
		}
		
		alphaWaves = numPeaks;
		Debug.Log ("Alpha waves: " + alphaWaves);
	}
	
	
	
	private float mean(double[] data) {
		double mean = 0.0;
		for (int i = 0; i < data.Length; i++) {
			mean += data[i];
		}
		
		return (float) (mean / data.Length);
	}
	
	void OnGUI() {
		
		
		GUI.Label(new Rect(200, 200, 100, 80), "Alpha: " + alphaWaves);
	}
}
