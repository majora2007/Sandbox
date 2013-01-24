#if UNITY_EDITOR

// Data Storage
public class UVSettings {
	var projectionAxis : UV.ProjectionAxis;
	var useWorldSpace : boolean;
	var flipU : boolean;
	var flipV : boolean;
	var swapUV : boolean;
	var normalizeUVs : boolean;
	var generateUV2 : boolean;
	var scale : Vector2;
	var offset : Vector2;
	var rotation : float;

	/*
	 * Initializations
	 */
	public function UVSettings()
	{
		projectionAxis = UV.ProjectionAxis.AUTO;
		useWorldSpace = false;
		flipU = false;
		flipV = false;
		swapUV = false;
		normalizeUVs = false;
		generateUV2 = true;
		scale = new Vector2(1f, 1f);
		offset = new Vector2(0f, 0f);
		rotation = 0f;
	}

	public function UVSettings(uvs : UVSettings)
	{
		projectionAxis = uvs.projectionAxis;
		useWorldSpace = uvs.useWorldSpace;
		flipU = uvs.flipU;
		flipV = uvs.flipV;
		swapUV = uvs.swapUV;
		normalizeUVs = uvs.normalizeUVs;
		generateUV2 = uvs.generateUV2;
		scale = uvs.scale;
		offset = uvs.offset;
		rotation = uvs.rotation;
	}

	/*
	 *	Instance Methods
	 */
	public function ApplyModifications(m : ContinueModifications)
	{
		// by flipping the values instead of hard setting, we allow
		// the origin uv modifications to follow through to all child
		// uv targets.
		if(m.flipU)
			flipU = flipU ? false : true;

		if(m.flipV)
			flipV = flipV ? false : true;

		if(m.swap)
			swapUV = swapUV ? false : true;
	}

	/*
	 *	Debug
	 */
	public function Print()
	{
		var str : String = "Axis: " + projectionAxis + "\n" +
			"Use World Space: " + useWorldSpace + "\n" +
			"Flip U: " + flipU + "\n" +
			"Flip V: " + flipV + "\n" +
			"Swap UV: " + swapUV + "\n" +
			"Normalize: " + normalizeUVs + "\n" +
			"UV2 ?: " + generateUV2 + "\n" +
			"Scale: " + scale + "\n" +
			"Offset: " + offset + "\n" +
			"Rotation: " + rotation + "\n";
		Debug.Log("UV Settings\n" + str);
	}
}

#endif