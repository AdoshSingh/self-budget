// "use client";
// import { useState, createContext, useContext } from "react";
// import { createAppStore, type StoreState } from "@/store/store";
// import { useStore } from "zustand";

// const StoreContext = createContext<typeof createAppStore | null>(null);

// export const useAppStore = <T,>(selector: (store: StoreState) => T,): T => {
//   const storeContext = useContext(StoreContext);
//   if(!storeContext) {
//     throw new Error(`useCounterStore must be used within CounterStoreProvider`)
//   }

//   return useStore(storeContext, selector);
// }

// const StoreProvider = ({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) => {
// 	const [store] = useState(() => createAppStore());
// 	return (
// 		<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
// 	);
// };

// export default StoreProvider;