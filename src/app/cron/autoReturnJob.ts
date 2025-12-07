import cron from "node-cron";
export const autoReturnJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Auto return job started");
    const now = new Date();
    // find the
    console.log("Auto return job completed");
  });
};
