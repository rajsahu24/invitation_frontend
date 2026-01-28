// "use client";

// import { motion } from "framer-motion";
// import { SubEvent, useEventStore } from "../lib/store";
// import SubEventCard from "./SubEventCard";

// interface ItineraryTimelineProps {
//   subEvents: SubEvent[];
// }

// export default function ItineraryTimeline({ subEvents }: ItineraryTimelineProps) {
//   const { rsvpStatus } = useEventStore();
//   const goingCount = Object.values(rsvpStatus).filter((s) => s === "going").length;

//   return (
//     <div className="py-8">
//       {/* Progress indicator */}
//       <motion.div
//         className="mb-8 bg-gradient-to-r from-violet-100 to-pink-100 rounded-2xl p-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm font-medium text-gray-600">Your RSVP Progress</span>
//           <span className="text-sm font-bold text-violet-600">
//             {goingCount} of {subEvents.length} events
//           </span>
//         </div>
//         <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//           <motion.div
//             className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
//             initial={{ width: 0 }}
//             animate={{ width: `${(goingCount / subEvents.length) * 100}%` }}
//             transition={{ duration: 0.5 }}
//           />
//         </div>
//       </motion.div>

//       {/* Timeline */}
//       <div className="space-y-0">
//         {subEvents.map((subEvent, index) => (
//           <SubEventCard key={subEvent.id} subEvent={subEvent} index={index} />
//         ))}
//       </div>
//     </div>
//   );
// }
