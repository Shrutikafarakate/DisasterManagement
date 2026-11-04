export default function Training() {
  // 🎥 VIDEO TRAINING MODULES (Updated with working links)
  const modules = [
    {
      id: 1,
      title: "Protocol: START Triage",
      videoUrl: "https://www.youtube.com/embed/nfBJGeAdu5o",
      desc: "Learn the START method: Simple Triage and Rapid Treatment for mass casualty incidents."
    },
    {
      id: 2,
      title: "Protocol: Urban Search & Rescue",
      // Source: Fire and Rescue NSW (Official Demonstration)
      videoUrl: "https://www.youtube.com/embed/ibvpYRED45E",
      desc: "Overview of equipment and safety protocols for entering collapsed structures."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">

      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Training Center</h1>
        <p className="text-slate-400 font-medium">Acquire skills protocols via video modules.</p>
      </div>

      <div className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map(m => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="aspect-video w-full bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={m.videoUrl}
                  title={m.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white">{m.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}