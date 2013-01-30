using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Emotiv;

/// MouseLook rotates the transform based on the mouse delta.
/// Minimum and Maximum values can be used to constrain the possible rotation

/// To make an FPS style character:
/// - Create a capsule.
/// - Add the MouseLook script to the capsule.
///   -> Set the mouse look to use LookX. (You want to only turn character but not tilt it)
/// - Add FPSInputController script to the capsule
///   -> A CharacterMotor and a CharacterController component will be automatically added.

/// - Create a camera. Make the camera a child of the capsule. Reset it's transform.
/// - Add a MouseLook script to the camera.
///   -> Set the mouse look to use LookY. (You want the camera to tilt up and down like a head. The character already turns.)
[AddComponentMenu("Camera-Control/Mouse Look")]
public class GyroLook : MonoBehaviour {

	public enum RotationAxes { MouseXAndY = 0, MouseX = 1, MouseY = 2 }
	public RotationAxes axes = RotationAxes.MouseXAndY;
	public float sensitivityX = 15F;
	public float sensitivityY = 15F;

	public float minimumX = -360F;
	public float maximumX = 360F;

	public float minimumY = -60F;
	public float maximumY = 60F;

	float rotationY = 0F;
	
	public bool useGyro = true;
	
	private EmotivHandler dataHandler;
	
	private double prevAverage = 0.0;
	private double threshold = 10.0;
	private double baseline = 1700;
	

	void Update ()
	{
		if (axes == RotationAxes.MouseXAndY)
		{
			float rotationX = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;
			
			rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
			transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
		}
		else if (axes == RotationAxes.MouseX)
		{
			if (useGyro && dataHandler.isConnected()) {
				float xAngle = 0.0f;
				double currAverage = 0.0;
				
				Dictionary<EdkDll.EE_DataChannel_t, double[]> data = dataHandler.getData();
				
				if (data == null) return;
				
				// On turning head left, the data drops about 40 values. From 1700, 
				// 1694, 1687, 1681, 1676, 1671, 1667, 1666, 1667, 
				// 1676, 1684, 1694, 1702
				// 1710, 1713, 1710, 1705, 1701
				// From these values, we can see that there is a post-wave which is the inverse 
				// of the wave before normalizing out to baseline. The magnitude seems to be 1/4th 
				// in this data, but I would imagine it can be 1/2 of the initial wave.
				
				/*int _bufferSize = data[EdkDll.EE_DataChannel_t.TIMESTAMP].Length; // 4
				double sum = 0.0;
				for (int i = 0; i < _bufferSize; i++)
			    {
					sum += (data[EdkDll.EE_DataChannel_t.GYROX][i] - baseline);
			    }
				
				Debug.Log("Sum: " + sum);
				Debug.Log("====");*/
				xAngle = Mathf.Lerp(-1.0f, 1.0f, (float) (data[EdkDll.EE_DataChannel_t.GYROX][0] - baseline) );
				Debug.Log(xAngle);
				transform.Rotate(0, xAngle, 0);
				
				//currAverage = calculateAverage(data);
				//xAngle = calculateRotationAngle(currAverage);
				//xAngle = Mathf.DeltaAngle((float) prevAverage, (float) currAverage);
				//prevAverage = currAverage;
				
				//Debug.Log ("X Angle: " + xAngle);
				//Debug.Log ("Rotate Angle: " + xAngle * sensitivityX);
				
				/*if (xAngle > -threshold && xAngle < threshold) {
					
				} else {
					transform.Rotate(0, xAngle, 0);
					//transform.Rotate(0, xAngle * sensitivityX, 0);
				}*/
				
			} else {
				// A value usually at 0, but when moved left it can be a max of -2.0f, usually -0.5f.
				//Debug.Log ("Mouse X: " + Input.GetAxis("Mouse X"));
				transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
			}
			
			
			
		}
		else
		{
			rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
			transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
		}
	}
	
	void Start ()
	{
		// Make the rigid body not change rotation
		if (rigidbody)
			rigidbody.freezeRotation = true;

		dataHandler = (EmotivHandler) FindObjectOfType(typeof(EmotivHandler));
		
		if (dataHandler == null) {
			Debug.Log("Could not obtain reference to EmotivConnector");
			useGyro = false;
		}
	}
	
	double calculateAverage(Dictionary<EdkDll.EE_DataChannel_t, double[]> data) {
		double currAverage = 0.0;
		int _bufferSize = data[EdkDll.EE_DataChannel_t.TIMESTAMP].Length; // 4
		double x;
		for (int i = 0; i < _bufferSize; i++)
        {
            // Extract Gyroscope data (channels 17 and 18)
			x = data[EdkDll.EE_DataChannel_t.GYROX][i];
			Debug.Log(x);
			currAverage += x;
        }
		
		return currAverage / _bufferSize;
	}
	
	float calculateRotationAngle(double currAverage) {
		float angle = 0.0f;
		// Take into account the previous peak.
		if (currAverage > prevAverage + threshold && prevAverage <= 0) {
			// Go left
			//angle = (float) currAverage * 0.01f;
			angle = (float) Mathf.Lerp(1.0f, (float) currAverage, 0.01f);
			//angle = Mathf.DeltaAngle(prevAverage, currAverage);
			Debug.Log ("Left: " + angle);

		} else if (currAverage < prevAverage - threshold  && prevAverage >= 0) {
			// Go right
			//angle = (float) currAverage * -0.01f;
			angle = (float) Mathf.InverseLerp(1.0f, (float) currAverage, 0.01f);
			Debug.Log ("Right: " + angle);

		} else {
			angle = 0.0f;
		}
		return angle;
	}
	/*
	float Coserp(float start, float end, float value)
	{
		return Mathf.Lerp(start, end, 1.0 - Mathf.Cos(value * Mathf.PI * 0.5));
	}
	
	float Sinerp(float start, float end, float value)
	{
	    return Mathf.Lerp(start, end, Mathf.Sin(value * Mathf.PI * 0.5));
	}*/
}