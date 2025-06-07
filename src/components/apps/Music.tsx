"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import spotifyApi from "@/lib/spotify";
import { FaPlay, FaPause, FaSearch } from "react-icons/fa";

export default function MusicApp() {
  const [token, setToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [playingTrack, setPlayingTrack] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const tokenFromStorage = localStorage.getItem("spotify_token");

    if (hash && !tokenFromStorage) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const _token = params.get("access_token");
      if (_token) {
        localStorage.setItem("spotify_token", _token);
        setToken(_token);
        spotifyApi.setAccessToken(_token);
      }
      window.location.hash = "";
    } else if (tokenFromStorage) {
      setToken(tokenFromStorage);
      spotifyApi.setAccessToken(tokenFromStorage);
    }
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await spotifyApi.getUserPlaylists();
        console.log({ data });
        setPlaylists(data.items);
      } catch (err: any) {
        console.log({ err });
        console.log(err.status);
        err.status == 401 && handleLogin();
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  const handleLogin = () => {
    const CLIENT_ID = "cd0028742e934e208e089105c84c97cc";
    const REDIRECT_URI = `${window.location.origin}/callback`;
    const scopes = [
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "playlist-read-private",
    ];

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;

    window.location.href = authUrl;
  };

  const handleSelectPlaylist = async (playlist: any) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    try {
      const data = await spotifyApi.getPlaylistTracks(playlist.id);
      setTracks(data.items);
    } catch (err) {
      console.error("Error fetching playlist tracks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await spotifyApi.searchTracks(searchQuery, { limit: 20 });
      setSearchResults(results.tracks.items);
    } catch (err) {
      console.error("Error searching tracks:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const togglePlay = (track: any) => {
    if (playingTrack?.id === track.id) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(track);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#121212] text-white">
      {!token ? (
        <div className="flex items-center justify-center h-full">
          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-lg transition duration-200"
          >
            Login with Spotify
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs..."
              className="w-full p-3 pl-10 bg-[#1e1e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 " />
          </form>

          {isSearching ? (
            <p className="text-gray-300 animate-pulse">Searching...</p>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Search Results</h2>
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between bg-[#1e1e1e] p-4 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-gray-400">
                        {track.artists.map((a: any) => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePlay(track)}
                    className="text-green-400 hover:text-green-300"
                  >
                    {playingTrack?.id === track.id ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
              ))}
            </div>
          ) : selectedPlaylist ? (
            <div>
              <button
                onClick={() => {
                  setSelectedPlaylist(null);
                  setTracks([]);
                  setPlayingTrack(null);
                }}
                className="text-sm text-green-400 mb-4 hover:underline"
              >
                ← Back to Playlists
              </button>

              <h2 className="text-2xl font-bold mb-4">
                {selectedPlaylist.name}
              </h2>

              {loading ? (
                <p className="text-gray-300 animate-pulse">Loading tracks...</p>
              ) : (
                <div className="space-y-3 mb-24">
                  {tracks.map((item) => {
                    const track = item.track;
                    return (
                      <div
                        key={track.id}
                        className="flex items-center justify-between bg-[#1e1e1e] p-4 rounded-md"
                      >
                        <div>
                          <p className="font-medium">{track.name}</p>
                          <p className="text-sm text-gray-400">
                            {track.artists.map((a: any) => a.name).join(", ")}
                          </p>
                        </div>
                        <button
                          onClick={() => togglePlay(track)}
                          className="text-green-400 hover:text-green-300"
                        >
                          {playingTrack?.id === track.id ? (
                            <FaPause />
                          ) : (
                            <FaPlay />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Your Playlists</h2>
                <p className="text-sm text-gray-400">
                  Click any playlist to view and play its songs
                </p>
              </div>

              {loading ? (
                <p className="text-gray-300 animate-pulse">
                  Loading playlists...
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-all duration-200 cursor-pointer"
                      onClick={() => handleSelectPlaylist(playlist)}
                    >
                      <Image
                        src={playlist.images?.[0]?.url}
                        alt={playlist.name}
                        width={300}
                        height={300}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="text-sm font-medium truncate">
                          {playlist.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {playlist.tracks?.total || 0} songs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {playingTrack && (
            <div className="fixed bottom-4 left-4 right-4 bg-[#2a2a2a] rounded-lg flex items-center justify-between p-2 shadow-lg">
              <div className="flex items-center space-x-3">
                <Image
                  src={playingTrack.album.images[0]?.url}
                  alt={playingTrack.name}
                  width={50}
                  height={50}
                  className="rounded"
                />
                <div>
                  <p className="text-sm font-medium">{playingTrack.name}</p>
                  <p className="text-xs text-gray-400">
                    {playingTrack.artists.map((a: any) => a.name).join(", ")}
                  </p>
                </div>
              </div>
              <iframe
                src={`https://open.spotify.com/embed/track/${playingTrack.id}`}
                className="w-[300px] h-20 rounded-2xl cursor-pointer"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
