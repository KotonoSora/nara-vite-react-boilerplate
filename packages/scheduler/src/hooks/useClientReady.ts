import { useEffect, useState } from "react";

import { cancelIdleCallback } from "../utils/cancelIdleCallback";
import { scheduleIdleCallback } from "../utils/scheduleIdleCallback";

export const useClientReady = () => {
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    // Defer notifications to idle to keep hydration fast
    const id = scheduleIdleCallback(() => setClientReady(true));
    return () => cancelIdleCallback(id);
  }, []);

  return clientReady;
};
