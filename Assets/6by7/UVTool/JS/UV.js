#if UNITY_EDITOR

/*
 *	UVTool Interface JS Port
 *	v1.??
 *	Last Revision: 09/01/2012
 *
 */

import System.Collections.Generic;

// ignore this nastiness
public class ContinueModifications {
	var orientation : UV.Orientation;
	var flipU : boolean;
	var flipV : boolean;
	var swap : boolean;

	public function ContinueModifications(o : UV.Orientation, u : boolean, v : boolean, s : boolean) {
		orientation = o;
		flipU = u;
		flipV = v;
		swap = s;
	}
}

// Set of UV mapping methods for ProBuilder
public class UV
{
	public enum ProjectionAxis {
		PLANAR_X,	// projects on x axis
		PLANAR_Y,	// projects on y axis 
		PLANAR_Z,	// projects on z axis
		AUTO		// uses the plane normal
	}

	public enum UVChannel {
		UV,
		UV2
	}

	public enum Orientation {
		UP,
		RIGHT,
		LEFT,
		DOWN,
		SAME,
		NONE  	// this would be bad-news bears 
	}

	// This exists because in the future we may wish to support different mapping methods beyond
	// planar.  For now though, this just operates as a user-friendly call for planar.
	// It's also a little friendlier in that it performs the uv updates for you, instead of returning
	// coordinates.
	public static function UpdateUVs(go : GameObject, uvSettings : UVSettings)
	{
		var m : Mesh = go.GetComponent.<MeshFilter>().sharedMesh;

		m.uv = PlanarMap(go, uvSettings);
		m.uv2 = NormalizeUVs(m.uv);

		go.GetComponent.<MeshFilter>().sharedMesh.uv = m.uv;
		go.GetComponent.<MeshFilter>().sharedMesh.uv2 = m.uv2;
	}

	public static function PlanarMap(go : GameObject, uvSettings : UVSettings) : Vector2[]
	{
		var m : Mesh = go.GetComponent(typeof(MeshFilter)).sharedMesh;
		if(!m) return;

		var verts : Vector3[] 	= (uvSettings.useWorldSpace) ? VerticesInWorldSpace(go) : m.vertices;
		var	uvs : 	Vector2[]	= new Vector2[verts.Length];
		var planeNormal : Vector3 = PlaneNormal(verts[0], verts[1], verts[2]); 		// this is bad... but i guess it works for now.
		var	vec : 	Vector3		= new Vector3();

		/*
		 *	Determine what axis to project from, and set initial V axis 
		 *	to reflect.
		 */
		if(uvSettings.projectionAxis == ProjectionAxis.AUTO)
			uvSettings.projectionAxis = GetProjectionAxis(planeNormal);

		switch(uvSettings.projectionAxis)
		{
			case ProjectionAxis.PLANAR_X:
				vec = Vector3.up;
				break;

			case ProjectionAxis.PLANAR_Y:
				vec = Vector3.forward;
				break;
			
			case ProjectionAxis.PLANAR_Z:
				vec = Vector3.up;
				break;

			default:
				vec = Vector3.forward;
				break;
		}

		// Set uvSettings for object back to auto, so that when copying settings
		// the uvSettings for the target object don't assume the same projection axis.
		uvSettings.projectionAxis = ProjectionAxis.AUTO;
		
		/*
		 *	Assign vertices to UV coordinates
		 */
		for(var i : int = 0; i < verts.Length; i++)
		{
			var u : float;
			var v : float;
			var uAxis : Vector3;
			var vAxis : Vector3;
			
			// get U axis
			uAxis = Vector3.Cross(planeNormal, vec);
			uAxis.Normalize();

			// calculate V axis relative to U
			vAxis = Vector3.Cross(uAxis, planeNormal);
			vAxis.Normalize();

			u = Vector3.Dot(uAxis, verts[i] / uvSettings.scale.x) - uvSettings.offset.x;
			v = Vector3.Dot(vAxis, verts[i] / uvSettings.scale.y) + uvSettings.offset.y;

			/* 
			 *	Special circumstance flipping of UVs... this is sillyness, but it fits the bill for now.
			 */
			switch(go.name)
			{
				case "Plane_Left":
					u = -u;
					break;
				case "Plane_Top":
					u = -u;
					break;
				case "Plane_Front":
					u = -u;
					break;
			}

			if(uvSettings.flipU)
				u = -u;

			if(uvSettings.flipV)
				v = -v;

			if(!uvSettings.swapUV)
				uvs[i] = new Vector2(u, v);
			else
				uvs[i] = new Vector2(v, u);
		
			uvs[i] = RotateUVs(uvs[i], uvSettings.rotation);
		}
		
		if(uvSettings.normalizeUVs)
			return NormalizeUVs(uvs);
		else
			return uvs;
	}

	public static function ContinueUVs(planes : GameObject[], uvs : UVSettings, mat : Material)
	{
		// Preface
		// I hate this function.  It is the dumbest of the dumb, but it ought to work for this
		// limited requirement.  We assume that we're aligning all planes to the first selected 
		// object.  We also overwrite any user modifications that aren't made to the initially
		// selected plane.

		for(var i = 1; i < planes.Length; i++)
		{
			if(!planes[i-1].GetComponent.<MeshFilter>())
				continue;

			// cache origin uvs (the plane immediately before the target)
			var origin_uv : Vector2[] = planes[i-1].GetComponent.<MeshFilter>().sharedMesh.uv;
			var origin_name : String = planes[i-1].name;
			var origin_uvSettings : UVSettings = planes[i-1].GetComponent.<builder_Plane>().uvSettings;

			// cache target mesh
			var g : GameObject = planes[i].gameObject;
			var m : Mesh = g.GetComponent.<MeshFilter>().sharedMesh;
			var b : builder_Plane = g.GetComponent.<builder_Plane>();

			// if anything is not there, return before shit gets out of hand
			if(!origin_name || !origin_uv || !origin_uvSettings || !g || !m || !b)
				continue;

			// copy uv settings to target mesh
			b.uvSettings = new UVSettings(origin_uvSettings);

			// figure out what modifications need to be made to the target uvs
			var mods : ContinueModifications = GetContinueModifications(origin_name, g.name);

			// apply the modifications
			b.uvSettings.ApplyModifications(mods);

			// map it to get accurate UV placings with current modifications
			UpdateUVs(g, b.uvSettings);

			// get the uv offset
			b.uvSettings.offset = GetUVOffset(origin_uv, m.uv, mods.orientation);

			// aand update the target mesh uvs
			UpdateUVs(g, b.uvSettings);
			// m.uv = ShiftArrayValues(m.uv, b.uvSettings.offset);

			// Debug.Log("Shifting " + mods.orientation + "\n" + ArrayToString(origin_uv) + "\n" + ArrayToString(m.uv));
		}

	}

	// I know magic strings are bad, and I also realize this is not exactly elegant, so get off my case!
	public static function GetContinueModifications(origin : String, g : String) : ContinueModifications
	{
		var o : Orientation = Orientation.NONE;
		var u : boolean = false;
		var v : boolean = false;
		var s : boolean = false;

		switch(origin)
		{
			case "Plane_Front":
				switch(g)
				{
					case "Plane_Front":
						o = Orientation.SAME;
						break;

					case "Plane_Back":
						o = Orientation.SAME;
						break;

					case "Plane_Right":
						o = Orientation.LEFT;
						break;

					case "Plane_Left":
						o = Orientation.RIGHT;
						break;

					case "Plane_Top":
						u = true;
						v = true;
						o = Orientation.UP;
						break;

					case "Plane_Bottom":
						o = Orientation.DOWN;
						break;
				}
				break;

			case "Plane_Back":
				switch(g)
				{
					case "Plane_Front":
						o = Orientation.SAME;
						break;

					case "Plane_Back":
						o = Orientation.SAME;
						break;

					case "Plane_Right":
						o = Orientation.RIGHT;
						break;

					case "Plane_Left":
						o = Orientation.LEFT;
						break;

					case "Plane_Top":
						o = Orientation.UP;
						break;

					case "Plane_Bottom":
						u = true;
						v = true;
						o = Orientation.DOWN;
						break;
				}
				break;

			case "Plane_Right":
				switch(g)
				{
					case "Plane_Front":
						o = Orientation.RIGHT;
						break;

					case "Plane_Back":
						o = Orientation.LEFT;
						break;

					case "Plane_Right":
						o = Orientation.SAME;
						break;

					case "Plane_Left":
						o = Orientation.SAME;
						break;

					case "Plane_Top":
						u = true;
						s = true;
						o = Orientation.UP;
						break;

					case "Plane_Bottom":
						u = true;
						v = true;
						o = Orientation.DOWN;
						break;
				}
				break;

			case "Plane_Left":
				switch(g)
				{
					case "Plane_Front":
						o = Orientation.LEFT;
						break;

					case "Plane_Back":
						o = Orientation.RIGHT;
						break;

					case "Plane_Right":
						o = Orientation.SAME;
						break;

					case "Plane_Left":
						o = Orientation.SAME;
						break;

					case "Plane_Top":
						v = true;
						s = true;
						o = Orientation.UP;
						break;

					case "Plane_Bottom":
						v = true;
						s = true;
						o = Orientation.DOWN;
						break;
				}
				break;

			case "Plane_Top":
				switch(g)
				{
					case "Plane_Front":
						u = true;
						v = true;
						o = Orientation.UP;
						break;

					case "Plane_Back":
						o = Orientation.DOWN;
						break;

					case "Plane_Right":
						v = true;
						s = true;
						o = Orientation.RIGHT;
						break;

					case "Plane_Left":
						u = true;
						s = true;
						o = Orientation.LEFT;
						break;

					case "Plane_Top":
						o = Orientation.SAME;
						break;

					case "Plane_Bottom":
						o = Orientation.SAME;
						break;
				}
				break;

			case "Plane_Bottom":
				switch(g)
				{
					case "Plane_Front":
						o = Orientation.UP;
						break;

					case "Plane_Back":
						u = true;
						v = true;
						o = Orientation.DOWN;
						break;

					case "Plane_Right":
						v = true;
						s = true;
						o = Orientation.LEFT;
						break;

					case "Plane_Left":
						u = true;
						s = true;
						o = Orientation.RIGHT;
						break;

					case "Plane_Top":
						o = Orientation.SAME;
						break;

					case "Plane_Bottom":
						o = Orientation.SAME;
						break;
				}
				break;
			
			default:
				o = Orientation.NONE;
		}
	
		return new ContinueModifications(o, u, v, s);
	}

	// o 	: Original UVs
	// t   	: Target UVs
	// dir 	: Which direction are the target uvs gettin' hitched to the originals
	//			Ex: mapping from front face to top face, direction is Orientation.UP;
	//			meaning that we shift the target uv coordinates up and align to top LEFT
	// 			and right of origin uvs.
	// 
	// Note : This method assumes the UVs are wrapped in a specific order, and that 0 is always
	// bottom left, 1 is always bottom right, etc.  Not the smartest, I know, but since we're 
	// using prefab meshes I think this is a pretty safe assumption.
	public static function GetUVOffset(o : Vector2[], t : Vector2[], dir : Orientation) : Vector2
	{
		var off : Vector2 = new Vector2(0.0, 0.0);
		
		var a1 : Vector2;		// the origin vector2 align point
		var b1 : Vector2;		// target vector2 align point

		switch(dir)
		{
			// offset using origin top left and target bottom left vertice
			case Orientation.UP:
				a1 = o[2];
				b1 = t[0];
				break;

			case Orientation.RIGHT:
				a1 = o[1];
				b1 = t[0];
				break;

			case Orientation.DOWN:
				a1 = o[0];
				b1 = t[2];
				break;

			case Orientation.LEFT:
				a1 = o[0];
				b1 = t[1];

			default:
				a1 = new Vector2(0.0, 0.0);
				b1 = new Vector2(0.0, 0.0);
		}

		off = new Vector2(a1.x - b1.x, a1.y - b1.y);
		
		return off;
	}

	public static function VerticesInWorldSpace(go : GameObject) : Vector3[]
	{
		var m : Mesh = go.GetComponent(typeof(MeshFilter)).sharedMesh;
		if(!m) return;
		var w_points = new Vector3[m.vertices.Length];
		for(var i : int = 0; i < w_points.Length; i++)
			w_points[i] = go.transform.TransformPoint(m.vertices[i]);
		return w_points;
	}

	/*
	 *	Returns normalized UV values for a mesh uvs (0,0) - (1,1)
	 */
	public static function NormalizeUVs(uvs : Vector2[]) : Vector2[]
	{
		/*
		 *	how this works -
		 *		- shift uv coordinates such that the lowest value x and y coordinates are zero
		 *		- scale non-zeroed coordinates uniformly to normalized values (0,0) - (1,1)
		 */

		// shift UVs to zeroed coordinates
		var smallestVector2 : Vector2 = SmallestVector2(uvs);

		for(var i : int = 0; i < uvs.Length; i++)
		{
			uvs[i] -= smallestVector2;
		}


		var largestValue : float = LargestFloat(uvs);

		for(i = 0; i < uvs.Length; i++)
		{
			uvs[i] = new Vector2(uvs[i].x / largestValue, uvs[i].y / largestValue);
		}

		return uvs;
	}

	/*
	 *	Normalizes UV values for an array of meshes.
	 *
	 *	Uses a single scale value so as not to return non-uniform scales values
	 *	for each mesh.
	 */
	public static function NormalizeUVs(meshes : Mesh[], channel : UVChannel)
	{
		var largestValue : float = 0f;

		for(var m : Mesh in meshes)
		{
			switch(channel)
			{
			case UVChannel.UV:
				if(LargestFloat(m.uv) > largestValue)
					largestValue = LargestFloat(m.uv);
				break;
			case UVChannel.UV2:
				if(LargestFloat(m.uv) > largestValue)
					largestValue = LargestFloat(m.uv);
				break;
			}				
		}

		for(var m : int = 0; m < meshes.Length; m++)
		{
			var uvs : Vector2[];

			if(channel == UVChannel.UV)
				uvs = meshes[m].uv;
			else
				uvs = meshes[m].uv2;	

			// shift UVs to zeroed coordinates
			var smallestVector2 : Vector2 = SmallestVector2(uvs);

			for(var i : int = 0; i < uvs.Length; i++)
			{
				uvs[i] -= smallestVector2;
			}

			for(i = 0; i < uvs.Length; i++)
			{
				uvs[i] = new Vector2(uvs[i].x / largestValue, uvs[i].y / largestValue);
			}

			if(channel == UVChannel.UV)
				meshes[m].uv = uvs;
			else
				meshes[m].uv2 = uvs;
		}
	}

	public static function RotateUVs(originalUVRotation : Vector2, angleChange : float)
	{
		var c : float = Mathf.Cos(angleChange*Mathf.Deg2Rad);
		var s : float = Mathf.Sin(angleChange*Mathf.Deg2Rad);
		var finalUVRotation : Vector2 = Vector2(originalUVRotation.x*c - originalUVRotation.y*s, originalUVRotation.x*s + originalUVRotation.y*c);
		return(finalUVRotation);
	}

	/*
	 *	Utility Functions
	 */
	public static function ShiftArrayValues(arr : Vector2[], val : Vector2) : Vector2[]
	{
		for(var i : int = 0; i < arr.Length; i++)
		{
			arr[i] += val;
		}
		return arr;
	}

	// returns largest float in either x or y
	public static function LargestFloat(arr : Vector2[]) : float
	{
		var xy : float = arr[0].x;
		for(var i : int = 0; i < arr.Length; i++)
		{
			if(arr[i].x > xy)
				xy = arr[i].x;

			if(arr[i].y > xy)
				xy = arr[i].y;
		}
		return xy;	
	}
	
	// returns smallest x and y values in a vector2
	public static function SmallestVector2(arr : Vector2[]) : Vector2
	{
		var xy : Vector2 = arr[0];
		for(var i : int = 0; i < arr.Length; i++)
		{
			if(arr[i].x < xy.x)
				xy.x = arr[i].x;

			if(arr[i].y < xy.y)
				xy.y = arr[i].y;
		}
		return xy;	
	}

	public static function LargestVector2(arr : Vector2[]) : Vector2
	{
		var xy : Vector2 = arr[0];
		for(var i : int = 0; i < arr.Length; i++)
		{
			if(arr[i].x > xy.x)
				xy.x = arr[i].x;

			if(arr[i].y > xy.y)
				xy.y = arr[i].y;
		}
		return xy;	
	}

	public static function ArrayToString(arr : Vector2[]) : String
	{
		var s : String = "";
		for(var i : int = 0; i < arr.Length-1; i++)
			s += "" + arr[i] + ", ";

		s += arr[arr.Length-1];

		return s;
	}

	/*
	 *	Returns a projection axis based on which axis is the largest
	 */
	public static function GetProjectionAxis(plane : Vector3) : ProjectionAxis
	{
		var p : ProjectionAxis;
		if(Mathf.Abs(plane.x) > Mathf.Abs(plane.y))
			p = ProjectionAxis.PLANAR_X;
			else
			p = ProjectionAxis.PLANAR_Y;

		if(Mathf.Abs(plane.z) > Mathf.Abs(plane.y) &&
			Mathf.Abs(plane.z) > Mathf.Abs(plane.x) )
			p = ProjectionAxis.PLANAR_Z;

		return p;
	}

	/*
	 *	Returns the vector normal for a plane
	 */
	public static function PlaneNormal(p0 : Vector3, p1 : Vector3, p2 : Vector3) : Vector3
	{
		var cross : Vector3 = Vector3.Cross(p1 - p0, p2 - p0);
		if (cross.magnitude < Mathf.Epsilon)
		    return new Vector3(0f, 0f, 0f); // bad triangle
		else
		{
			cross.Normalize();
		    return cross;
		}
	}

	public static function ClearFlags(go : GameObject)
	{
		go.hideFlags = 0;
		for(var t : Transform in go.transform)
		{
			t.gameObject.hideFlags = 0;
		}
	}

	public static function ClearFlags(objs : Object[])
	{
		for(var go : GameObject in objs)
		{
			go.hideFlags = 0;
		}
	}

	public static function NotEditableFlags(objs : Object[])
	{
		for(var go : GameObject in objs)
		{
			go.hideFlags = HideFlags.NotEditable;
		}
	}

	/*
	 *	Overloads are for winners
	 */
	public static function PlanarMap(go : GameObject, projectionAxis : ProjectionAxis) : Vector2[]
	{
		return PlanarMap(go, new UVSettings());
	}

	public static function PlanarMap(go : GameObject) : Vector2[]
	{
		return PlanarMap(go, new UVSettings());
	}

	public static function NormalizeUVs(m : Mesh) : Vector2[]
	{
		return NormalizeUVs(m.uv);
	}

	public static function PlaneNormal(m : Mesh) : Vector3
	{
		return PlaneNormal(m.vertices[0], m.vertices[1], m.vertices[2]);
	}
}

#endif