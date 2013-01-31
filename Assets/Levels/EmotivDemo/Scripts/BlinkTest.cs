using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using Emotiv;

class BlinkTest : MonoBehaviour {

    EmoState emoState;

    void Start()
    {
        // In order to expose the delegates, we must ensure that connect() has been called before we attempt to add event handler.
        //EmotivHandler.getEmoEngine().ExpressivEmoStateUpdated += new EmoEngine.ExpressivEmoStateUpdatedEventHandler(emoStateUpdated);
    }

    void Update() {

        if (Input.GetKeyUp("u"))
        {
            EmotivHandler.getEmoEngine().ExpressivEmoStateUpdated += new EmoEngine.ExpressivEmoStateUpdatedEventHandler(emoStateUpdated);
        }

        if (emoState != null)
        {
            Debug.Log("BlinkTest: User has lower face expression : " + emoState.ExpressivGetLowerFaceAction().ToString() + " of strength " + emoState.ExpressivGetLowerFaceActionPower().ToString());
        }

    }

    void emoStateUpdated(object sender, EmoStateUpdatedEventArgs args)
    {

        emoState = args.emoState;

        Debug.Log("BlinkTest: ExpressiveEmoStateUpdated");


    }
}

