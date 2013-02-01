Sandbox
=======

A sandbox for me to play around with integrating Emotiv's EEG with Unity.

This sandbox allows for me to learn how to use Unity and find good methods for integrating Emotiv's Epoch EEG with Unity. 

The work done in this repository will transition into a Neurofeedback tool which helps a user to relax and relieve stress.

Current functionality:
----------------------

###### __GyroLook__
With the Emotiv's EEG worn, a user can look around a 3D environment by moving their head, replacing the use of a mouse. 
The script is called GyroLook.

###### __Cognitiv Actions__
A multitude of Cognitiv Actions have been mapped to scripts which allow a user to manipulate a selected object via Cognitiv
Actions. A developer may apply a modifier to scale the effect between the Cognitiv Action's power level and the scripts effect.

###### __Raw Data Access__
Currently raw data can be retrieved for one user (one headset) and given to any script.

###### __EmoEngine Handler__
This handler is the interface between Unity and the EmoEngine. The handler allows for one user to be subscribed to raw data 
collection as well as register for EmoEngine Events. 


What's in the works:
---------------------

###### __CognitivObject class__
CognitivObject is a class which extends MonoBehaviour and exposes properties which define how Cognitiv Action scripts can 
manipulate the object. The CognitivObject class by default attaches the "CognitivObject" tag. 

###### __All Cognitiv Action scripts__
Adding the remaining Cognitiv Action scripts.

###### __Management of Emotiv Profiles__
Add the ability for the EmotivHandler to be set with a userID and load/save a Emotiv Profile which is used by the user. 

###### __Training of Cognitiv Actions__
Add a method for a user to train a Cognitiv Action from within Unity. This is what validates the save Profile functionality 
discussed above.

###### __Frequency Band Selection__
Raw data can only be of so much use. Having the ability to select a frequency band and look at magnitude of a frequency is key 
to being able to use Unity and the EEG for neurofeedback. To accomplish this, a bandpass filter which uses FIR and kaiser windowing 
will be implemented (this was first tested in MATLAB to verify it will work well for Neurofeedback).
