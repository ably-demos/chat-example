import Chat from "@/components/Chat"
import NavBar from "@/components/NavBar"

export default async function Home() {
  let userId = "1234"

  return (
    <div className="flex flex-col h-screen w-screen">
      <NavBar />
      <main className="flex grow space-y-5 justify-center items-center">
        <div className="flex flex-col lg:flex-row lg:max-w-7xl w-screen h-128 m-2">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full max-w-screen-lg aspect-video"
          ></iframe>
          <div className="w-96 flex">
            <Chat userId={userId} />
          </div>
        </div>
      </main>
    </div>
  )
}


