import Sound from "react-native-sound";

import { logError } from "~/utils/";

Sound.setCategory("Playback");

// Load the sound file 'whoosh.mp3' from the app bundle
// See notes below about preloading sounds within initialization code below.
export const playSoundFile = (soundName: string) => {
  const whoosh = new Sound(soundName, Sound.MAIN_BUNDLE, error => {
    if (error) {
      logError(`failed to load the sound ${error}`);
      return;
    }
    Sound.setCategory("Ambient");
    // Play the sound with an onEnd callback
    whoosh.play(success => {
      if (success) {
      } else {
        logError(`playback failed due to audio decoding errors`);
      }
      Sound.setCategory("Playback");
    });
  });
};
