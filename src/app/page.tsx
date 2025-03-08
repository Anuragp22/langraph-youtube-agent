import Image from "next/image";

export default function Home() {
  return <div className="flex flex-col h-full bg-gray-800">
    <header className="bg-indigo-500 p-2">
      <div className="flex lg:flex-1 items-center justify-center">
        <a href="#" className="m-1.5">
          <span className="sr-only">LangGraph YouTube Transcribe Agent</span>
          <Image
            width={24}
            height={24}
            className="h-8 w-auto color-white"
            src="http://localhost:3000/video-player.svg"
            alt=""
          />
        </a>
        <h1 className="text-black font-bold">YouTube Transcribe Agent</h1>
      </div>
    </header>
    <div>
      <div className="flex my-8 mx-40">
        <label htmlFor="email-address" className="sr-only"> Email address </label>
        <input
          id="video-link"
          name="vide-link"
          type="text"
          required
          className="w-full mr-4 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          placeholder="Enter a YouTube video link"
        />
        <button
          type="submit"
          className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Let&apos;s go
        </button>
      </div>
    </div>
    <div className="flex flex-col my-8 lg:mx-40 mx-8">
      <h1 className="text-2xl font-bold tracking-tight text-white mb-4">
        Retrieved video
      </h1>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/xBSMBEowLcY?controls=0"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <div className="mt-4 text-white">
        <h2 className="font-bold text-lg mb-2">Description</h2>
        <p className="text-sm">Lorem ipsum...</p>
      </div>
    </div>
  </div>;
}