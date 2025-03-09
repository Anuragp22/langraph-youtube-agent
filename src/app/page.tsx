"use client";

import Image from "next/image";
import { useState } from "react";
import { transcribe } from "./actions";

export default function Home() {
  type Video = {
    videoId: string;
    title: string;
    description: string;
    transcript: string | { text: string; start: number; dur: number }[];
  };

  const [videoUrl, setVideoUrl] = useState("");
  const [video, setVideo] = useState<Video>();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");

  async function transcribeVideo() {
    if (!videoUrl) return;

    setIsLoading(true);
    try {
      const result = await transcribe(videoUrl);
      const parsedResult = JSON.parse(result as string) as Video;

      if (parsedResult?.videoId) {
        setVideo(parsedResult);
      }
    } catch (error) {
      console.error("Failed to parse video data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Simple Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <Image
              width={32}
              height={32}
              src="/video-player.svg"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="font-semibold text-xl text-blue-600">YouTube Transcriber</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {!video ? (
          /* Input Section */
          <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-6 max-w-2xl">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Convert YouTube Videos to Text
                </h1>
                <p className="text-gray-600">
                  Get accurate transcripts from any YouTube video with a single click
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="mb-6">
                  <label htmlFor="video-link" className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video URL
                  </label>
                  <input
                    id="video-link"
                    name="video-link"
                    type="text"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <button
                  type="submit"
                  onClick={transcribeVideo}
                  disabled={isLoading || !videoUrl}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Transcribing...
                    </span>
                  ) : "Get Transcript"}
                </button>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Simply paste a YouTube URL and click the button above</p>
                </div>
              </div>

              {/* <div className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center bg-blue-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">Fast Processing</h3>
                    <p className="text-gray-600 text-sm">Get transcripts quickly</p>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center bg-blue-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">Accurate Results</h3>
                    <p className="text-gray-600 text-sm">High-quality transcription</p>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center bg-blue-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">Easy Access</h3>
                    <p className="text-gray-600 text-sm">Copy or download results</p>
                  </div>
                </div>
              </div> */}
            </div>
          </section>
        ) : (
          /* Results Section */
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl mx-auto">
                <div className="lg:flex">
                  {/* Video Column */}
                  <div className="lg:w-1/2 p-6">
                    <div className="aspect-video w-full mb-6 rounded-lg overflow-hidden shadow-md">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${video.videoId}?controls=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>

                    <h1 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                      {video.title}
                    </h1>

                    <div className="flex space-x-2 mb-4">
                      <button
                        onClick={() => setActiveTab("transcript")}
                        className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${activeTab === "transcript"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                      >
                        Transcript
                      </button>
                      <button
                        onClick={() => setActiveTab("description")}
                        className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${activeTab === "description"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                      >
                        Description
                      </button>
                    </div>

                    <button
                      onClick={() => setVideo(undefined)}
                      className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Try Another Video
                    </button>
                  </div>

                  {/* Transcript/Description Column */}
                  <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-200">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {activeTab === "transcript" ? "Video Transcript" : "Video Description"}
                        </h2>

                        {activeTab === "transcript" && (
                          <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </button>
                        )}
                      </div>

                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                        {activeTab === "transcript" && video?.transcript && (
                          <div className="h-[450px] overflow-y-auto pr-2">
                            {typeof video.transcript === 'string' ? (
                              <p className="whitespace-pre-line leading-relaxed text-gray-700">
                                {video.transcript}
                              </p>
                            ) : (
                              <ul className="space-y-2">
                                {video.transcript.map((item, index) => (
                                  <li key={index} className="hover:bg-white rounded p-1 transition-colors">
                                    <div className="flex items-start">
                                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-3 font-mono whitespace-nowrap">
                                        {new Date(item.start * 1000).toISOString().substr(14, 5)}
                                      </span>
                                      <span className="text-gray-700">{item.text}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {activeTab === "description" && (
                          <div className="h-[450px] overflow-y-auto pr-2">
                            {video.description.split('\n').map((line, i) => (
                              <p key={i} className="mb-2 text-gray-700">{line || "\u00A0"}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}