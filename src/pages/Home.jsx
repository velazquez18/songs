import React, { useState, useEffect } from 'react';

const songFiles = import.meta.glob('../assets/music/*.mp3', { eager: true, query: '?url', import: 'default' });

const coverFiles = import.meta.glob('../assets/cov/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });

const colorPalettes = [
    { from: 'from-blue-600', to: 'to-blue-900', color: 'bg-blue-600' },
    { from: 'from-red-600', to: 'to-red-900', color: 'bg-red-600' },
    { from: 'from-emerald-600', to: 'to-emerald-900', color: 'bg-emerald-600' },
    { from: 'from-amber-600', to: 'to-orange-900', color: 'bg-amber-600' },
    { from: 'from-purple-600', to: 'to-purple-900', color: 'bg-purple-600' },
    { from: 'from-pink-600', to: 'to-pink-900', color: 'bg-pink-600' },
    { from: 'from-cyan-600', to: 'to-cyan-900', color: 'bg-cyan-600' },
    { from: 'from-indigo-600', to: 'to-indigo-900', color: 'bg-indigo-600' },
    { from: 'from-rose-600', to: 'to-rose-900', color: 'bg-rose-600' },
    { from: 'from-teal-600', to: 'to-teal-900', color: 'bg-teal-600' },
];

const generateSongsList = () => {
    const availableCovers = Object.keys(coverFiles).map(path => {
        const fileName = path.split('/').pop().toLowerCase();
        return {
            path,
            url: coverFiles[path],
            fileName
        };
    });

    return Object.keys(songFiles).map((path, index) => {
        const url = songFiles[path];
        const fileName = path.split('/').pop().replace('.mp3', '');

        let artist = 'Desconocido';
        let title = fileName;

        if (fileName.includes(' - ')) {
            const parts = fileName.split(' - ');
            artist = parts[0];
            title = parts[1];
        }
        const lowerTitle = title.toLowerCase().trim();
        const lowerFileName = fileName.toLowerCase().trim();

        const matchedCover = availableCovers.find(cover =>
            cover.fileName.includes(lowerTitle) ||
            cover.fileName.includes(lowerFileName)
        );

        const coverUrl = matchedCover
            ? matchedCover.url
            : `https://picsum.photos/seed/${index + 100}/300/300`;

        const palette = colorPalettes[index % colorPalettes.length];

        return {
            id: index,
            title: title,
            artist: artist,
            coverUrl: coverUrl,
            audioUrl: url,
            ...palette
        };
    });
};

const songs = generateSongsList();

const MusicGallery = () => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef(null);

    useEffect(() => {
        if (currentSong) {
            setIsPlaying(true);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.error("Play error:", e));
                }
            }, 0);
        }
    }, [currentSong]);

    const handlePlaySong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
        } else {
            setCurrentSong(song);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Resume error:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans pb-32">
            {/* Header */}
            <div className="container mx-auto px-6 py-12">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 pr-1">
                            US
                        </span>
                    </h1>
                    <p className="text-neutral-500">
                        {songs.length} Canciones
                    </p>
                </header>

                {/* Grid de Canciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {songs.map((song) => (
                        <div
                            key={song.id}
                            onClick={() => handlePlaySong(song)}
                            className="group relative cursor-pointer"
                        >
                            {/* El Recuadro (Marco) */}
                            <div className={`
                                relative h-full rounded-3xl p-4
                                bg-gradient-to-br ${song.fromColor} ${song.toColor}
                                bg-opacity-20 backdrop-blur-sm border border-white/10
                                shadow-xl transition-all duration-300
                                group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]
                                overflow-hidden flex flex-col
                            `}>
                                {/* Efecto Glow Detrás */}
                                <div className={`absolute inset-0 ${song.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>

                                {/* Contenedor de la Imagen */}
                                <div className="relative rounded-2xl overflow-hidden shadow-inner mb-4 aspect-square bg-black/20 shrink-0">
                                    <img
                                        src={song.coverUrl}
                                        alt={song.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    {/* Overlay Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[1px]">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                                            {currentSong?.id === song.id && isPlaying ? (
                                                <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Info de la canción */}
                                <div className="text-center relative z-10 flex-1 flex flex-col justify-center">
                                    <h3 className="text-lg font-bold text-white truncate drop-shadow-md px-1" title={song.title}>
                                        {song.title}
                                    </h3>
                                    <p className="text-sm text-white/80 font-medium truncate px-1" title={song.artist}>
                                        {song.artist}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reproductor Player Bar */}
            <div className={`fixed bottom-0 left-0 right-0 p-4 z-50 transition-transform duration-500 ${currentSong ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="max-w-3xl mx-auto bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                    <audio ref={audioRef} src={currentSong?.audioUrl} autoPlay className="hidden" onError={(e) => console.log('Audio error:', e)} />
                    {currentSong && (
                        <>
                            <img src={currentSong.coverUrl} className="w-12 h-12 rounded-lg object-cover shadow-md" alt="" />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm truncate">{currentSong.title}</h4>
                                <p className="text-neutral-400 text-xs truncate">{currentSong.artist}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={togglePlay} className="p-2 text-white hover:text-cyan-400 transition">
                                    {isPlaying ? (
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                    ) : (
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicGallery;