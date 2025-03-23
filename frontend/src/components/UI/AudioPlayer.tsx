import React, { useEffect, useRef } from "react";

const AudioPlayer: React.FC<{ streamUrl: string }> = ({ streamUrl }) => {
   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.src = streamUrl;
         audioRef.current.play().catch(console.error);
      }
   }, [streamUrl]);

   return <audio ref={audioRef} controls className="queue__curr-playing__audio"/>;
};
export default AudioPlayer;