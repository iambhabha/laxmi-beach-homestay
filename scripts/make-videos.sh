#!/usr/bin/env sh
# Re-encodes the source clips in assets-src/videos for the web: 720p portrait,
# 30 fps, original (noisy) audio replaced by the generated beach track.
# Run from the project root: sh scripts/make-videos.sh
set -e
node scripts/make-music.mjs 20 assets-src/beach-music.wav
for name in balcony-view night-parking; do
  src="assets-src/videos/$name.mp4"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  fadeout=$(awk "BEGIN{print $dur-1.5}")
  ffmpeg -v error -y -i "$src" -i assets-src/beach-music.wav \
    -map 0:v:0 -map 1:a:0 -t "$dur" \
    -vf "scale=720:1280:flags=lanczos,fps=30,format=yuv420p" \
    -c:v libx264 -preset slow -crf 27 -profile:v high -movflags +faststart \
    -af "afade=t=in:d=0.8,afade=t=out:st=$fadeout:d=1.5,loudnorm=I=-16:TP=-1.5:LRA=11" \
    -c:a aac -b:a 128k -ar 44100 \
    "public/videos/$name.mp4"
  ffmpeg -v error -y -ss 1 -i "public/videos/$name.mp4" -frames:v 1 -vf scale=720:-1 -c:v libwebp -quality 72 "public/videos/$name.webp"
  echo "$name done"
done
