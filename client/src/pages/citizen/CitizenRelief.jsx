// export default function CitizenRelief() {
//   const shelters = [
//     { id: 1, name: "City Stadium Safe Zone", capacity: "High", status: "OPEN", loc: "Sector 4" },
//     { id: 2, name: "Community Hall B", capacity: "Full", status: "FULL", loc: "North District" },
//     { id: 3, name: "UNHCR Tent Camp Alpha", capacity: "Medium", status: "OPEN", loc: "Outskirts Hwy 9" },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">

//       {/* HEADER */}
//       <div className="mb-10 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
//         <div>
//           <h1 className="text-4xl font-black text-white tracking-tight mb-2">Emergency Shelter Access</h1>
//           <p className="text-slate-400 font-medium">Quickly locate shelters and relief services during emergencies.</p>
//         </div>
//       </div>

//       {/* SHELTER LOCATOR */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {shelters.map(s => (
//           <div key={s.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:border-slate-700 transition-colors">
//             <div className="flex justify-between mb-4">
//               <span className="text-3xl"></span>
//               <span className={`text-xs font-bold px-2 py-1 rounded h-fit ${s.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
//                 {s.status}
//               </span>
//             </div>
//             <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
//             <p className="text-slate-400 text-sm mb-4">Location: {s.loc}</p>
//             <div className="flex justify-between items-center text-xs text-slate-500 font-mono border-t border-slate-800 pt-4">
//               <span>Capacity: {s.capacity}</span>
//               <button className="text-blue-400 hover:text-blue-300 font-bold transition-colors">GET DIRECTIONS →</button>
//             </div>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }

export default function CitizenRelief() {

  // Real shelters (used as mock data)
  const shelters = [
   {
  id: 1,
  name: "Ambabai Vidyalaya",
  city: "Kolhapur",
  region: "Shahupuri",
  capacity: "High",
  status: "OPEN",
  lat: 16.7057,
  lng: 74.2433,
},

{
  id: 2,
  name: "Shramik Hall",
  city: "Kolhapur",
  region: "Subhash Road",
  capacity: "Medium",
  status: "OPEN",
  lat: 16.7005,
  lng: 74.2385,
},

{
  id: 3,
  name: "Ranade Vidyalaya",
  city: "Kolhapur",
  region: "Uttareshwar Peth",
  capacity: "Low",
  status: "OPEN",
  lat: 16.7035,
  lng: 74.2260,
},
  ];

  // Open Google Maps
  const openInGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in-up">

      {/* HEADER */}
      <div className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Emergency Shelter Locator
        </h1>
        <p className="text-slate-400 font-medium">
          Verified shelters across India for immediate safety and relief.
        </p>
      </div>

      {/* SHELTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shelters.map((shelter) => (
          <div
            key={shelter.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl hover:border-slate-700 transition-all"
          >
            {/* HEADER ROW */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {shelter.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {shelter.city} · {shelter.region}
                </p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="text-sm text-slate-400 mb-6">
              Capacity:{" "}
              <span className="text-white font-semibold">
                {shelter.capacity}
              </span>
            </div>

            {/* ACTION */}
            <button
  onClick={() => openInGoogleMaps(shelter.lat, shelter.lng)}
  className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-semibold py-3 rounded-lg transition-all border border-emerald-500/30"
>
  Get Directions →
</button>


          </div>
        ))}
      </div>
    </div>
  );
}
