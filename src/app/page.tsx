import PageContent from "@/components"

export default function PageHome() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <div className="fixed inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-container relative w-full max-w-7xl h-full bg-black/40 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
            <PageContent />
          </div>
        </div>
      </div>
    </div>
  )
}
