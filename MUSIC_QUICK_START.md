# 🎵 Music Bot - Quick Start Guide

## 🚀 Getting Started in 30 Seconds

### 1. Join a Voice Channel
First, join any voice channel in your Discord server.

### 2. Play Your First Song
```
/play never gonna give you up
```

### 3. View the Queue
```
/queue
```

### 4. Control Playback
```
/nowplaying
```
Then use the interactive buttons to control playback!

---

## 🎯 Common Use Cases

### Just Want to Listen to Music?
```
/play <song name>
/volume 70
/loop queue
```

### Want to Build a Playlist?
```
/play song 1
/play song 2
/play song 3
/queue
/shuffle
```

### Want Better Sound Quality?
```
/play <song>
/equalizer rock
/filters bassboost
/volume 90
```

### Want to Search First?
```
/search bohemian rhapsody results:10
```
Then select from the dropdown menu!

### Want to Skip Around?
```
/seek 2:30          (jump to 2 minutes 30 seconds)
/jump 5             (jump to song #5 in queue)
/back               (go to previous song)
```

---

## 🎨 Pro Tips for Best Experience

### 1. Use Search for Accuracy
Instead of `/play`, use `/search` to preview results:
```
/search stairway to heaven results:5
```
This shows you 5 options to choose from!

### 2. Build Queue Smartly
Use `/playnext` for important songs:
```
/play background music 1
/play background music 2
/playnext YOUR FAVORITE SONG    ← This plays next!
```

### 3. Optimize Audio
Try different combinations:
```
For EDM/Electronic:
/equalizer electronic
/filters bassboost
/volume 85

For Rock:
/equalizer rock
/volume 80

For Chill Music:
/equalizer soft
/volume 50
```

### 4. Manage Long Queues
```
/queue page:1       (view first page)
/queue page:5       (jump to page 5)
/move from:20 to:2  (move song to front)
/remove 15          (remove song #15)
```

### 5. Save Your Favorites
```
/grab
```
This sends the current song to your DMs!

---

## 🎮 Interactive Features Guide

### Now Playing Buttons
When you use `/nowplaying`, you get these buttons:
- **⏸️ Pause** - Pause the music
- **⏭️ Skip** - Skip to next song
- **⏹️ Stop** - Stop and clear queue
- **🔀 Shuffle** - Randomize queue
- **🔗 Open** - Open song in browser

### Queue Pagination
When you use `/queue` with many songs:
- **⏮️ First** - Jump to first page
- **◀️ Previous** - Go back one page
- **▶️ Next** - Go forward one page
- **⏭️ Last** - Jump to last page

### Search Selection
When you use `/search`:
1. Bot shows you multiple results
2. Click the dropdown menu
3. Select your preferred song
4. Bot adds it to queue!

---

## 🎛️ Audio Enhancement Guide

### Filters Explained

**Bassboost** - More bass, great for EDM/Hip-Hop
```
/filters bassboost
```

**Nightcore** - Faster + higher pitch, anime vibes
```
/filters nightcore
```

**Vaporwave** - Slower + lower pitch, chill aesthetic
```
/filters vaporwave
```

**8D Audio** - Surround sound effect (use headphones!)
```
/filters 8d
```

**Karaoke** - Reduces vocals, sing along!
```
/filters karaoke
```

**Clear All Filters**
```
/filters none
```

### Equalizer Presets

**Bass Boost** - Enhanced low frequencies
```
/equalizer bass
```

**Rock** - Optimized for rock music
```
/equalizer rock
```

**Electronic** - Perfect for EDM/techno
```
/equalizer electronic
```

**Classical** - Balanced for orchestral music
```
/equalizer classical
```

**Flat** - Reset to default
```
/equalizer flat
```

### Speed Control

**Slow Down (0.5x - 0.9x)**
```
/speed 0.75    (75% speed, slowed down)
```

**Speed Up (1.1x - 3.0x)**
```
/speed 1.5     (150% speed, faster)
```

**Reset to Normal**
```
/speed 1.0
```

---

## 🔁 Loop Modes Explained

### Off (Default)
```
/loop off
```
Plays through queue once and stops.

### Track
```
/loop track
```
Repeats the current song forever.

### Queue
```
/loop queue
```
Repeats the entire queue forever.

### Autoplay
```
/loop autoplay
```
Automatically plays similar songs when queue ends!

---

## 📋 Queue Management Cheat Sheet

| Action | Command | Example |
|--------|---------|---------|
| View queue | `/queue` | `/queue` |
| View page 3 | `/queue page:3` | `/queue page:3` |
| Shuffle | `/shuffle` | `/shuffle` |
| Clear all | `/clear` | `/clear` |
| Remove song | `/remove <pos>` | `/remove 5` |
| Move song | `/move <from> <to>` | `/move from:10 to:2` |
| Jump to song | `/jump <pos>` | `/jump 7` |
| Go back | `/back` | `/back` |
| View history | `/history` | `/history` |

---

## 🎵 Playback Control Cheat Sheet

| Action | Command | Example |
|--------|---------|---------|
| Play song | `/play <query>` | `/play despacito` |
| Search first | `/search <query>` | `/search bohemian rhapsody` |
| Play next | `/playnext <query>` | `/playnext my favorite song` |
| Pause | `/pause` | `/pause` |
| Resume | `/resume` | `/resume` |
| Skip | `/skip` | `/skip` |
| Stop | `/stop` | `/stop` |
| Replay | `/replay` | `/replay` |
| Seek | `/seek <time>` | `/seek 2:30` |
| Volume | `/volume <level>` | `/volume 80` |
| Speed | `/speed <rate>` | `/speed 1.25` |

---

## 🎨 Example Workflows

### Workflow 1: Party Mode
```
1. /play party playlist
2. /volume 100
3. /equalizer electronic
4. /filters bassboost
5. /loop queue
6. /shuffle
```

### Workflow 2: Study Session
```
1. /search lofi hip hop
2. /volume 40
3. /equalizer soft
4. /loop queue
```

### Workflow 3: Workout Mix
```
1. /play workout music
2. /volume 90
3. /equalizer bass
4. /speed 1.2
5. /loop queue
6. /shuffle
```

### Workflow 4: Karaoke Night
```
1. /search <song name>
2. /filters karaoke
3. /volume 70
4. /loop track
```

### Workflow 5: Discovery Mode
```
1. /play <artist name>
2. /loop autoplay
3. /grab (when you find a good song!)
```

---

## ❓ Troubleshooting

### Bot Not Playing?
1. Make sure you're in a voice channel
2. Check bot has permission to join/speak
3. Try `/stop` then `/play` again

### Audio Quality Issues?
1. Clear filters: `/filters none`
2. Reset EQ: `/equalizer flat`
3. Reset speed: `/speed 1.0`
4. Adjust volume: `/volume 50`

### Queue Not Working?
1. Check queue: `/queue`
2. Clear if needed: `/clear`
3. Start fresh: `/play <song>`

### Buttons Not Working?
1. Make sure you're in voice channel
2. Check music is playing
3. Try the text command instead

---

## 🎉 Have Fun!

You now have access to one of the most advanced Discord music bots!

**Key Features to Remember:**
- 🔍 Use `/search` for better song selection
- 🎚️ Try different `/equalizer` presets
- 🎨 Experiment with `/filters`
- 📋 Use `/grab` to save songs you like
- 🔁 Enable `/loop autoplay` for endless music

**Enjoy your music!** 🎵🎉
