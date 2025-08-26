import e from "express";

const expressApplication = e();

expressApplication.get("/health", (req, res) => {
  return res.json({
    success: true,
    message: "health is ok!.."
  });
});

expressApplication.listen(3000, async () => {
  try {
    const res = await fetch("http://localhost:3000/health");
    const data = await res.json();
    console.log(data); 
  } catch (err) {
    console.error("Error fetching health:", err);
  }
});
