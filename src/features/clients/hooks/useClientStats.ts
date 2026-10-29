// "use client";

// import { useMemo } from "react";

// import { useClients } from "./useClients";

// export function useClientStats() {
//   const { data, ...rest } = useClients();

//   const stats = useMemo(() => {
//     const clients = data ?? [];

//     return {
//       total: clients.length,

//       active: clients.filter(
//         (c) => c.status === "ACTIVE",
//       ).length,

//       inactive: clients.filter(
//         (c) => c.status === "INACTIVE",
//       ).length,

//       revenue: clients.reduce(
//         (sum, c) => sum + (c.totalRevenue ?? 0),
//         0,
//       ),
//     };
//   }, [data]);

//   return {
//     ...rest,
//     data,
//     stats,
//   };
// }