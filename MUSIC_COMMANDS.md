# 🎵 Music Bot Commands - Complete Guide

## 🎯 Overview
This music bot now features **30+ commands** with advanced playback controls, audio filters, queue management, and interactive UI elements.

---

## 📋 Basic Playback Commands

### `/play <query> [source]`
Play a song from YouTube, Spotify, SoundCloud, or other sources.
- **query**: Song name or URL (required)
- **source**: Preferred search source (optional) - Auto, YouTube, Spotify, SoundCloud
- **Features**: 
  - Multi-platform support (YouTube, Spotify, SoundCloud)
  - Playlist support
  - Enhanced embeds with song info
  - Queue position tracking

### `/search <query> [results]`
Search for songs and choose which one to play from an interactive menu.
- **query**: Song name to search for (required)
- **results**: Number of results to show 1-10 (optional, default: 5)
- **Features**: 
  - Interactive select menu
  - Preview multiple results
  - 60-second selection timeout

### `/playnext <query>`
Add a song to play immediately after the current track.
- **query**: Song name or URL (required)
- Bypasses the queue and plays next

### `/pause`
Pause the current song.

### `/resume`
Resume playback if paused.

### `/skip`
Skip the currently playing song.

### `/stop`
Stop playback and clear the queue.

### `/back`
Play the previous song from history.

### `/replay`
Replay the current song from the beginning.

---

## 🎚️ Queue Management

### `/queue [page]`
Display the current music queue with pagination.
- **page**: Page number to view (optional)
- **Features**:
  - Paginated display (10 songs per page)
  - Shows total duration
  - Displays volume and loop mode
  - Interactive pagination buttons
  - Clickable song links

### `/shuffle`
Randomize the order of songs in the queue.

### `/clear`
Remove all songs from the queue.

### `/remove <position>`
Remove a specific song from the queue.
- **position**: Position of the song (1, 2, 3...)

### `/move <from> <to>`
Move a song to a different position in the queue.
- **from**: Current position of the song
- **to**: New position for the song

### `/jump <position>` / `/skipto <position>`
Skip to a specific song in the queue.
- **position**: Position of the song to jump to

---

## 🎛️ Audio Controls

### `/volume <level>`
Adjust the playback volume.
- **level**: Volume level 1-150 (default: 50)

### `/seek <time>`
Jump to a specific time in the current song.
- **time**: Time to seek to (formats: "1:30", "90", "2:15:30")
- Examples: `/seek 1:30` or `/seek 90`

### `/speed <rate>`
Change the playback speed.
- **rate**: Playback speed 0.5-3.0 (0.5 = half speed, 2.0 = double speed)
- Examples: `/speed 1.5` for 1.5x speed

---

## 🎨 Audio Filters & Effects

### `/filters <filter>`
Apply audio filters to enhance your music.
- **Available Filters**:
  - **None**: Clear all filters
  - **Bassboost**: Enhanced bass
  - **Nightcore**: Faster, higher pitch
  - **Vaporwave**: Slower, lower pitch
  - **8D Audio**: Surround sound effect
  - **Karaoke**: Reduce vocals
  - **Tremolo**: Trembling effect
  - **Vibrato**: Vibrating effect
  - **Reverse**: Reverse playback
  - **Treble**: Enhanced high frequencies
  - **Normalizer**: Normalize audio levels
  - **Surrounding**: 3D audio effect

### `/equalizer <preset>`
Apply equalizer presets for different music genres.
- **Available Presets**:
  - **Flat**: Default (no EQ)
  - **Bass Boost**: Enhanced bass frequencies
  - **Treble Boost**: Enhanced high frequencies
  - **Pop**: Optimized for pop music
  - **Rock**: Optimized for rock music
  - **Classical**: Optimized for classical music
  - **Jazz**: Optimized for jazz music
  - **Electronic**: Optimized for electronic music
  - **Full Bass**: Maximum bass enhancement
  - **Soft**: Gentle, soft sound

---

## 🔁 Loop & Repeat

### `/loop <mode>`
Set loop/repeat mode for the queue.
- **Modes**:
  - **Off**: No looping
  - **Track**: Repeat current song
  - **Queue**: Repeat entire queue
  - **Autoplay**: Play similar songs automatically

---

## 📊 Information & Display

### `/nowplaying`
Display detailed information about the current song.
- **Features**:
  - Song title, artist, duration
  - Progress bar with timestamp
  - Volume and loop mode
  - Queue length
  - Interactive control buttons (Pause, Skip, Stop, Shuffle)
  - Direct link to song

### `/history`
View the last 10 songs that were played.

### `/lyrics [song]`
Fetch lyrics for the current or a specified song.
- **song**: Song name (optional, uses current song if not specified)

### `/lyrics-search <artist> <song>`
Search for lyrics by artist and song name.
- **artist**: Artist name (required)
- **song**: Song title (required)
- More accurate than `/lyrics` when you know both artist and song

### `/grab`
Save the current song to your DMs.
- Sends song details and link directly to your DMs

---

## 🎮 Interactive Features

### Button Controls
The `/nowplaying` command includes interactive buttons:
- **⏸️ Pause/▶️ Resume**: Toggle playback
- **⏭️ Skip**: Skip to next song
- **⏹️ Stop**: Stop playback
- **🔀 Shuffle**: Shuffle the queue
- **🔗 Open in Browser**: Direct link to the song

### Queue Pagination
The `/queue` command includes navigation buttons:
- **⏮️ First**: Jump to first page
- **◀️ Previous**: Previous page
- **▶️ Next**: Next page
- **⏭️ Last**: Jump to last page

### Search Selection
The `/search` command provides an interactive dropdown menu to select from search results.

---

## 🎯 Pro Tips

1. **Use `/search` instead of `/play`** when you want to preview multiple results before choosing
2. **Use `/playnext`** to queue important songs without waiting
3. **Combine filters** by applying multiple effects (some may conflict)
4. **Use `/grab`** to save songs you like for later
5. **Enable autoplay** with `/loop autoplay` for continuous music
6. **Adjust volume** to 80-100 for louder playback, 30-50 for background music
7. **Use `/seek`** to skip intros or jump to your favorite part
8. **Try different equalizer presets** to find the best sound for your music genre

---

## 🔧 Technical Features

- **Multi-platform support**: YouTube, Spotify, SoundCloud, and more
- **Playlist support**: Add entire playlists at once
- **History tracking**: Go back to previously played songs
- **Auto-disconnect**: Bot leaves after 5 minutes of inactivity
- **High-quality audio**: Optimized for best sound quality
- **Error handling**: Comprehensive error messages and recovery
- **Interactive UI**: Buttons, menus, and pagination for better UX
- **Cooldown protection**: Prevents command spam

---

## 📝 Command Summary

**Total Commands**: 30+

**Categories**:
- ✅ Basic Playback: 10 commands
- ✅ Queue Management: 7 commands
- ✅ Audio Controls: 3 commands
- ✅ Filters & Effects: 3 commands
- ✅ Information: 5 commands
- ✅ Interactive Features: Multiple UI elements

---

## 🎉 What's New

### Major Enhancements:
1. **Interactive Search** - Choose from multiple search results
2. **Audio Filters** - 12 different audio effects
3. **Equalizer Presets** - 10 genre-specific presets
4. **Speed Control** - Adjust playback speed (0.5x - 3.0x)
5. **Enhanced Queue** - Pagination, clickable links, better formatting
6. **Interactive Controls** - Buttons for common actions
7. **Song History** - Track and replay previous songs
8. **Grab Feature** - Save songs to DMs
9. **Play Next** - Priority queue insertion
10. **Seek Function** - Jump to any timestamp
11. **Move Command** - Reorder queue items
12. **Back Command** - Play previous songs
13. **Replay Command** - Restart current song
14. **Enhanced Play** - Multi-source support with better embeds

---

## 🚀 Getting Started

1. Join a voice channel
2. Use `/play <song name>` to start playing music
3. Use `/queue` to see what's coming up
4. Use `/nowplaying` for interactive controls
5. Explore filters with `/filters` and `/equalizer`
6. Try `/search` for more control over song selection

Enjoy your enhanced music experience! 🎵🎉
