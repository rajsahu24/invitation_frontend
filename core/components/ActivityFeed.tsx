// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";


// const emojiOptions = ["❤️", "🎉", "👍", "🚗", "✨", "😍"];

// export default function ActivityFeed() {
//   // const { comments, addComment, addReaction } = useEventStore();
//   const [newComment, setNewComment] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newComment.trim()) {
//       addComment({
//         userId: "current-user",
//         userName: "You",
//         content: newComment.trim(),
//       });
//       setNewComment("");
//     }
//   };

//   return (
//     <div className="py-6">
//       {/* Comment input */}
//       <form onSubmit={handleSubmit} className="mb-6">
//         <div className="flex gap-3">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
//             Y
//           </div>
//           <div className="flex-1">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Say something..."
//               className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none resize-none text-sm"
//               rows={2}
//             />
//             {newComment.trim() && (
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="mt-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full text-sm font-medium"
//               >
//                 Post
//               </motion.button>
//             )}
//           </div>
//         </div>
//       </form>

//       {/* Comments list */}
//       <div className="space-y-4">
//         <AnimatePresence mode="popLayout">
//           {comments.map((comment) => (
//             <motion.div
//               key={comment.id}
//               layout
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
//             >
//               <div className="flex gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
//                   {comment.userName.charAt(0)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="font-semibold text-gray-900">{comment.userName}</span>
//                     <span className="text-xs text-gray-500">{comment.timestamp}</span>
//                   </div>
//                   <p className="text-gray-700 text-sm">{comment.content}</p>

//                   {/* Reactions */}
//                   <div className="flex items-center gap-2 mt-3">
//                     <div className="flex gap-1">
//                       {Object.entries(comment.reactions).map(([emoji, count]) => (
//                         <motion.button
//                           key={emoji}
//                           whileHover={{ scale: 1.2 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => addReaction(comment.id, emoji)}
//                           className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
//                         >
//                           <span>{emoji}</span>
//                           <span className="text-xs text-gray-600">{count}</span>
//                         </motion.button>
//                       ))}
//                     </div>
//                     <div className="flex gap-1">
//                       {emojiOptions.slice(0, 3).map((emoji) => (
//                         <motion.button
//                           key={emoji}
//                           whileHover={{ scale: 1.3 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => addReaction(comment.id, emoji)}
//                           className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
//                         >
//                           {emoji}
//                         </motion.button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }
