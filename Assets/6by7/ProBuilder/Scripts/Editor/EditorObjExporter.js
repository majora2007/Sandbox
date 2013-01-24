/*
  This script may be found on the Unify Wiki, here: http://wiki.unity3d.com/index.php?title=ObjExporter

  Based on ObjExporter.cs, this "wrapper" lets you export to .OBJ directly from the editor menu.
   
  This should be put in your "Editor"-folder. Use by selecting the objects you want to export, and select
  the appropriate menu item from "Custom->Export". Exported models are put in a folder called
  "ExportedObj" in the root of your Unity-project. Textures should also be copied and placed in the
  same folder.
  N.B. there may be a bug so if the custom option doesn't come up refer to this thread http://answers.unity3d.com/questions/317951/how-to-use-editorobjexporter-obj-saving-script-fro.html

  Translated to JS for ProBuilder @khenkel
*/

import System.Collections.Generic;
import System.IO;
import System.Text;
import System;

public class ObjMaterial
{
	var name : String;
	var textureName : String;
}
 
public class EditorObjExporter extends ScriptableObject
{
	private static var vertexOffset : int = 0;
	private static var normalOffset : int= 0;
	private static var uvOffset : int = 0;
 
 
	//User should probably be able to change this. It is currently left as an excercise for
	//the reader.
	private static var targetFolder : String = "ExportedObj";
 
 
    private static function MeshToString(mf : MeshFilter, materialList : Dictionary.<String, ObjMaterial>, iteration : int) : String
    {
    	// Early out if not visible geometry
    	if(!mf.GetComponent.<MeshRenderer>())
    		return;

        var m : Mesh = mf.sharedMesh;
        var mats : Material[] = mf.renderer.sharedMaterials;
 
        var sb : StringBuilder = new StringBuilder();
 
        sb.Append("g ").Append(mf.name + iteration).Append("\n");
        for(var lv : Vector3 in m.vertices) 
        {
        	var wv : Vector3 = mf.transform.TransformPoint(lv);
 
        	//This is sort of ugly - inverting x-component since we're in
        	//a different coordinate system than "everyone" is "used to".
            sb.Append(String.Format("v {0} {1} {2}\n",-wv.x,wv.y,wv.z));
        }
        sb.Append("\n");
 
        for(var lv : Vector3 in m.normals) 
        {
        	var wb = mf.transform.TransformDirection(lv);
 
            sb.Append(String.Format("vn {0} {1} {2}\n",-wb.x,wb.y,wb.z));
        }
        sb.Append("\n");
 
        for(var v : Vector3 in m.uv) 
        {
            sb.Append(String.Format("vt {0} {1}\n",v.x,v.y));
        }
 
        for (var material : int = 0; material < m.subMeshCount; material ++) {
            sb.Append("\n");
            sb.Append("usemtl ").Append(mats[material].name).Append("\n");
            sb.Append("usemap ").Append(mats[material].name).Append("\n");
 
            //See if this material is already in the materiallist.
            try {
				var objMaterial : ObjMaterial = new ObjMaterial();
 
          		objMaterial.name = mats[material].name;
 
          		if (mats[material].mainTexture)
          			objMaterial.textureName = AssetDatabase.GetAssetPath(mats[material].mainTexture);
          		else 
          			objMaterial.textureName = null;
 
          		materialList.Add(objMaterial.name, objMaterial);
        	} catch (except : ArgumentException) {
            	//Already in the dictionary
        	}
 
 
			var triangles : int[] = m.GetTriangles(material);
			for (var i : int = 0; i < triangles.Length; i += 3) 
			{
				//Because we inverted the x-component, we also needed to alter the triangle winding.
			    sb.Append(String.Format("f {1}/{1}/{1} {0}/{0}/{0} {2}/{2}/{2}\n", 
			        triangles[i]+1 + vertexOffset, triangles[i+1]+1 + normalOffset, triangles[i+2]+1 + uvOffset));
			}
        }
 
        vertexOffset += m.vertices.Length;
        normalOffset += m.normals.Length;
        uvOffset += m.uv.Length;
 
        return sb.ToString();
    }
 
    private static function Clear() : void
    {
    	vertexOffset = 0;
    	normalOffset = 0;
    	uvOffset = 0;
    }
 
   	private static function PrepareFileWrite() :  Dictionary.<String, ObjMaterial>
   	{
   		Clear();
 
    	return new Dictionary.<String, ObjMaterial>();
   	}
 
   	private static function MaterialsToFile(materialList : Dictionary.<String, ObjMaterial>, folder : String, filename : String) : void
   	{
   		var sw : StreamWriter = new StreamWriter(folder + "/" + filename + ".mtl");

		for(var kvp : KeyValuePair.<String, ObjMaterial> in materialList )
		{
			sw.Write("\n");
			sw.Write("newmtl {0}\n", kvp.Key);
			sw.Write("Ka  0.6 0.6 0.6\n");
			sw.Write("Kd  0.6 0.6 0.6\n");
			sw.Write("Ks  0.9 0.9 0.9\n");
			sw.Write("d  1.0\n");
			sw.Write("Ns  0.0\n");
			sw.Write("illum 2\n");

			if (kvp.Value.textureName != null)
			{
				var destinationFile : String = kvp.Value.textureName;


				var stripIndex : int = destinationFile.LastIndexOf('/');//FIXME: Should be Path.PathSeparator;

        if (stripIndex >= 0)
          destinationFile = destinationFile.Substring(stripIndex + 1).Trim();

				var relativeFile : String = destinationFile;

				destinationFile = folder + "/" + destinationFile;

        //Copy the source file
        if(!File.Exists(destinationFile))
          File.Copy(kvp.Value.textureName, destinationFile);
        
				sw.Write("map_Kd {0}", relativeFile);
			}

			sw.Write("\n\n\n");
		}

		sw.Flush();
		sw.Close();
   	}
 
    public static function MeshesToFile(mf : MeshFilter[], folder : String, filename : String) : void
    {
    	var folderCreated : boolean = false;
    	if(!Directory.Exists(folder))
    		folderCreated = CreateTargetFolder(folder);
    	else 
    		folderCreated = true;

    	if(!folderCreated)
    		return;

    	var materialList : Dictionary.<String, ObjMaterial> = PrepareFileWrite();
 
 		var sw : StreamWriter = new StreamWriter(folder +"/" + filename + ".obj");
        
        sw.Write("mtllib ./" + filename + ".mtl\n");

		for(var i : int = 0; i < mf.Length; i++)
		{
			sw.Write(MeshToString(mf[i], materialList, i));
		}

 		sw.Flush();
 		sw.Close();

        MaterialsToFile(materialList, folder, filename);
    }
 
    private static function CreateTargetFolder(folder : String) : boolean
    {
    	try {
    		System.IO.Directory.CreateDirectory(folder);
    	} catch (e : ArgumentException) {
    		EditorUtility.DisplayDialog("Error!", "Failed to create target folder!", "");
    		return false;
    	}
 
    	return true;
    } 
}