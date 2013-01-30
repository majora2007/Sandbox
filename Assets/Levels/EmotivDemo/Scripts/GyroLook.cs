using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Emotiv;
using System;

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
[AddComponentMenu("Camera-Control/Gyro Look")]
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
	
	
	private double prevAverage = 0.0;
	private double threshold = 10.0;
	private double baseline = 1700;

	void Update ()
	{
		if (GameState.Instance.isPaused()) return;
		
		int deltaX = 0, deltaY = 0;
		
		if (axes == RotationAxes.MouseXAndY)
		{
			if (useGyro && EmotivHandler.Instance.isConnected()) {
				EmotivHandler.getEmoEngine().HeadsetGetGyroDelta(EmotivHandler.Instance.getActiveUser(), out deltaX, out deltaY);
				
				float rotationX = transform.localEulerAngles.y + deltaX * sensitivityX;
			
				rotationY += deltaY * sensitivityY;
				rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
				
				transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
				
			} else {
				float rotationX = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;
			
				rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
				rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
				
				transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
			}
		}
		else if (axes == RotationAxes.MouseX)
		{
			if (useGyro && EmotivHandler.Instance.isConnected()) {
				EmotivHandler.getEmoEngine().HeadsetGetGyroDelta(EmotivHandler.Instance.getActiveUser(), out deltaX, out deltaY);
				
				//Debug.Log ("deltaX, deltaY = " + deltaX + ", " + deltaY);
				transform.Rotate(0, deltaX * sensitivityX, 0);
				
			} else {
				// A value usually at 0, but when moved left it can be a max of -2.0f, usually -0.5f.
				transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
			}
		}
		else
		{
			if (useGyro && EmotivHandler.Instance.isConnected()) {
				EmotivHandler.getEmoEngine().HeadsetGetGyroDelta(EmotivHandler.Instance.getActiveUser(), out deltaX, out deltaY);
				
				rotationY += deltaY * sensitivityY;
				rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
				transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
			} else {
				rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
				rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
				transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
			}
			
		}
	}
	
	void Start ()
	{
		// Make the rigid body not change rotation
		if (rigidbody)
			rigidbody.freezeRotation = true;

		
		if (EmotivHandler.Instance == null) {
			Debug.Log("Could not obtain reference to EmotivConnector.");
			useGyro = false;
		}
	}
}